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

- 점검에 걸린 것이 0건이어도 **편집기에 표시되는 경고(문법 오류, 다른 화면 참조, 없는 대상 참조, 각도법)는 별도**다. 이 경고는 저장값에 없으므로 아래 2-2절의 코드로 편집기 화면에서 읽는다. 통과 조건은 「경고 아이콘이 없다」이다.
- 학생 미리보기에서 수식이 실제로 그려지는지는 이 점검으로 알 수 없다. 수식이 있는 화면은 미리보기로 한 번 확인한다.

## 2-1. 미리보기 스크롤 확인
학생 미리보기를 연 상태에서 실행한다(화면마다). 세로로 스크롤되는 영역이 있으면 목록으로 나온다. 목록이 비어 있어야 통과다. 찾은 화면은 `design-rules.md` 3-1절대로 줄인다. (1회 관찰)

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

미리보기 창 자체 크기는 바꾸지 않는다. 기본 크기에서 확인한 결과만 보고한다.

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

## 3. 제작 전 체크리스트 (관문 G2)
화면 하나를 **만들거나 고치기** 직전에 아래를 한 줄씩 답변에 쓴다(여러 화면을 한꺼번에 고칠 때는 고칠 화면 목록 위에 한 번 쓴다). 비어 있는 항목이 있으면 시작하지 않는다.
- 색 프리셋: 확정된 값 (예: ① 기본형)
- 구성표: 이 화면이 확정된 구성표의 몇 번째인지
- 수식: 모든 수식·숫자를 수식 노드로 넣는다 (`amplify-math` 규칙을 읽었다)
- 삽화: 추천 조건에 해당하는가 (`illustration.md`)
- 교사가 준 이미지: 원본 가로×세로 픽셀, 선명도, 선택한 경로(미디어 / 폴리패드 필기 / 그래프 변환 / 다시 그리기) (`illustration.md`)
- 읽히는 화면: 항목을 문단·열로 나누었고 스크롤이 없다 (`design-rules.md` 3-1절, 2-1절 확인)
- 사용자 지침: 문체·용어·색 지정이 있으면 그 내용

## 4. 종료 보고 (관문 G4)
작업을 마칠 때 다음 표를 쓴다. 못 지킨 규칙을 숨기지 않는다.

| 지킨 규칙 | 못 지킨 규칙(이유) | 확인하지 못한 것 |
|---|---|---|
| (예: 시작 선언, 수식 노드, 점검 0건) | (예: 대체 텍스트 비어 있음 — 이미지 업로드 실패) | (예: 학생 계정에서의 동작) |
