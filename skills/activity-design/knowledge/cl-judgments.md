# CL sink·source 쓰임과 동작

> 구성요소별 sink·source가 무엇을 하고, 어떻게 쓰고, 무엇을 조심하는지 한 줄씩 적었다. 이름이 그 구성요소에 있는지는 `cl-sinks.md`에서 먼저 확인한다.
> 이 문서와 `cl-pitfalls.md`에 적힌 동작은 편집기·미리보기·대시보드에서 확인한 것이다(확인됨). **여기에 없는 sink·source·함수는 쓰지 않는다.** 필요한 기능이 여기에 없으면 쓰기 전에 교사에게 묻는다.

## 목차
1. CL 기본 — sink·source, 변수, `this`, 줄 순서, 문자열, 연산, 주석, 오류 표시
2. 그래프
3. 그림판
4. 수식 답변
5. 객관식·체크박스
6. 정렬 리스트, 자유 답변, 메모, 이미지
7. 표
8. 행동 버튼
9. 미디어, 챌린지 크리에이터
10. 여러 구성요소에 공통 — `readOnly`, `warning`, `resetOnChange`, `hidden`, `correct`
11. 함수와 패턴 — 난수, 집계, `simpleFunction`, `parseEquation`, 빈 칸 판정, 컴포넌트 별칭

## 1. CL 기본

| 주제 | 규칙 |
|---|---|
| sink | CL이 계산한 값을 구성요소 속성에 넣는다(CL → 구성요소). 예: `content: "…"`, `hidden: true` |
| source | 학생 입력·구성요소 상태를 CL이 읽는다(구성요소 → CL). 예: `btn.pressCount`, `input.numericValue` |
| 사용자 변수 | `이름 = 식`으로 정한다. CL 안의 변수 이름은 마음대로 짓고 여러 글자여도 된다(`cal`, `answer`, `show`). 그래프 안 변수 이름 규칙은 다르다(`desmos-functions.md` 1절) |
| `this` | 자기 CL 안에서 자기 자신을 부른다. 화면 스크립트(화면 전체 CL)에서는 `this`가 작동하지 않는다 |
| 다른 구성요소 | `구성요소이름.source` 또는 `구성요소이름.script.변수`(그 구성요소 CL 안의 변수)로 읽는다 |
| 화면 스크립트 | 화면 전체에 적용되는 sink를 둔다: `title`, `subtitle`, `coverText`, `coverButtonLabel`, `disableCalculatorReason` 등 |
| 줄 순서 | CL은 값의 연결을 선언하는 언어라서 줄 순서가 결과를 바꾸지 않는다 |
| 문자열 보간 | `"…${변수}…"`로 값을 넣는다. 백틱으로 감싼 부분은 수식 모양으로 보인다 |
| 여러 줄 | 따옴표 안에서 실제로 줄을 바꾸거나 `\n`을 쓴다. 둘 다 화면에서 줄이 나뉜다 |
| `numericValue`·`latex` | `numericValue`는 계산한 숫자, `latex`는 입력한 식의 LaTeX 글. `latex`를 백틱으로 감싸 넣으면 수식으로, 그냥 넣으면 글로 보인다 |
| 비교·논리 연산자 | `=`, `<`, `>`, `<=`, `>=`, `and`(둘 다 참일 때 참), `or`, `not(…)`. 같지 않음 연산자는 없으므로 `not(a = b)`로 쓴다 |
| 사칙연산 | `+ - * /`를 CL 식에 직접 쓰지 않는다. 계산식을 큰따옴표 안 글자로 쓰고 `numericValue("…")`로 감싸며, 식에 들어가는 값은 `${…}`로 넣는다. 예: `cal = numericValue("${a.numericValue}+${b.numericValue}")` (`cl-pitfalls.md` 1절) |
| 소수 비교 | **계산해서 나온 값**끼리 비교할 때는 계산 오차 때문에 `=` 대신 범위로 비교한다: `this.numericValue > 9.99 and this.numericValue < 10.01`. 학생 입력을 정해진 수와 비교하는 `correct: this.numericValue = 0.05`(4절)는 `=`로 된다 |
| 시간 단위 | `timeSincePress()`, `timeSinceSubmit()`은 초 단위다 |
| 같은 이름 두 번 | 한 CL 안에서 같은 변수를 두 번 정의하면 「You can't define x in two places」 오류가 나고 그 구성요소 CL이 통째로 멈춘다 |
| 참·거짓 보간 | 참·거짓 값은 문자열 `${}`에 바로 넣으면 「Unexpected type in string: boolean」 오류가 난다. `${when 조건 "예" otherwise "아니오"}`처럼 글로 바꿔 넣는다 |
| 그래프 전용 함수 | `total`, `mod`, `median`, `quantile` 같은 Desmos 함수는 CL 식에서 바로 쓰면 「Unknown function」 오류가 난다. 그래프 식에서 계산하고 `graph.number("…")`로 읽는다. `highest`, `lowest`, `pipes`, `map`도 CL에 없다 |
| 주석 | `#`으로 시작하는 줄은 주석이라 실행되지 않고 편집기에서 흐린 글자로 보인다. 여러 줄을 막으려면 줄마다 앞에 `#`을 붙인다 |
| 오류 표시 | 없는 이름·오타·문법 오류는 그 줄 앞에 주황 세모 안 느낌표 아이콘이 뜨고, 마우스를 올리면 설명이 나온다. 교사 대시보드의 `warning` 표시(10절)와는 다른 것이다 |

