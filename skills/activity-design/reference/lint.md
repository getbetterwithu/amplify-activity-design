# 저장 직후 점검 (관문 G3)

화면을 저장할 때마다 이 점검을 돌리고, **걸린 것을 고치기 전에는 「완료」라고 쓰지 않는다.** 말로 확인했다고 하지 않고 아래 결과를 그대로 보여 준다. 점검은 저장값을 읽기만 하며 활동을 바꾸지 않는다.

## 1. 점검 스크립트
편집기 탭에서 실행한다(저장값 읽기). 내부 API 이름은 Amplify가 바꿀 수 있으니 오류가 나면 `editor-ops.md` 1절의 읽기 방법으로 화면 배열을 얻어 같은 규칙으로 직접 검사한다. (확인됨)

```js
(() => {
  const screens = window.__dc_resources.lessonQuery.listScreens({ includeHiddenScreens: true });
  const hit = { 수식: [], 표기: [], 배치: [], 경고: [], 이미지: [], 서식: [], 참조: [] };
  // 수식 노드 밖 일반 글에서 수식처럼 보이는 꼴
  const MATH = /(\^|\\[A-Za-z]+|[A-Za-z0-9)]\s*[=<>]\s*[-A-Za-z0-9(]|\d\s*\/\s*\d|\b(sin|cos|tan)\b|√)/;
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
      if (MATH.test(node.text)) hit.수식.push(where + ' 「' + node.text.slice(0, 40) + '」');
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
    if (o.type === 'doc') walkDoc(o, where);
    if (typeof o.doc === 'string') { const d = parse(o.doc); if (d && d.type === 'doc') walkDoc(d, where); }
    if (o['exhibit/image']) {
      const img = o['exhibit/image'];
      const altKeys = Object.keys(img).filter((k) => /alt/i.test(k));
      const filled = altKeys.some((k) => typeof img[k] === 'string' && img[k].trim() !== '');
      if (!filled) hit.이미지.push(where + ' 이미지 대체 텍스트 비어 있음');
      if (img.showBorder !== true) hit.이미지.push(where + ' 이미지 테두리 표시 꺼짐 — 주변 글과 구별되어야 하면 켠다(안내)');
    }
    // 객관식 선택지·카드·정렬 항목의 글(백틱으로 수식을 감싼 문자열): 백틱 안에 한글이 있으면 안 된다
    const checkStr = (s) => {
      (s.match(/`[^`]*`/g) || []).forEach((b) => {
        if (/[가-힣]/.test(b)) hit.수식.push(where + ' 백틱 수식 안에 한글이 섞임 ' + b.slice(0, 40));
      });
      if (/(^|[^A-Za-z`\\])[A-Z]{2,4}(?![A-Za-z])/.test(s.replace(/`[^`]*`/g, '')))
        hit.표기.push(where + ' 수식 밖 대문자 약자 후보 「' + s.slice(0, 20) + '」 — 약자는 \\mathrm 수식으로');
    };
    Object.entries(o).forEach(([k, v]) => {
      if (typeof v === 'string' && ['text', 'label', 'title', 'content'].includes(k)) checkStr(v);
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

  // 완성도 안내 (미확인: 아래 검사는 저장값 구조를 가정한 안내이며 실패 처리하지 않는다)
  hit.완성도 = [];
  const docsOf = (o, acc) => {
    if (Array.isArray(o)) { o.forEach((v) => docsOf(v, acc)); return acc; }
    if (!o || typeof o !== 'object') return acc;
    if (o.type === 'doc') acc.push(o);
    if (typeof o.doc === 'string') { const d = parse(o.doc); if (d && d.type === 'doc') acc.push(d); }
    Object.entries(o).forEach(([k, v]) => { if (k !== 'teacherTips' && v && typeof v === 'object') docsOf(v, acc); });
    return acc;
  };
  const keysOf = (o, acc) => {
    if (Array.isArray(o)) { o.forEach((v) => keysOf(v, acc)); return acc; }
    if (!o || typeof o !== 'object') return acc;
    Object.keys(o).forEach((k) => { if (/^(input|exhibit)\//.test(k)) acc.push(k); });
    Object.values(o).forEach((v) => { if (v && typeof v === 'object') keysOf(v, acc); });
    return acc;
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
  const DATA = /(그래프를 보고|다음 그래프|아래 그래프|이 그래프|다음 그림|그림을 보고|그림에서|표를 보고|표에서)/;
  screens.forEach((s, i) => {
    const where = '화면 ' + (i + 1);
    const docs = docsOf(s, []);
    const keys = keysOf(s, []);
    const scripts = scriptsOf(s, []);
    const paras = [], heads = [];
    docs.forEach((d) => { marksScan(d); (function w(n) {
      if (!n || typeof n !== 'object') return;
      if (n.type === 'paragraph') paras.push(textOf(n));
      else if (n.type === 'heading') heads.push(textOf(n));
      else (n.content || []).forEach(w);
    })(d); });
    const asks = paras.concat(heads).filter((t) => ASK.test(t.trim()));
    const answers = keys.filter((k) => /^input\//.test(k));
    if (asks.length > answers.length)
      hit.완성도.push(where + ' 발문 ' + asks.length + '개, 답 수단 ' + answers.length + '개 — 발문마다 답할 칸이 있는지 본다 「' + asks[0].slice(0, 20) + '」');
    if (asks.length > 0 && heads.length === 0)
      hit.완성도.push(where + ' 지시 문장이 있는데 큰 글자(h2)가 없음 — 핵심 문장·지시는 h2를 검토한다');
    const all = paras.concat(heads).join(' ');
    if (DATA.test(all) && !keys.some((k) => /graph|image|table|geometry|sketch/.test(k)))
      hit.완성도.push(where + ' 발문이 그래프·그림·표를 가리키는데 화면에 판단 자료가 없음');
    scripts.forEach((sc) => {
      if (/(^|\n)\s*correct\s*:/.test(sc) && /graph/.test(keys.join(' ')) && !/pointLabel\s*\(/.test(sc) &&
          !scripts.some((o) => o !== sc && /\.script\./.test(o)))
        hit.완성도.push(where + ' 그래프에 correct만 있고 학생에게 보이는 반응(pointLabel 등)이 없음');
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
  console.log(JSON.stringify(hit, null, 1));
  return hit;
})();
```

## 2. 결과를 읽는 법
| 항목 | 뜻 | 걸리면 |
|---|---|---|
| 수식 | 수식 노드 밖 일반 글에 `^`, `\`, `변수 = 값`, 분수 꼴, `sin` 등이 남음 | 해당 글을 수식 노드로 바꾼다(`editor-ops.md` 5절, 9-2절). 단어 속 `=`처럼 정말 일반 글이면 이유를 적고 둔다. |
| 표기 | 수식 안에서 `\mathrm{}`·`\mathbf{}` 밖에 대문자가 있음(점 이름이 기울어질 수 있음) | 점 이름이면 `\mathrm{}`으로 감싼다(같은 화면의 점 이름을 모두 맞춘다). 상수·집합 기호처럼 정말 점 이름이 아니면 그대로 둔다. 안내이며 실패 처리하지 않는다. |
| 경고 | 편집기가 오류·경고로 표시하는 것을 저장값에서 미리 잡음(수식 답변 CL의 `prompt`, 각도법 그래프) | 수식 답변 CL에서 `prompt` 줄을 지우고 질문을 앞 메모에 둔다. 그래프 설정에서 각도 단위를 호도법으로 맞춘다. |
| 배치 | 한 문단에 `·`로 항목 5개 이상을 이어 붙임, 한 문단이 100자 이상, 또는 부제 한 줄이 55자 초과(부제는 자동 줄바꿈 없음) | 한 줄에 하나씩 나누거나 2열로 나눈다(`design-rules.md` 3-1절). 안내이며 실패 처리하지 않는다. |
| 이미지 | 이미지 대체 텍스트가 비어 있음, 또는 테두리 표시가 꺼져 있음(안내) | 이미지 내용 전문을 쓴다(`design-rules.md` 7절). |
| 서식 | 큰 글자가 2단계가 아님 | 안내만 한다. 쓸지 말지는 사용자 지침(`design-rules.md` 3절). |
| 참조 | CL이 읽는 구성요소 이름이 활동에 없음 | 이름을 맞추거나 CL을 고친다(`design-rules.md` 2-3절). |
| 완성도 | 발문 수보다 답 수단이 적음, 지시 문장에 h2 없음, 판단 자료 없음, 그래프 판정에 학생 반응 없음, 피드백 표기 섞임, 색 글자 0개 | 화면 완성 기준표(3절)로 확인한다. 끌기·그리기로 답하는 발문(「움직이시오」, 「그래프를 완성하시오」)이나 교사가 검토하는 화면처럼 정상인 경우는 이유를 적고 둔다. 안내이며 실패 처리하지 않는다. (미확인) |
| 정답표시 | 객관식·체크박스마다 정답으로 표시된 선택지 | 설계와 맞는지 사람이 본다. 예상·의견 문항인데 정답이 표시돼 있거나, 정답 문항인데 「정답 표시 없음」이면 고친다. 안내이며 실패 처리하지 않는다. |

- **자동 점검 0건은 「표기·참조 오류 없음」이라는 뜻이지 화면이 완성되었다는 뜻이 아니다.** 보고할 때 자동 점검 결과와 화면 완성 기준표(3절) 결과를 따로 쓴다.
- 교사 참고 사항 안의 긴 문단 안내는 고치지 않아도 된다(학생이 보지 않는다).
- 점검에 걸린 것이 0건이어도 **편집기에 표시되는 경고(문법 오류, 다른 화면 참조, 없는 대상 참조, 각도법)는 별도**다. 이 경고는 저장값에 없으므로 아래 2-2절의 코드로 편집기 화면에서 읽는다. 통과 조건은 「경고 아이콘이 없다」이다.
- 학생 미리보기에서 수식이 실제로 그려지는지는 이 점검으로 알 수 없다. 수식이 있는 화면은 미리보기로 한 번 확인한다.

## 2-0. 시작 상태 정답 노출 확인 (사람이 본다)
점검 스크립트는 정답을 모르므로 이 항목을 잡지 못한다. 저장 직후 학생 미리보기를 처음 연 상태(아무것도 조작하지 않은 상태)에서 아래 표를 답변에 쓴다.

| 화면 | 보이는 값(그래프 라벨, 점 좌표, 표 칸, 부제, 메모) | 이 화면의 정답 | 정답이 보이거나 바로 읽히는가 |
|---|---|---|---|

- 「예」가 하나라도 있으면 완료가 아니다. 라벨을 숨기거나(조건부 식, `graph-cl-recipes.md` 7절), 시작값을 정답과 다른 값으로 바꾸거나, 질문을 바꾼다.
- 학생이 점을 끌어 값을 찾아내는 화면이면 끌기 전에는 정답이 보이지 않아야 한다. 끌어서 찾는 것 자체가 활동이면 그 사실을 표에 적는다.

## 2-1. 미리보기 스크롤 확인
학생 미리보기를 연 상태에서 실행한다(화면마다). 세로로 스크롤되는 영역이 있으면 목록으로 나온다. 목록이 비어 있어야 통과다. 찾은 화면은 글 줄이기만 바로 하고, 그 밖의 구성 변경(열 나누기, 화면 나누기, 구성요소 바꾸기·삭제·이동)은 넘친 양·원인 구성요소·고칠 안을 보여 주고 교사에게 묻는다(`SKILL.md` 일하는 순서 2). (1회 관찰)

```js
(() => {
  const dlg = document.querySelector('[role="dialog"]') || document.body;
  const out = [];
  dlg.querySelectorAll('*').forEach((el) => {
    const s = getComputedStyle(el);
    if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2)
      out.push((el.tagName + '.' + (el.className || '').toString().slice(0, 30)) + ' 넘침 ' + (el.scrollHeight - el.clientHeight) + 'px');
  });
  return out;
})();
```

- 미리보기 크기는 브라우저 창에 따라 달라진다(고정된 16:9가 아니다, 2회 관찰). 결과와 함께 **측정한 창 크기**를 적는다. 예: 「1440×900 창, 넘침 없음」.
- 조작이 가려지면 먼저 카드·화면 위치를 옮기거나 대상을 화면 안으로 굴린다. 화면 배율 조정은 마지막 수단이다(배율은 사이트별로 기억되어 사용자 탭에 남는다). 배율을 바꿨으면 판정 전에 되돌리고, 되돌렸는지 확인한다.

## 2-2. 편집기 경고·오류 아이콘 읽기
화면 목록이 다 그려진 편집기에서 실행한다. 경고가 있는 화면 번호와 종류가 나온다. 목록이 비어 있어야 통과다. (확인됨)

```js
[...document.querySelectorAll('[role="option"]')].map((o, i) => {
  const icon = o.querySelector('.miniscreen-warning i');
  return icon ? { 화면: i + 1, 종류: icon.className } : null;
}).filter(Boolean);
```

- 종류 `warning-color`는 노란 경고, `error-color`는 빨간 오류다.
- 문구는 아이콘에 마우스를 올리면 나오는 풍선(`.dcg-tooltip-message`)에 있다. 누르지 않아도 된다.
- 오류가 있는 구성요소는 그 화면을 연 뒤 「스크립트 열기」 버튼의 `오류 있음` 표시로 찾고, 코드 칸의 빨간 밑줄에 마우스를 올리면 편집기가 「없는 sink이고 유효한 sink는 …」 같은 정확한 문구를 알려 준다. 값을 고치지 않고 읽기만 한다. 스크립트 창에는 닫기 버튼이 없을 수 있으니 열었다면 값을 넣지 않은 채 편집기를 다시 불러 닫는다. (1회 관찰)

## 3. 화면 완성 기준표 (관문 G2)
규칙은 여러 문서에 흩어져 있어 화면을 만드는 순간 떠올리기 어렵다. 그래서 화면마다 **이 문서를 다시 열어** 아래 표를 채운다. 기억으로 채우지 않는다.
- **만들기 직전**: 1~4번의 「계획」 칸을 채운다. 비어 있으면 만들지 않는다.
- **저장 직후**: 1~8번의 「결과」 칸을 채운다. 「아니오」가 있으면 고친 뒤 다시 채운다.
- 계획은 절 시작 답변 안에, 결과는 그 화면을 만든 뒤의 답변 안에 쓴다. 별도 기록 파일은 만들지 않는다.

| 항목 | 만들기 직전 (계획) | 저장 직후 (결과) |
|---|---|---|
| 1. 구성표의 이 화면 줄 | 학생이 할 생각 · 주 구성요소 · 판단 자료를 구성표에서 그대로 옮겨 적는다. 안 1·안 2 중 교사가 고른 것. 교과서 문제 화면이면 한 문제인가 | 만든 것과 다른 점. 없으면 「없음」. 있으면 만들기 전에 교사에게 물었는가 |
| 2. 판단 자료 | 발문이 가리키는 그래프·그림·표와 들어갈 구성요소. 없으면 「없음」 | 화면에 실제로 있는가 |
| 3. 발문마다 답할 수단 | 발문 목록과 각 발문의 답 수단(답 칸, 끌 수 있는 점이 있는 그래프, 그림판, 카드 정렬 등) | 발문 수와 답 수단이 맞는가 |
| 4. 반응(피드백) | 조작·입력마다 학생이 보는 반응과 고른 이유(`design-rules.md` 0절 피드백 고르기). 교사가 검토하는 화면은 「해당 없음(교사 검토)」 | 미리보기에서 정답·오답을 넣어 반응을 봤는가 |
| 5. 제작법 | 쓰는 구성요소의 제작법이 reference에 있는가. 없으면 복사본 시험 계획 | 「계획 대비 후퇴」가 있으면 보고했는가 |
| 6. 글씨와 색 | h2로 쓸 문장(핵심·선언·지시), 쓸 역할 색과 칠할 말(화면마다 1~2곳, 0곳이면 이유) | 저장값에 h2와 색 글자가 들어갔는가 |
| 7. 정답 노출·수식 | 시작 상태에서 보이면 안 되는 값, 모든 수식·숫자는 수식 노드 | 2-0절 시작 상태 표, 1절 점검 결과 |
| 8. 배치 | 열 구성, 지시 위치, 표의 열 수(이름 열 포함, 두 열 화면 5열 이상·한 열 화면 7열 이상이면 행열을 뒤바꾼 모양으로 계획), 풀이 공간이 필요한 화면이면 리걸패드(두 열 1:1, 전체 폭 16:9) | 측정한 창 크기와 스크롤 결과(2-1절) |

- 색 프리셋, 사용자 지침(문체·용어·색 지정), 교사가 준 이미지의 크기·선명도·경로(`illustration.md`)는 활동을 시작할 때 한 번 적고, 바뀔 때만 다시 적는다.
- 여러 화면을 한꺼번에 고칠 때도 화면마다 표를 채운다.

## 4. 종료 보고 (관문 G4)
작업을 마칠 때 다음 표를 쓴다. 못 지킨 규칙을 숨기지 않는다.

| 지킨 규칙 | 못 지킨 규칙(이유) | 확인하지 못한 것 | 계획 대비 후퇴 |
|---|---|---|---|
| (예: 시작 선언, 수식 노드, 점검 0건) | (예: 대체 텍스트 비어 있음 — 이미지 업로드 실패) | (예: 학생 계정에서의 동작) | (예: Polypad 대수 타일 계획 → 그래프 넓이 모형으로 바꿈, 제작법 미확인, 교사 확인 받음) |

- 「계획 대비 후퇴」는 구성표에서 정한 구성요소를 만들지 못해 바꾼 것이다. 없으면 「없음」이라고 쓴다.
- 표 아래에 최종 구성요소 분포표(`brainstorming.md` 0-4)를 다시 붙인다. 확정 때와 달라졌으면 어디가 왜 달라졌는지 적는다.
- **화면별 완성도 표를 붙인다.** 화면 · 평가(상 / 중 / 하) · 근거 한 줄 · 측정한 창 크기와 스크롤. 「자동 점검 0건」을 완성의 근거로 쓰지 않는다.
- 끝으로 **활동 전체를 한 번 훑는다**: ① 같은 종류 칸의 피드백 표시가 같은가 ② 학생에게 반응이 없는 조작 화면 ③ 답 수단이 없는 발문 ④ 판단 자료가 없는 화면. 찾은 것을 적는다.
