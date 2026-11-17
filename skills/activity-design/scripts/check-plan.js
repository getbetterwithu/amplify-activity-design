// 계획 대 저장값 대조. 아래 PLAN·SCREEN_COUNT·FREE·LINES·CARDS·ROWS를 채운 뒤 편집기 탭에서 실행한다.
// 채우는 법과 결과를 읽는 법: reference/lint.md 2-3절
(() => {
  // 절 시작 때 확정한 구성요소를 「화면 제목: [구성요소 키…]」로 적는다. 같은 제목이 여럿이면 「제목#2」처럼 몇 번째인지 붙인다.
  // 키: exhibit/text, exhibit/image, input/graph, input/expression, input/text, table, sketch, cardsort, multiple-choice, polypad, action-button
  const PLAN = {
    // '화면 제목': ['exhibit/text', 'exhibit/image', 'table', 'sketch'],
  };
  const SCREEN_COUNT = null;   // 구성표에 적힌 이 절의 화면 수(숫자). null로 두지 말고 구성표를 읽어 채운다
  const FREE = false;          // 교사가 「카드 없음(자유 구성)」을 요청해 구성표에 적었을 때만 true
  const LINES = [];            // 구성표의 이 절 줄 원문을 그대로 붙여 넣는다(결과에 되풀이되어 확정 조합과 대조된다)
  // 카드별 계약: screen-catalog.md의 계약 표를 그대로 옮긴다.
  // '카드 이름': { 필수: [키…], 슬롯: { <슬롯>: { <선택값>: [그 선택이 더하는 키…] } }, 단독: [키…] }
  const CARDS = {};
  // 구성표 절 줄을 옮긴다: { 제목: '화면 제목', 카드: '카드 이름', 선택: { 슬롯명: '선택값' } }. 카드 이름은 CARDS와 정확히 같아야 한다
  const ROWS = [];
  const screens = window.__dc_resources.lessonQuery.listScreens({ includeHiddenScreens: true });
  const keysOf = (s) => {
    const out = [];
    const w = (n) => {
      if (!n || typeof n !== 'object') return;
      if (n.linearlayout) { (n.linearlayout.components || []).forEach(w); return; }
      const k = Object.keys(n)[0];
      if (k) out.push(k);
    };
    w(s.root);
    return out;
  };
  const count = (a, k) => a.filter((x) => x === k).length;
  const res = { 요약: '', 구성표줄: LINES, 빠진것: [], 화면없음: [], 계획에없음: [], 계약없는화면: [] };
  // 구성표 줄 + 카드 계약에서 PLAN을 만든다(제작자가 PLAN을 직접 쓰지 않는다). 계약에 없는 카드 이름·슬롯·선택값은 추측하지 않고 실패로 센다
  const PLANALL = Object.assign({}, PLAN);
  ROWS.forEach((row) => {
    const card = CARDS[row.카드];
    if (!card) { res.빠진것.push('카드 계약을 찾지 못함: ' + row.카드 + ' (' + row.제목 + ')'); return; }
    let keys = (card.필수 || []).slice();
    Object.entries(card.슬롯 || {}).forEach(([slot, options]) => {
      const pick = (row.선택 || {})[slot];
      if (pick === undefined) { res.빠진것.push(row.제목 + ': 슬롯 「' + slot + '」 선택이 구성표에 없음'); return; }
      if (!options[pick]) { res.빠진것.push(row.제목 + ': 슬롯 「' + slot + '」의 선택값 「' + pick + '」이 계약에 없음'); return; }
      keys = keys.concat(options[pick]);
    });
    if ((card.단독 || []).length) keys = card.단독.slice();   // 단독 조건: 그 구성요소만 있어야 한다
    PLANALL[row.제목] = keys;
  });
  const planned = Object.keys(PLANALL);
  // PLAN이 비었거나 구성표의 화면 수와 다르면 검사를 줄인 것이다. 자유 구성은 교사 요청이 기록된 경우만 허용한다
  if (!FREE && planned.length === 0) res.빠진것.push('PLAN이 비어 있음 — 구성표에 확정 조합이 없으면 완료할 수 없다');
  if (!FREE && SCREEN_COUNT === null) res.빠진것.push('구성표 화면 수(SCREEN_COUNT)가 비어 있음 — 구성표를 읽어 채운다');
  if (!FREE && SCREEN_COUNT !== null && planned.length > 0 && SCREEN_COUNT !== planned.length)
    res.빠진것.push('구성표 화면 수 ' + SCREEN_COUNT + '개, PLAN 항목 ' + planned.length + '개 — 어긋남');
  if (!FREE && LINES.length === 0) res.빠진것.push('구성표 줄 원문(LINES)이 비어 있음 — 확정 조합의 출처를 붙인다');
  const titleOf = (name) => name.replace(/#\d+$/, '');
  const plannedTitles = new Set(planned.map(titleOf));
  screens.forEach((s) => { if (!plannedTitles.has(s.title)) res.계약없는화면.push(s.title); });
  Object.entries(PLANALL).forEach(([name, want]) => {
    const m = name.match(/^(.*?)(?:#(\d+))?$/);
    const s = screens.filter((x) => x.title === m[1])[(m[2] ? +m[2] : 1) - 1];
    if (!s) { res.화면없음.push(name); return; }
    const have = keysOf(s);
    new Set(want).forEach((k) => {
      const need = k === 'exhibit/text' ? 1 : count(want, k);   // 메모는 개수가 아니라 있는지만 본다
      if (count(have, k) < need) res.빠진것.push(name + ': ' + k + ' ' + (need - count(have, k)) + '개 빠짐');
    });
    new Set(have).forEach((k) => { if (!want.includes(k)) res.계획에없음.push(name + ': ' + k + ' (계획에 없음)'); });
  });
  res.계약없는화면 = [...new Set(res.계약없는화면)];
  res.요약 = (FREE ? '[자유 구성: 교사 요청] ' : '') + '계획에서 빠진 것 ' + res.빠진것.length + '건 · 화면 없음 ' + res.화면없음.length + '건 · 계획에 없는 것 ' + res.계획에없음.length + '건 · 계약 없는 화면 ' + res.계약없는화면.length + '개';
  console.log(JSON.stringify(res, null, 1));
  return res;
})();