## 2. 그래프

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `number("a")` | sink | CL 값을 그래프 안 변수 `a`에 넣는다. 예: `when input.submitted input.numericValue otherwise 10000`(제출했을 때만 학생 값을 쓴다). 그래프 쪽 이름은 `v_{al}`처럼 쓴다(`desmos-functions.md` 1절) |
| `numberList("L")` | sink | 리스트를 그래프 변수에 넣는다. 예: `table.columnNumericValues(1)`을 넣으면 표 입력이 바로 그래프에 반영된다. 기록한 값을 점으로 쌓을 때는 `numberList("X"): exp.history("x")`(4절) |
| `function("f")` | sink | `simpleFunction(…)`으로 만든 함수를 그래프 함수 `f`에 넣는다(11절) |
| `number("a")` | source | 그래프 안 변수 값을 다른 구성요소나 CL이 읽는다. 정답 판정 식을 그래프 안에서 계산하고 `correct: graph.number("C") = 1`로 읽을 수 있다 |
| `bounds` | sink | `makeBounds(xmin, xmax, ymin, ymax)`로 보기 범위를 정한다. 조건에 따라 바꿀 수 있다. 예: `bounds: when btn.timeSincePress() = 0 makeBounds(-4,4,-4,4) otherwise makeBounds(…)` — 버튼을 누르면 범위가 바뀌고, 버튼의 다시 하기를 누르면 처음 범위로 돌아온다. 너비가 0인 범위(`makeBounds(5,5,5,5)`처럼 최솟값과 최댓값이 같음)는 무시되고 원래 범위가 보인다. 여백을 자동으로 더해 주지 않으므로 여백은 직접 계산해 넣는다 |
| `bounds` | source | 다른 구성요소(그림판 등)가 이 그래프의 보기 범위를 그대로 받아 맞출 수 있다 |
| `background` | sink | 다른 그래프·그림판을 배경으로 깐다: `graphLayer(g.calculatorState)`, `sketchLayer(s.sketch)`, 여러 겹은 `layerStack(graphLayer(a.calculatorState), graphLayer(b.calculatorState))`처럼 쓰고 **뒤에 적은 층이 위에** 그려진다. 그림판의 획을 `transform`·`simpleFunction`으로 늘이거나 줄여서 깔 수도 있다. 그림판 획은 학생이 획을 마친 뒤 나타난다 |
| `calculatorState` | source | 그래프 내용(식·그림)을 담는다. `background`에는 그대로 넣지 못하고 `graphLayer(g.calculatorState)`로 감싸 넣는다(그대로 넣으면 「expects a layer」 오류). 배경으로 깔면 곡선은 보이지만 점과 레이블은 빠지고, 보기 범위는 받는 쪽 그래프의 범위를 쓴다 |
| `trace` | sink | 참이면 곡선을 누르거나 끌어 좌표를 볼 수 있다. `trace: false`로 끈다 |
| `animationDuration` | sink | 애니메이션 한 번의 재생 길이(초). 값을 주면 그래프 아래에 재생 단추와 진행 막대가 생기고, 학생이 눌러야 재생되며 끝에서 멈춘다(반복하지 않음). `0`이면 재생 단추와 막대가 사라진다 |
| `animationKeyboardStepValue` | sink | 애니메이션 슬라이더에서 화살표 키 한 번에 움직이는 시간 간격 |
| `animationTime` | source | 지금 재생 시각. `number("t_0"): g.animationTime`처럼 여러 구성요소에 함께 넣으면 같이 움직인다 |
| `isAnimating` | source | 재생 중이면 참, 재생 전·일시정지 중·끝난 뒤에는 거짓. 지금 재생 위치(초)는 `animationTime`으로 읽는다 |
| `resetAnimationOnChange` | sink | 넣은 문자열이 바뀔 때마다 애니메이션을 처음으로 되돌린다. 예: `"${btn.pressCount}"` |
| `saveOnChange` | sink | 넣은 문자열이 바뀔 때마다 그래프 상태를 저장한다. 다른 화면에 갔다 와도 애니메이션 진행이 이어진다. 없으면 돌아왔을 때 처음 상태다. 학생이 끈 점의 위치는 `saveOnChange`가 없어도 화면을 오가거나 학생 페이지를 새로고침해도 남는다 |
| `labelNumericValue("a_k")` | source | 점 라벨에 보이는 값을 숫자로 읽는다. 학생이 라벨을 맞췄는지 오차 범위로 판정할 때 쓴다. 라벨 `1/3`은 0.333…(소수 약 16자리), 숫자가 아닌 라벨은 정의되지 않음. 라벨 글 그대로는 `labelText("…")`로 읽는다. CL `pointLabel`로 바꾼 라벨은 이 두 source로 읽히지 않는다 |
| `currentX`, `currentY` | source | 그래프 위 마우스 포인터의 현재 좌표. 누르지 않고 움직이기만 해도 바뀐다. 포인터가 그래프 밖으로 나가면 정의되지 않음이 된다 |
| `warning` | sink | 교사에게만 보이는 주의 표시(10절) |

