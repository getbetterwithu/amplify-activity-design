// 저장 직후 점검(관문 G3). 편집기 탭에서 이 파일 내용을 그대로 실행한다. 저장값을 읽기만 한다.
// 결과를 읽는 법: reference/lint.md 2절
(() => {
  const screens = window.__dc_resources.lessonQuery.listScreens({ includeHiddenScreens: true });
  const hit = { 필수실패: [], 검토필요: [], 수식: [], 표기: [], 배치: [], 경고: [], 이미지: [], 서식: [], 참조: [] };
  // 수식 노드 밖 일반 글에서 수식처럼 보이는 꼴
  const MATH = /(\^|\\[A-Za-z]+|[A-Za-z0-9)]\s*[=<>]\s*[-A-Za-z0-9(]|\d\s*\/\s*\d|\b(sin|cos|tan)\b|√)/;
  // 수식 노드 밖의 문자 변수(「x축」의 x)와 위 첨자 문자(x²)
  const PLAIN = /[A-Za-z]\s*[²³⁴]|(^|[^A-Za-z\\])[a-z](?=축|좌표|절편|의 값|의 방향)/;
  const parse = (d) => { try { return typeof d === 'string' ? JSON.parse(d) : d; } catch (e) { return null; } };
  const aliases = new Set();

  const walkDoc = (node, where) => {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'mq') {                             // 수식 노드 안은 일반 글 검사를 건너뛰고, 점 이름만 본다
      const t = (node.content || []).map((c) => c.text || '').join('');
      if (/[가-힣]/.test(t)) hit.수식.push(where + ' 수식 안에 한글이 섞임 「' + t.slice(0, 30) + '」');
      const rest = t.replace(/\\(mathrm|mathbf|text)\{[^}]*\}/g, '').replace(/\\[A-Za-z]+/g, '');
      if (/[A-Z]/.test(rest)) hit.표기.push(where + ' 점 이름 후보(\\mathrm 밖 대문자) 「' + t.slice(0, 30) + '」');
      return;
    }
    if (node.type === 'paragraph') {                      // 긴 문단: 100자 이상이면 나누도록 안내
      const len = (function count(n) {
        if (!n) return 0;
        if (n.type === 'text') return (n.text || '').length;
        return (n.content || []).reduce((a, c) => a + count(c), 0);
      })(node);
      if (len >= 100) hit.배치.push(where + ' 긴 문단 ' + len + '자 — 문장·항목 단위로 문단을 나누거나 목록으로 쓴다');
    }
    if (node.type === 'heading' && node.attrs && node.attrs.level !== 2)
      hit.서식.push(where + ' 큰 글자 단계 ' + node.attrs.level + ' (2단계만 쓴다)');
    if (node.type === 'text' && typeof node.text === 'string') {
      if (MATH.test(node.text) || PLAIN.test(node.text)) hit.수식.push(where + ' 「' + node.text.slice(0, 40) + '」');
      if (/(^|[^A-Za-z\\])[A-Z]{2,4}(?![A-Za-z])/.test(node.text))
        hit.표기.push(where + ' 수식 밖 대문자 약자 후보 「' + node.text.slice(0, 20) + '」 — 약자는 \\mathrm 수식으로');
      if ((node.text.match(/·/g) || []).length >= 4)
        hit.배치.push(where + ' 한 문단에 항목 ' + ((node.text.match(/·/g) || []).length + 1) + '개를 이어 붙임 「' + node.text.slice(0, 24) + '…」');
      return;
    }
    (node.content || []).forEach((c) => walkDoc(c, where));
  };

  const walk = (o, where) => {
    if (Array.isArray(o)) return o.forEach((v) => walk(v, where));
    if (!o || typeof o !== 'object') return;
    if (typeof o.alias === 'string') aliases.add(o.alias);
    // 편집기가 빨간 오류로 표시하는 것: 수식 답변에는 prompt sink가 없다
    if (o['input/expression'] && typeof o['input/expression'].script === 'string' && /(^|\n)\s*prompt\s*:/.test(o['input/expression'].script))
      hit.경고.push(where + ' 수식 답변 CL의 prompt는 없는 sink(질문은 앞 메모에 둔다)');
    // 편집기가 노란 경고로 표시하는 것: 액티비티는 호도법을 쓴다
    if (o.degreeMode === true) hit.경고.push(where + ' 그래프가 각도법(degreeMode) — 호도법으로 맞춘다');
    // 객체로 저장된 doc(교사 팁 등)은 walkDoc으로 한 번만 검사하고 아래 일반 재귀로 다시 들어가지 않는다(수식 노드 안 글을 다시 잡는 오탐 방지)
    if (o.type === 'doc') { walkDoc(o, where); return; }
    if (typeof o.doc === 'string') { const d = parse(o.doc); if (d && d.type === 'doc') walkDoc(d, where); }
    if (o['exhibit/image']) {
      const img = o['exhibit/image'];
      const altKeys = Object.keys(img).filter((k) => /alt/i.test(k));
      const filled = altKeys.some((k) => typeof img[k] === 'string' && img[k].trim() !== '');
      if (!filled) hit.이미지.push(where + ' 이미지 대체 텍스트 비어 있음');
      if (img.showBorder !== true) hit.이미지.push(where + ' 이미지 테두리 표시 꺼짐 — 주변 글과 구별되어야 하면 켠다(안내)');
    }
    // 객관식 선택지·카드·정렬 항목의 글(백틱으로 수식을 감싼 문자열): 백틱 안에 한글이 있으면 안 된다
    const checkStr = (s, key) => {
      (s.match(/`[^`]*`/g) || []).forEach((b) => {
        if (/[가-힣]/.test(b)) hit.수식.push(where + ' 백틱 수식 안에 한글이 섞임 ' + b.slice(0, 40));
      });
      const outside = s.replace(/`[^`]*`/g, '');           // 백틱 밖 일반 글에 수식 꼴이 있으면 안 된다(화면 제목은 제외)
      if (key !== 'title' && (MATH.test(outside) || PLAIN.test(outside)))
        hit.수식.push(where + ' 선택지·칸 글에 수식 꼴 「' + s.slice(0, 30) + '」 — 백틱 수식으로');
      if (/(^|[^A-Za-z`\\])[A-Z]{2,4}(?![A-Za-z])/.test(s.replace(/`[^`]*`/g, '')))
        hit.표기.push(where + ' 수식 밖 대문자 약자 후보 「' + s.slice(0, 20) + '」 — 약자는 \\mathrm 수식으로');
    };
    Object.entries(o).forEach(([k, v]) => {
      if (typeof v === 'string' && ['text', 'label', 'title', 'content'].includes(k)) checkStr(v, k);
      else if (typeof v === 'string') return;
      else walk(v, where);
    });
  };

  screens.forEach((s, i) => walk(s, '화면 ' + (i + 1) + '「' + (s.title || '') + '」'));

  // 화면 CL의 부제는 자동 줄바꿈이 없다(nowrap): 한 줄이 길면 안내한다(줄바꿈은 문자열 안의 실제 줄바꿈)
  screens.forEach((s, i) => {
    const sc = typeof s.script === 'string' ? s.script : '';
    (sc.match(/subtitle:[\s\S]*?(?=\n[a-zA-Z_]+:|$)/g) || []).forEach((blk) => {
      (blk.match(/"([^"]*)"/g) || []).forEach((q) => {
        q.slice(1, -1).split('\n').forEach((line) => {
          if (line.replace(/`[^`]*`/g, 'X').length > 55)
            hit.배치.push('화면 ' + (i + 1) + ' 부제 한 줄이 김(' + line.length + '자) — 단계·문장마다 줄바꿈으로 나눈다 「' + line.slice(0, 18) + '…」');
        });
      });
    });
  });

  // 한 열에 답칸이 둘 이상인데 질문 메모가 모두 답칸 위에 몰려 있는 경우
  const colsOf = (s) => {
    const out = [];
    const rows = (n) => {
      const ll = n && n.linearlayout;
      if (!ll) return;
      if (ll.mainType === 'rows') out.push((ll.components || []).map((c) => Object.keys(c)[0]));
      else (ll.components || []).forEach(rows);
    };
    rows(s.root);
    return out;
  };
  screens.forEach((s, i) => {
    colsOf(s).forEach((col) => {
      const memos = col.map((k, j) => (k === 'exhibit/text' ? j : -1)).filter((j) => j >= 0);
      const inputs = col.map((k, j) => (/^input\/(expression|text)$/.test(k) ? j : -1)).filter((j) => j >= 0);
      if (inputs.length >= 2 && memos.length >= 2 && Math.max(...memos) < Math.max(...inputs) &&
          memos.filter((j) => j > Math.min(...inputs)).length === 0)
        hit.배치.push('화면 ' + (i + 1) + ' 질문 메모가 답칸 위에 몰려 있음 — 질문 바로 아래에 그 답칸을 둔다');
    });
  });

  // 기하학·그래프 식의 라벨 글자(점 이름)가 \mathrm 없이 대문자로 들어 있는 경우
  const labelScan = (o, where) => {
    if (Array.isArray(o)) return o.forEach((v) => labelScan(v, where));
    if (!o || typeof o !== 'object') return;
    if (typeof o.label === 'string' && /`[^`]*[A-Z][^`]*`/.test(o.label) && !/\\mathrm|\\mathbf/.test(o.label))
      hit.표기.push(where + ' 그래프·기하학 라벨 「' + o.label.slice(0, 20) + '」 — 점 이름은 \\mathrm으로');
    Object.values(o).forEach((v) => labelScan(v, where));
  };
  screens.forEach((s, i) => labelScan(s, '화면 ' + (i + 1)));

  // 그래핑 계산기(exhibitMode:false)는 추가 목록에서 전체 화면 전용인데 두 칸 화면의 칸 안에 있는 경우
  const findGraphs = (o, acc) => {
    if (Array.isArray(o)) o.forEach((v) => findGraphs(v, acc));
    else if (o && typeof o === 'object') {
      if (o['input/graph']) acc.push(o['input/graph']);
      Object.values(o).forEach((v) => findGraphs(v, acc));
    }
    return acc;
  };
  screens.forEach((s, i) => {
    if (s.type !== 'two-column') return;
    findGraphs(s, []).forEach((g) => {
      if (g.exhibitMode === false)
        hit.경고.push('화면 ' + (i + 1) + ' ' + (g.alias || '') + ': 칸 안에 그래핑 계산기(exhibitMode:false) — 전체 화면 전용이라 칸 안에 쓰지 않는다. 일반 그래프로 바꾼다');
    });
  });

  // CL 안에서 직접 만든 지역 변수(i = ..., c = ...)는 구성요소 이름이 아니므로 제외한다
  const locals = new Set();
  const collect = (o) => {
    if (Array.isArray(o)) return o.forEach(collect);
    if (!o || typeof o !== 'object') return;
    if (typeof o.script === 'string') {
      const R = /(^|\n)\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/g; let m;
      while ((m = R.exec(o.script))) locals.add(m[2]);
    }
    Object.values(o).forEach(collect);
  };
  screens.forEach(collect);

  // CL이 읽는 이름이 실제로 있는지
  const READ = /\b([A-Za-z_][A-Za-z0-9_]*)\.(submitted|content|latex|matchesKey|isSelected|pressCount|timeSincePress|numericValue|script|sketch|choiceContent|correct)\b/g;
  const scan = (o, where) => {
    if (Array.isArray(o)) return o.forEach((v) => scan(v, where));
    if (!o || typeof o !== 'object') return;
    if (typeof o.script === 'string') {
      let m; READ.lastIndex = 0;
      while ((m = READ.exec(o.script))) {
        if (m[1] !== 'this' && !aliases.has(m[1]) && !locals.has(m[1])) hit.참조.push(where + ' 없는 이름 ' + m[1]);
      }
    }
    Object.values(o).forEach((v) => scan(v, where));
  };
  screens.forEach((s, i) => scan(s, '화면 ' + (i + 1)));

  // 필수 실패·검토 필요·완성도(권고). 구성요소 키 이름과 표·그래프 저장 구조를 읽어 판정한다.
  hit.완성도 = [];
  const docsOf = (o, acc) => {
    if (Array.isArray(o)) { o.forEach((v) => docsOf(v, acc)); return acc; }
    if (!o || typeof o !== 'object') return acc;
    if (o.type === 'doc') acc.push(o);
    if (typeof o.doc === 'string') { const d = parse(o.doc); if (d && d.type === 'doc') acc.push(d); }
    Object.entries(o).forEach(([k, v]) => { if (k !== 'teacherTips' && v && typeof v === 'object') docsOf(v, acc); });
    return acc;
  };
  // 화면 root의 구성요소를 키 이름과 값으로 모은다(input/…, exhibit/…, table, sketch, cardsort, multiple-choice, polypad, action-button 모두)
  const compsOf = (s) => {
    const out = [];
    const w = (n) => {
      if (!n || typeof n !== 'object') return;
      if (n.linearlayout) { (n.linearlayout.components || []).forEach(w); return; }
      const k = Object.keys(n)[0];
      if (k) out.push({ key: k, v: n[k] });
    };
    w(s.root);
    return out;
  };
  // 표: 머리글이 비었는지, 학생이 채울 빈 칸(머리글이 아닌 빈 칸)과 미리 채운 칸이 몇 개인지
  const tableInfo = (t) => {
    const rows = (t.rowIds || []).map((id) => (t.rows && t.rows[id]) || []);
    const txt = (id) => String((t.cells && t.cells[id] && t.cells[id].content) || '').trim();
    const bodyAll = t.columnHeaders ? rows.slice(1) : rows;
    // 왼쪽 열이 항목 이름(머리글 설정이거나, 본문 칸이 모두 채워진 이름 열)이면 그 열은 머리글 검사와 빈 칸 집계에서 뺀다
    const nameCol = !!t.rowHeaders || (bodyAll.length > 0 && bodyAll.every((r) => r[0] && txt(r[0]) !== ''));
    const head = t.columnHeaders ? (rows[0] || []).slice(nameCol ? 1 : 0).map(txt) : [];
    const body = bodyAll.map((r) => r.slice(nameCol ? 1 : 0));
    let inputCells = 0, filledCells = 0;
    body.forEach((r) => r.forEach((id) => { if (txt(id) === '') inputCells++; else filledCells++; }));
    return { headerAllEmpty: head.length > 0 && head.every((h) => h === ''), headerSomeEmpty: head.some((h) => h === ''), inputCells, filledCells };
  };
  // 그래프: 식이 하나도 없는 빈 좌표평면인지(기본 상태는 식 칸 하나가 latex 없이 들어 있음)
  const graphEmpty = (g) => {
    const list = (((g || {}).calculatorState || {}).expressions || {}).list || [];
    return !list.some((e) => e && ((typeof e.latex === 'string' && e.latex.trim() !== '') || e.type === 'table' || e.type === 'image'));
  };
  const textOf = (n) => !n ? '' : n.type === 'text' ? (n.text || '') : (n.content || []).map(textOf).join('');
  const scriptsOf = (o, acc) => {
    if (Array.isArray(o)) { o.forEach((v) => scriptsOf(v, acc)); return acc; }
    if (!o || typeof o !== 'object') return acc;
    if (typeof o.script === 'string') acc.push(o.script);
    Object.values(o).forEach((v) => { if (v && typeof v === 'object') scriptsOf(v, acc); });
    return acc;
  };
  let colorMarks = 0;
  const marksScan = (n) => {
    if (!n || typeof n !== 'object') return;
    (n.marks || []).forEach((m) => { if (m && (m.type === 'color' || (m.attrs && (m.attrs.hex || m.attrs.color)))) colorMarks++; });
    (n.content || []).forEach(marksScan);
  };
  const suffixKinds = new Set();
  const ASK = /(시오|생각해 보자|써 보자)[.!?\s]*$/;
  // 주어진 자료를 가리키는 발문(분명한 표현은 필수 실패, 애매한 표현은 검토 필요)
  const DATA = /((그래프|그림|표)(를|을)\s*(이용|보고|참고|살펴)|(다음|아래|위의)\s*(그래프|그림|표)|그림에서|표에서)/;
  const DATA_WEAK = /(이 그래프|이 그림|이 표|그래프에서)/;
  // 그리거나 표시하라는 발문
  const DRAW = /(그래프|그림|도형|점|선분)(을|를)[^.]{0,30}(그리시오|그리고|그려|표시하시오|나타내시오|나타내어)/;
  const ANSWER_KEYS = ['input/text', 'input/expression', 'multiple-choice', 'cardsort', 'sketch', 'polypad'];
  screens.forEach((s, i) => {
    const where = '화면 ' + (i + 1);
    const docs = docsOf(s, []);
    const comps = compsOf(s);
    const keys = comps.map((c) => c.key);
    const scripts = scriptsOf(s, []);
    const paras = [], heads = [];
    docs.forEach((d) => { marksScan(d); (function w(n) {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'paragraph') paras.push(textOf(n));
      else if (n.type === 'heading') heads.push(textOf(n));
      else (n.content || []).forEach(w);
    })(d); });
    const asks = paras.concat(heads).filter((t) => ASK.test(t.trim()));
    const all = paras.concat(heads).join(' ');
    const tables = comps.filter((c) => c.key === 'table').map((c) => tableInfo(c.v || {}));
    const graphs = comps.filter((c) => c.key === 'input/graph');
    const solidGraphs = graphs.filter((c) => !graphEmpty(c.v));
    const hasSketch = keys.includes('sketch');
    // 답 수단: 입력·고르기·카드 정렬·그림판 구성요소, 그리고 학생이 채울 빈 칸이 있는 표(끌기 그래프는 아래에서 따로 본다)
    const nAnswer = keys.filter((k) => ANSWER_KEYS.includes(k)).length + tables.filter((t) => t.inputCells > 0).length;
    if (asks.length > 0 && nAnswer === 0) {
      if (graphs.length > 0) hit.검토필요.push(where + ' 발문 ' + asks.length + '개, 입력·고르기·그림판·표 입력 칸이 없음 — 끌기·그리기로 답하는 그래프인지 확인 「' + asks[0].slice(0, 20) + '」');
      else hit.필수실패.push(where + ' 발문 ' + asks.length + '개인데 답 수단이 없음 「' + asks[0].slice(0, 20) + '」');
    }
    tables.forEach((t) => {
      if (t.headerAllEmpty) hit.필수실패.push(where + ' 표 머리글이 모두 비어 있음 — 머리글에 질문(소문항·항목)을 쓴다');
      else if (t.headerSomeEmpty) hit.검토필요.push(where + ' 표 머리글 일부가 비어 있음 — 왼쪽 위 모서리 칸이 아니면 채운다');
      if (t.inputCells === 0 && t.filledCells === 0) hit.필수실패.push(where + ' 표가 비어 있음');
    });
    if (asks.length > 0 && heads.length === 0)
      hit.완성도.push(where + ' 지시 문장이 있는데 큰 글자(h2)가 없음 — 핵심 문장·지시는 h2를 검토한다');
    // 주어진 자료(그래프·그림·표)를 가리키는 발문
    // 그림판 배경 종류: background.type이 blank(빈 배경)·graph(그래프 배경)·image(이미지 배경, 리걸패드 줄패드도 이미지)
    const sketchBg = comps.filter((c) => c.key === 'sketch').map((c) => (((c.v || {}).background) || {}).type || 'blank');
    const dataItems = solidGraphs.length + sketchBg.filter((t) => t === 'graph').length + keys.filter((k) => k === 'exhibit/image' || /geometry/.test(k)).length + tables.filter((t) => t.filledCells > 0).length;
    if (DATA.test(all) && dataItems === 0) {
      if (graphs.length > 0) hit.필수실패.push(where + ' 발문이 주어진 그래프를 가리키는데 그래프가 비어 있음(식이 없는 좌표평면)');
      else if (hasSketch && !keys.includes('polypad') && sketchBg.every((t) => t === 'blank')) hit.필수실패.push(where + ' 발문이 주어진 자료를 가리키는데 그림판 배경이 비어 있음(background.type blank) — 자료를 그래프로 그려 그림판으로 바꾸거나 이미지를 넣는다');
      else if (hasSketch || keys.includes('polypad')) hit.검토필요.push(where + ' 발문이 주어진 자료를 가리키는데 그림판·Polypad만 있음 — 배경에 자료가 실제로 있는지 확인');
      else hit.필수실패.push(where + ' 발문이 그래프·그림·표를 가리키는데 화면에 판단 자료가 없음');
    } else if (!DATA.test(all) && DATA_WEAK.test(all) && dataItems === 0 && !hasSketch) {
      hit.검토필요.push(where + ' 「이 그래프」처럼 자료를 가리키는 표현이 있는데 판단 자료가 없음 — 앞 화면 자료를 가리키면 정상');
    }
    if (!DATA.test(all)) graphs.filter((c) => graphEmpty(c.v)).forEach(() =>
      hit.검토필요.push(where + ' 빈 그래프(식 없음) — 학생이 그릴 좌표평면이면 정상, 아니면 자료를 넣는다'));
    // 그리거나 표시하라는 발문에는 그릴 수단이 있어야 한다
    if (DRAW.test(all)) {
      if (!hasSketch && graphs.length === 0) hit.필수실패.push(where + ' 그리라는 발문인데 그릴 수단(그림판·끌 수 있는 그래프)이 없음');
      else if (!hasSketch) hit.검토필요.push(where + ' 그리라는 발문인데 그림판 없이 그래프만 있음 — 끌 수 있는 점과 판정이 있는지 확인(보기 전용 그래프이면 실패)');
    }
    // 풀이를 쓰는 화면에는 풀이 공간이 있어야 한다(교과서 문제 화면은 필수, 계획 대조에서도 본다)
    if (asks.length > 0 && !hasSketch && !keys.includes('cardsort') && !keys.includes('polypad') &&
        (tables.some((t) => t.inputCells > 0) || keys.includes('input/expression') || keys.includes('input/text')))
      hit.검토필요.push(where + ' 풀이 공간(그림판)이 없음 — 풀이를 쓰는 화면이면 둔다(교과서 문제 화면은 기본으로 두며, 뺐다면 구성표에 기록이 있어야 한다)');
    // 카드 정렬은 다른 구성요소와 함께 두면 저장되지 않거나 겹칠 수 있다
    if (keys.includes('cardsort') && keys.length > 1)
      hit.검토필요.push(where + ' 카드 정렬이 다른 구성요소(' + keys.filter((k) => k !== 'cardsort').join(', ') + ')와 함께 있음 — 카드 정렬은 전체 화면 구성요소라 빈 화면에 하나만 둔다');
    // 그래프 자신의 스크립트에 correct가 있을 때만 본다(다른 구성요소의 correct는 해당 없음)
    graphs.forEach((c) => {
      const sc = (c.v || {}).script;
      if (typeof sc === 'string' && /(^|\n)\s*correct\s*:/.test(sc) && !/pointLabel\s*\(/.test(sc) &&
          !scripts.some((o) => o !== sc && /\.script\./.test(o)))
        hit.완성도.push(where + ' 그래프에 correct만 있고 학생에게 보이는 반응(pointLabel 등)이 없음');
    });
    scripts.forEach((sc) => {
      (sc.match(/(cellSuffix\([^)]*\)|suffix)\s*:[^\n]*/g) || []).forEach((line) => {
        if (/[✅❌]/.test(line)) suffixKinds.add('기호');
        if (/"[^"]*[가-힣][^"]*"/.test(line)) suffixKinds.add('글자');
      });
    });
  });
  if (suffixKinds.size > 1) hit.완성도.push('활동 전체: 답 칸 피드백에 기호(✅/❌)와 글자가 섞임 — 같은 종류의 칸은 같은 표시를 쓴다');
  // 화면별 색 글자: 그래프 색 변수(colorLatex)를 쓰는 화면인데 메모에 색 글자가 0곳이면 안내
  screens.forEach((s, i) => {
    let marks = 0;
    docsOf(s, []).forEach((d) => { (function m(n) { if (!n || typeof n !== 'object') return; (n.marks || []).forEach((k) => { if (k && k.type === 'color') marks++; }); (n.content || []).forEach(m); })(d); });
    const usesPalette = JSON.stringify(s).includes('colorLatex');
    if (usesPalette && marks === 0) hit.완성도.push('화면 ' + (i + 1) + ': 그래프에 역할 색을 쓰는데 메모 글자색이 0곳 — 같은 대상을 같은 글자색으로 칠하거나 G2 6번에 이유를 쓴다');
  });
  // 객관식·체크박스 정답 표시(answerKey) 목록: 의도와 다른 정답 표시(예상 문항에 정답이 들어감 등)를 사람이 확인하도록 보여 준다
  hit.정답표시 = [];
  screens.forEach((s, i) => {
    (function w(o) {
      if (Array.isArray(o)) return o.forEach(w);
      if (!o || typeof o !== 'object') return;
      const mc = o['multiple-choice'];
      if (mc) {
        const key = mc.answerKey && mc.answerKey.choiceIds ? Object.keys(mc.answerKey.choiceIds).filter((k) => mc.answerKey.choiceIds[k]) : [];
        const txt = key.map((k) => (mc.choices && mc.choices[k] && mc.choices[k].text || k).slice(0, 30));
        hit.정답표시.push('화면 ' + (i + 1) + ' ' + (mc.alias || '') + ': ' + (txt.length ? '정답 표시 ' + txt.join(' / ') : '정답 표시 없음'));
      }
      Object.values(o).forEach(w);
    })(s.root);
  });

  const uniq = (a) => [...new Set(a)];
  Object.keys(hit).forEach((k) => { hit[k] = uniq(hit[k]); });
  const report = Object.assign({ 요약: '필수 실패 ' + hit.필수실패.length + '건 · 검토 필요 ' + hit.검토필요.length + '건' }, hit);
  console.log(JSON.stringify(report, null, 1));
  return report;
})();
