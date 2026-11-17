// 학생 미리보기 스크롤 확인. 학생 미리보기를 연 상태에서 화면마다 실행한다.
// 결과를 읽는 법: reference/lint.md 2-1절
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