## 3. 그림판

그래프 구성요소를 넣고 종류를 그림판으로 바꾸면 배경 그래프 계산기가 그대로 남아, 식을 넣고 읽으면서 필기도 할 수 있다.

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `sketch` | source | 학생이 마친 획 전체. `sketch.strokeCount`(획 수), `sketch.totalStrokeLength`(획 길이 합), `sketch.yValuesAt(x)`·`xValuesAt(y)`(그 위치를 지나는 값 목록. 순서는 값의 크기가 아니라 획을 그린 순서)를 읽는다. 값이 없을 때는 `firstDefinedValue(…, 기본값)`으로 받는다 |
| `currentStroke` | source | 지금 긋고 있는 획. 마우스를 누른 채 긋는 동안에만 길이가 0보다 크고, 떼면 0이 된다 |
| `mergeSketches(this.sketch, this.currentStroke)` | 함수 | 마친 획과 긋고 있는 획을 합친다. 「한 획으로만 그리기」 판정에 쓴다 |
| `number("M")`, `numberList("X")` | source | 그림판 배경 그래프에서 계산한 값을 읽는다. 계산식은 배경 그래프의 식 목록에 있다 |
| `number`, `function` | sink | 배경 그래프 변수·함수에 값을 넣는다. 예: `function("f"): simpleFunction(input.latex, "x")`이면 학생이 쓴 식이 배경에 바로 그려진다 |
| `currentX`, `currentY` | source | 그림판 위 포인터의 현재 좌표. 움직이면 바로 바뀐다 |
| `bounds` | sink | `makeBounds(xmin, xmax, ymin, ymax)`. 그래프의 `x_m` 같은 변수로 만들면 그래프 창을 따라 움직인다 |
| `background` | sink | `graphLayer(g.calculatorState)`로 그래프를 그림판 뒤에 깐다(점·레이블은 빠지고 곡선만). 보기 범위는 배경 그래프가 아니라 그림판 자기 범위를 쓰므로 `bounds`로 맞춘다 |
| `initialTool`, `initialColor`, `availableColors` | sink | 처음 도구(예: `sketchTools.line`), 처음 색(예: `colors.black`), 쓸 수 있는 색 |
| `previewCurrentStroke` | sink | `false`이면 긋는 동안 선이 안 보이고 손을 떼면 나타난다 |
| `allowEraser` | sink | `false`이면 지우개 도구가 사라진다 |
| `smartStrokeJoining` | sink | 참이면 끝이 가까이 이어진 두 조각을 한 획으로 합친다(`strokeCount`가 1). 거짓이면 따로 센다 |
| `disableSketch` | sink | 참이면 그림판이 잠겨 더 그리거나 지울 수 없다. 그때까지 그린 획은 남는다. 예: `this.sketch.strokeCount >= 5`이면 다섯 번째 획을 마치는 순간 잠긴다 |
| `hideSketch` | sink | 참이면 학생이 그린 획을 숨긴다(그림판과 배경은 남음). 숨긴 동안에는 그려지지도 않는다. 거짓으로 돌아오면 다시 보인다. 예: `hideSketch: click.pressCount > 5`이면 버튼을 6번째 누르는 순간 획이 사라진다 |
| `resetOnChange` | sink | 다른 구성요소처럼 **넣은 문자열이 바뀔 때** 획을 지운다. 값이 그대로인 동안 새로 그린 획은 남는다. 예: 합친 획 수가 2 이상이면 `"1"`, 아니면 `"0"` → 두 번째 획을 긋기 시작하는 순간 값이 바뀌어 첫 획이 지워지고 새 획만 남는다 |
| `narration` | sink | 화면 읽기 프로그램이 읽는 설명. 눈에 보이는 변화는 없다 |
| `warning` | sink | 교사에게만 보이는 주의 표시(10절). 예: `warning: when this.sketch.strokeCount < 5 "선을 5개보다 적게 그음" otherwise ""` |

