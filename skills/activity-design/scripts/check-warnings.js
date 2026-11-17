// 편집기 경고·오류 아이콘 읽기. 화면 목록이 다 그려진 편집기에서 실행한다. 빈 목록이어야 통과다.
// 결과를 읽는 법: reference/lint.md 2-2절
[...document.querySelectorAll('[role="option"]')].map((o, i) => {
  const icon = o.querySelector('.miniscreen-warning i');
  return icon ? { 화면: i + 1, 종류: icon.className } : null;
}).filter(Boolean);