## 4. 수식 답변

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `numericValue`, `latex` | source | 계산값, 입력한 LaTeX |
| `submitted` | source | 제출하면 참. 제출 뒤 학생이 입력을 다시 고치기 시작하면 거짓으로 돌아간다. 「제출했을 때만 그래프에 반영」에 쓴다 |
| `submitCount` | source | 제출 횟수. 0부터 시작한다. 다시 하기를 눌러도 0으로 돌아가지 않고, 다시 제출한 것까지 모두 센다 |
| `timeSinceSubmit()` | source | 제출 뒤 지난 초. 제출 전은 0. `timeSinceSubmit(20)`처럼 상한을 줄 수 있다 |
| `capture("x")` | sink | 제출할 때마다 그 순간의 값을 기록한다. 예: `capture("x"): this.numericValue` |
| `history("x")`, `lastValue("x")` | source | 기록한 값 전체 목록, 마지막 값. 예: 그래프 CL `numberList("X"): exp.history("x")` → 그래프 식 `(X, 0)`이면 제출할 때마다 x축에 점이 쌓인다 |
| `explainContent` | source | 설명 칸에 쓴 글. 쓰는 대로 바로 읽힌다. 비었는지는 `isBlank(…)`로 본다 |
| `explainPrompt`, `initialText` | sink | 제출 뒤 열리는 설명 칸의 질문, 칸에 처음 들어 있는 글 |
| `initialLatex` | sink | 입력칸에 처음 들어 있는 식(예: `f(x)=`). 학생이 지워도 `simpleFunction`은 작동한다 |
| `placeholderLatex` | sink | 빈 칸에 흐린 회색으로 보이는 안내 식. 입력하면 사라진다 |
| `disableEvaluation` | sink | 참이면 입력칸 오른쪽의 계산 결과 표시를 끈다(답이 계산되어 보이는 것 방지) |
| `errorMessage` | sink | 조건이 맞지 않을 때 안내. 빈 글(`""`)이면 아무것도 보이지 않는다. 예: `isUndefined(this.numericValue)`. 숫자가 아닌 글자를 넣으면 제출 버튼이 비활성되고 누르면 이 문구가 보인다. `pi` 같은 상수는 숫자로 받는다 |
| `correct` | sink | 대시보드 채점(10절). `this.numericValue = 0.05`이면 `1/20`처럼 같은 값이 되는 식도 정답이다 |
| `hidden` | sink | 예: `this.timeSinceSubmit() > 0`이면 제출하는 순간 입력칸이 사라진다 |
| `resetOnChange` | sink | 넣은 문자열이 바뀌면 처음 상태로 돌아간다: 제출 상태·시간·입력이 모두 지워진다. 여러 값을 이어 붙이면 서로 다른 조합이 같은 글이 될 수 있으니 사이에 구분 글자를 넣는다 |
| `prompt` | — | 수식 답변에는 없다. 질문과 피드백은 앞에 둔 메모에 넣는다(6절) |

## 5. 객관식·체크박스

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `isSelected(n)` | source | n번 보기를 골랐는지. 자기 CL 안에서는 `this.isSelected(n)` |
| `correct` | sink | 보기 조합으로 정할 수 있다. 예: 「1번과 4번만」 또는 「2·3·5번만」 골랐을 때 참이 되도록 `isSelected`를 `and`·`or`·`not`으로 묶는다 |
| `choiceContent(n)` | sink | n번 보기 글을 CL로 정한다 |
| `maxSelectedChoices` | sink | 체크박스에서 고를 수 있는 개수 상한. 상한에 닿으면 나머지 보기가 바로 비활성된다 |
| `prompt` | sink | 체크박스 가운데 위에 흐린 회색 안내 문구를 보인다. 개수를 제한하지는 않는다 |
| `explainPrompt`, `initialText` | sink | 고른 보기에 따라 설명 칸의 질문·처음 글을 바꿀 수 있다 |
| 정답 표시 | — | 편집기에서 정답 보기를 표시해야 `matchesKey`·`correct`가 의미를 가진다(`cl-pitfalls.md` 1절) |

## 6. 정렬 리스트, 자유 답변, 메모, 이미지

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| 정렬 리스트 `order` | source | 숫자 리스트. **i번째 값은 교사가 i번째로 입력한 항목이 지금 몇 번째 자리에 있는지**다(1부터 센다). 예: 항목 「사과·배·포도」를 학생이 「배·포도·사과」로 놓으면 `[3, 1, 2]`. 순서를 바꿀 때마다 바로 바뀐다. 리스트라 문자열 `${}` 안에 넣으면 「Unexpected type in string: List<number>」 오류가 난다. 보이려면 그래프 CL `numberList("L"): 별칭.order`로 보내고 그래프에서 `L[1]`처럼 읽는다 (확인됨) |
| 정렬 리스트 `matchesKey` | source | 정답 순서와 같으면 참(`cl-pitfalls.md` 1절) |
| 자유 답변 `content` | source | 입력한 글. 제출 조건 없이 읽으면 타이핑하는 대로 바로 반영된다 |
| 메모 `content` | sink | 메모 글 전체를 CL로 만든다. 다른 구성요소 값을 `${…}`로 넣으면 바로 바뀐다 |
| 메모 본문의 변수 칩 | — | 메모 CL에서 변수만 정하고(예: `show = when cal = answer "참 잘했어요" otherwise "다시 계산해 보세요"`), 메모 본문에는 그 변수를 칩으로 꽂는다. 본문 글은 그대로 두고 그 자리에만 값이 바뀌어 보인다. 넣는 법은 `reference/editor-ops.md` 9절 |
| 이미지 `hidden` | sink | 예: `btn.timeSincePress() > 0`이면 버튼을 누를 때 숨고, 버튼의 다시 하기를 누르면 다시 보인다 |

## 7. 표

행 번호 1은 헤더 바로 아래 첫 줄이다.

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `cellContent(r,c)`, `cellNumericValue(r,c)` | source | 칸의 글, 계산값. 학생이 칸을 비워 두었는지는 `isBlank(this.cellContent(1,1))`로 본다(11절) |
| `columnNumericValues(c)` | source | 열 전체의 계산값 리스트. 그래프 `numberList`에 넣어 점으로 그린다. 빈 칸과 글자 칸도 리스트 자리를 차지하고 값은 정의되지 않음이 된다(4칸 중 2칸이 비면 `length`는 4) |
| `cellContent(r,c)` | sink | 칸 내용을 CL로 채운다 |
| `initialCellContent(r,c)` | sink | 칸에 처음 들어 있는 내용. 학생이 고칠 수 있다 |
| `cellEditable(r,c)` | sink | 학생이 그 칸을 고칠 수 있는지 정한다. 편집기 설정 「입력한 셀 잠금」보다 우선한다 |
| `cellDisableEvaluation(r,c)` | sink | 그 칸의 자동 계산을 끈다 |
| `cellSuffix`, `cellErrorMessage` | sink | 칸 뒤 표시(✅/❌, 단위), 칸 안내 |
| `resetOnChange` | sink | 예: `"${btn.pressCount}"`이면 버튼을 누를 때마다 표가 빈 칸으로 돌아간다. 버튼의 `capture`로 값을 먼저 기록해 두는 방식과 함께 쓴다 |
| 편집기 설정 | — | 표 `…` 메뉴 → 설정 「입력한 셀 잠금」(기본 켜짐): 끄면 교사가 입력해 둔 칸을 학생이 고칠 수 있다. 헤더 칸은 꺼도 고칠 수 없다. 「학생이 행을 추가하도록 허용」도 같은 메뉴에 있다 |

## 8. 행동 버튼

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| `pressCount` | source | 누른 횟수 |
| `timeSincePress()` | source | 누른 뒤 지난 초. 누르기 전은 0. `timeSincePress(10)`이면 10초까지만 늘어난다. **괄호를 꼭 쓴다**: `btn.timeSincePress`처럼 괄호 없이 쓰면 작동하지 않는다 |
| `capture("x")` | sink | 누르는 순간의 값을 기록한다. `history("x")`, `lastValue("x")`로 읽는다. 한 번도 누르지 않았으면 `lastValue("x")`는 정의되지 않은 값이라 글에 넣으면 `undefined`로 보인다. 누르기 전 상태는 `pressCount > 0` 조건으로 막는다 |
| `label`, `resetLabel` | sink | 버튼 글자, 누른 뒤 보이는 다시 하기 링크의 글자. 다시 하기를 누르면 `timeSincePress()`가 0으로 돌아간다 |
| `disabled` | sink | 누를 수 없게 한다. 예: 필요한 칸이 비어 있을 때(`isBlank`, 11절) |
| `style` | sink | `buttonStyles.default`, `buttonStyles.red`, `buttonStyles.link`(밑줄 글 링크 모양) |
| `resetOnChange` | sink | 넣은 문자열이 바뀌면 버튼이 처음 상태로 돌아간다(시간 0) |

## 9. 미디어, 챌린지 크리에이터

| 이름 | 종류 | 하는 일·쓰는 법 |
|---|---|---|
| 미디어 `time` | source | 영상의 지금 재생 위치(초). 재생하거나 탐색 막대를 움직이면 바로 바뀌고, 일시정지 중에는 그 위치에 멈춰 있다. 미디어 구성요소에는 영상 파일을 올린다(YouTube 주소는 받지 않는다) |
| 미디어 `time` | sink | 영상을 그 위치로 옮긴다. 예: 보기마다 다른 시각으로 이동 |
| 챌린지 `challengeText` | sink | 교실 갤러리에서 학생이 만든 챌린지 카드(썸네일)에 보이는 글. 예: 입력칸의 `latex`를 넣는다 |
| 챌린지 `preventChallengeCreationReason` | sink | 출제하는 학생이 만든 문제가 조건에 맞지 않으면 챌린지가 만들어지지 않게 막는다(글이 이유, 맞으면 빈 글). 예: 연립방정식의 해를 출제자가 입력해야 만들어지게 한다 |
| 챌린지 `preventSubmissionReason` | sink | 응답하는 학생이 정답이나 조건을 만족하지 못하면 제출을 막는다(글이 이유, 맞으면 빈 글) |
| 챌린지 썸네일 sink | sink | `challengeBackground`·`challengeBounds`(창작물 썸네일 배경과 범위), `responseText`·`responseBackground`·`responseBounds`(응답 썸네일 글·배경·범위) |

## 10. 여러 구성요소에 공통

| 이름 | 하는 일·쓰는 법 |
|---|---|
| `readOnly` | `true`여도 학생의 입력·선택·제출·조작을 막지 않는다. 대시보드 정오답 채점에서만 빠진다. 한 화면에 채점 대상이 여럿이면 표시할 하나만 남기고 나머지를 `readOnly: true`로 둔다 |
| `correct` | 대시보드 채점. 참이면 대시보드 요약 칸에 ✓, 거짓이면 ×가 뜬다(아래 요약 칸 표). 교사가 학생 한 명의 화면에 들어가 위쪽 「정답 여부 표시」를 켜면 구성요소 왼쪽에 정답은 파란 ✓, 오답은 주황 ✗가 뜨고 왼쪽 세로 막대도 같은 색이 된다 |
| `warning` | 교사에게만 보이는 주의 표시. 문구가 있으면(조건이 참이면) **대시보드 요약 칸에 ⚠가 뜨고, ✓·×보다 앞선다**(정답이어도 ⚠만 보인다). 마우스를 올리면 문구가 보인다. 교사가 학생 한 명의 화면에 들어가 「정답 여부 표시」를 켜면 구성요소 옆에도 ⚠가 뜬다. 문구가 빈 글(`""`)이 되면 ⚠가 사라지고 원래 표시(✓·×·●)로 돌아간다. 예: 그림판 `warning: when this.sketch.strokeCount < 2 "획이 부족합니다" otherwise ""`. 학생 화면에는 나오지 않는다 (확인됨) |

**대시보드 요약 칸 표시** (확인됨)

| 표시 | 뜻 |
|---|---|
| ✓ | `correct`가 참 |
| × | `correct`가 거짓 |
| ● | 응답했지만 판정이 없음(`correct`가 없는 답칸·그림판 등) |
| - | 판정할 것이 없음(`readOnly: true`인 구성요소만 있거나, 버튼·메모만 있는 화면) |
| ⚠ | `warning` 문구가 있음. ✓·×보다 앞선다 |

- 학생이 그 화면에 머무는 동안은 ●로 보이다가 다른 화면으로 넘어간 뒤 ✓·×·⚠로 바뀔 수 있다. 판정을 볼 때는 학생이 다음 화면으로 넘어간 뒤에 본다.
- 학생이 지금 있는 화면의 칸은 파란색, 나머지 칸은 짙은 회청색이다.
- 교사 학생 미리보기에서 넣은 값은 대시보드에 올라가지 않는다. 대시보드 시험은 수업을 열고 학생 링크로 들어가서 한다(`reference/editor-ops.md` 10절).
| `resetOnChange` | 구성요소를 처음 상태로 돌린다. 수식 답변·표·행동 버튼·그림판 모두 넣은 문자열이 **바뀔 때** 돌린다(위 표) |
| `hidden` | 조건에 따라 숨긴다. 단계를 하나씩 여는 데 쓴다 |

## 11. 함수와 패턴

| 이름 | 하는 일·쓰는 법 |
|---|---|
| `randomGenerator()` | `r = randomGenerator()`, `r.int(a, b)`로 정수 난수. 화면을 열 때마다 새 값이 나온다. 다른 구성요소는 `note1.script.B`처럼 읽어 정답 판정에 쓴다 |
| `aggregate(x)` | 반 학생들의 값을 리스트로 모은다. 예: `numberList("L"): aggregate(exp1.numericValue)`, `aggregate(btn.lastValue("a"))`. 그래프에는 `L=[]`을 미리 정의해 둔다(`desmos-cookbook.md` 1절, `reference/recipe-aggregate.md`) |
| `simpleFunction(latex, "x", "y")` | LaTeX를 함수로 만든다. 변수 이름을 안 주면 `x`. 학생이 `y=x^2`처럼 `y=`를 붙여 써도 함수로 받는다. `f(x)=x^2`처럼 `f(x)=`를 붙인 식도 받는다. 변수 이름이 x가 아니면(`2t+1`) 둘째 인자로 `"t"`를 줘야 한다(안 주면 정의되지 않음). `f.evaluateAt(a, b)`로 값을 계산한다. 예: 절댓값 차이 함수로 오차 판정 |
| `parseEquation(latex).differenceFunction("x","y")` | 등식을 좌변·우변으로 나눠 **좌변 − 우변** 함수를 만든다. 그래프에 넣어 학생 방정식을 그리거나 판정한다 |
| `parseOrderedPair(latex)` | 순서쌍 글을 읽는다. `p = parseOrderedPair(this.cellContent(1,3))`, `numericValue(p.x) = 0 and numericValue(p.y) = -3`. `( 2 , -3 )`처럼 공백·음수·소수가 있어도 읽는다. `p.x`·`p.y`는 LaTeX 글이라 비교할 때는 `numericValue()`로 감싸야 한다(감싸지 않으면 「Objects of different types are never equal」 오류) (확인됨) |
| `firstDefinedValue(a, b, …)` | 앞에서부터 처음으로 정의된 값을 쓴다. 인자는 셋 이상도 된다. 예: `firstDefinedValue(input.numericValue, 1)` |
| `parseInequality(latex).differenceFunction("x","y")` | 부등식을 **큰 쪽 − 작은 쪽** 함수로 만든다. `y>2x`면 (0,5)에서 5. CL의 파서 함수는 `parseEquation`, `parseOrderedPair`, `parseInequality` 셋이다 |
| `patterns` | 입력의 **모양**을 검사한다. `p = patterns.fraction(patterns.integer, patterns.integer)`이면 `p.matches(input.latex)`는 학생이 분수 꼴(`\frac{3}{4}`)로 썼을 때만 참이고 `0.75`는 거짓이다. `p.parse(input.latex).numerator.numericValue`, `.denominator.numericValue`로 분자·분모를 꺼낸다(분수 꼴이 아니면 정의되지 않음). 「분수로 쓰시오」처럼 값이 아니라 꼴을 판정할 때 쓴다(약분 여부는 따로 보지 않는다) |
| `xyLine(latex)` | 직선의 방정식 하나(예: 학생 입력 `input.latex`)를 읽어 직선을 만든다. `l = xyLine(input.latex)`이면 `l.slope`(기울기), `l.xIntercept`(x절편), `l.yIntercept`(y절편)를 숫자로, `l.isHorizontal`·`l.isVertical`(x축·y축에 평행한지)을 참·거짓으로 읽는다. 예: `number("m"): l.slope`로 그래프에 보내 `y=mx+y_1`을 그리고, 메모에 `when l.isVertical "y축에 평행합니다" otherwise ""`. 직선 객체 자체는 그래프 `function`·배경·글에 바로 넣지 못하고(오류), 꺼낸 값만 쓴다. `parseEquation`은 직선을 함수로 받지 않으므로 직선의 특징이 필요하면 이것을 쓴다 |
| `countNumberUsage(latex, n)` | 식에 숫자 `n`이 몇 번 쓰였는지 센다. `countNumberUsage("2+2+3", 2)`는 2. 「주어진 수를 한 번씩만 쓰기」 같은 판정에 쓴다 |
| `isBlank(s)` | 학생이 칸을 비워 두었는지(입력하지 않았는지) 본다. 예: `empty = isBlank(this.cellContent(1,1)) or isBlank(this.cellContent(1,2))` |
| `isUndefined(x)`, `isDefined(x)` | 계산값·함수가 정의되지 않았는지, 되었는지 본다. 「학생이 아직 입력하지 않았다」를 판정할 때는 `isBlank`를 쓴다 |
| 컴포넌트 별칭 `i = input1` | 사용자 변수에 구성요소를 넣어 그 이름으로 source를 부른다. 이름은 마음대로 짓는다. 예: `i.numericValue`, `i.latex`, `i.timeSinceSubmit(20)`, `i.lastValue("end")`, 그래프에서 `c = choice` → `c.isSelected(n)`. 그래프·그림판도 별칭에 넣을 수 있다(`g = graph1` → `g.number("a")`, `s = sketch1` → `s.sketch.strokeCount`) |
