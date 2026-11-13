# CL 문법 판정

> 구성요소의 sink·source가 실제로 어떻게 동작하는지 판정한 문장이다. 「코드 요지」는 예제 코드를 우리 말로 요약한 것이고, 예제 코드 원문은 싣지 않는다.
> 「확정 문장」은 사실로 써도 된다. 「관찰예측」은 화면에서 보일 모습의 예상이다. 「확인되지 않은 부분」은 단정하지 않는다.

항목 89건. 제목은 `구성요소.이름 [sink|source]`.

### Graph.calculatorState [source] <!-- A-graph-02 -->
- 코드 요지: 이 그래프의 background에 `tangentGraph1.calculatorState`를 `graphLayer`로 감싸 지정한다.
- 확정 문장:
  - `background` sink에 `tangentGraph1.calculatorState`(source)로 만든 `graphLayer`가 설정된다.
  - `tangentGraph1`에 그려진 식·그래프 등의 시각 요소가 레이블 등 일부 정보를 빼고 이 그래프의 background에 복사되어 보인다.
- 관찰예측: `tangentGraph1`의 시각 요소가 레이블 등 일부를 뺀 채 이 그래프의 배경에 보인다.
- 확인되지 않은 부분: `calculatorState`에서 레이블 외에 빠지는 정보가 무엇인지.

### Graph.animationTime [source] <!-- A-graph-04 -->
- 코드 요지: `animationGraph`의 `animationTime`을 두 컴포넌트의 number `t_0`로 제공하고, 같은 시각에서 `animationSketch.sketch`의 y값 목록을 numberList `y_1`로 제공한다.
- 확정 문장:
  - `(master):1`은 빨간 원의 경로를 sketch tool로 따라 그리라는 `subtitle`을 설정한다.
  - `animationGraph:1`은 `animationDuration`을 6.28초로 설정한다.
  - `animationGraph:3`은 `this.animationTime`을 number `t_0`로 제공한다.
  - `animationGraph:5`는 현재 `animationTime`에서 `animationSketch.sketch`의 `yValuesAt` 결과를 numberList `y_1`로 제공한다. 즉 x=`t_0`일 때의 y값을 연속적으로 모아서 numberList로 제공한다.
  - `animationSketch:1`은 `animationGraph.animationTime`을 number `t_0`로 제공한다.
- 관찰예측: 학생이 `animationSketch`에 선을 그린 뒤 재생 버튼을 누르면 6.28초 동안 애니메이션이 진행된다. 재생되는 동안 두 컴포넌트의 `t_0`가 함께 증가하고, `t_0`를 x좌표로 삼은 스케치의 y값(`y_1`)에 맞춰 그래프의 점이나 도형이 움직인다.
- 확인되지 않은 부분: `yValuesAt`이 한 시각에 여러 값을 낼 때의 정렬 순서.

### Graph.bounds [source] <!-- A-graph-05 -->
- 코드 요지: `graph1`의 bounds를 `button1.timeSincePress()` 값에 따라 고정값 또는 `graph1`의 number 네 개로 정하고, `sketch1`이 이를 그대로 받는다.
- 확정 문장:
  - `button1.timeSincePress()`가 0일 때 bounds는 `makeBounds(-4,4,-4,4)`를 사용하고, 그 외에는 `graph1`의 `x_m`, `x_M`, `y_m`, `y_M` 값을 사용한다.
  - Reset 버튼을 누르면 다시 기본 bounds로 돌아간다.

### Graph.labelNumericValue [source] <!-- A-graph-08 -->
- 코드 요지: `simpleFunction`으로 만든 절댓값 차이 함수 `difference`에 `x_k`와 label `a_k`의 `labelNumericValue`를 넣어 0.2 미만인지 네 쌍 모두 검사해 `correct`를 정한다.
- 확정 문장:
  - `레이블 없는 그래프:1`은 `simpleFunction("\left|x-y\right|","x","y")`로 x와 y의 절댓값 차이를 계산하는 함수 `difference`를 정의한다.
  - `레이블 없는 그래프:3-6`은 `c1`~`c4`를 정의한다. 각각 `difference.evaluateAt(this.number("x_k"), this.labelNumericValue("a_k")) < 0.2`이다.
  - `레이블 없는 그래프:8`은 `c1`~`c4`가 모두 참일 때 `correct`를 참으로 설정한다. 즉, 네 쌍 모두의 차이가 0.2보다 작아야 `correct`가 참이고, 한 쌍이라도 기준을 충족하지 않으면 거짓이다.
- 관찰예측: 네 쌍 모두의 차이가 0.2보다 작아야 `correct`가 참이고, 한 쌍이라도 기준을 충족하지 않으면 거짓이다.
- 확인되지 않은 부분: `labelNumericValue`가 라벨 텍스트를 어떻게 숫자로 해석하는지. label이 숫자가 아니거나 정의되지 않았을 때의 비교 결과.

### Graph.isAnimating [source] <!-- A-graph-09 -->
- 코드 요지: 그래프의 `animationDuration`을 5로 설정하고, `this.isAnimating`이 참이면 number `i_{sAnim}`을 1, 아니면 0으로 제공한다.
- 확정 문장:
  - `레이블 없는 그래프:1`은 `animationDuration`을 5초로 설정한다.
  - `isAnimating`은 애니메이션이 재생 중인지를 뜻한다. `레이블 없는 그래프:3`은 재생 중이면 number `i_{sAnim}`을 1, 재생 전이나 재생이 끝나면 0으로 설정한다.
- 관찰예측: 애니메이션이 재생 중이면 `i_{sAnim}`은 1이고, 재생 전이나 재생이 끝나면 0이다.
- 확인되지 않은 부분: 일시정지 중의 `isAnimating` 값.

### Graph.currentX/Y [source] <!-- A-graph-10 -->
- 코드 요지: 그래프의 `this.currentX`, `this.currentY`를 number `x_1`, `y_1`로 제공한다.
- 확정 문장:
  - `this.currentX`, `this.currentY`는 그래프 위에서 현재 마우스 커서가 위치한 x좌표값과 y좌표값이다.
  - `레이블 없는 그래프:1`은 `this.currentX`(source)를 number `x_1`로, `레이블 없는 그래프:3`은 `this.currentY`(source)를 number `y_1`로 설정한다.
- 관찰예측: 학생이 그래프 위에서 마우스 커서를 움직이면 `x_1`, `y_1`이 커서 위치의 좌표를 반영한다.
- 확인되지 않은 부분: 클릭이나 드래그 없이 커서를 움직이기만 해도 갱신되는지.

### Graph.animationDuration [sink] <!-- A-graph-12 -->
- 코드 요지: 입력창 `animationInput`이 제출되면 그 numericValue를 `animationGraph`의 `animationDuration`으로 쓰고, 입력값이 1 또는 -1이면 입력창의 suffix를 단수로 바꾼다.
- 확정 문장:
  - `(master):1`은 빨간 마차(red carriage)의 경로를 sketch tool로 따라 그리라는 `subtitle`을 설정한다.
  - `animationGraph:1`은 `animationInput.submitted`가 참이면 `animationInput.numericValue`(source)를 `animationDuration`으로, 아니면 0으로 설정한다.
  - `animationGraph:3`은 `this.animationTime`을 number `t_0`로 제공한다.
  - `animationInput:1`은 `this.numericValue`가 1 또는 -1이면 suffix(접미사)를 `"second"`, 그 외에는 `"seconds"`로 설정한다.
- 관찰예측: 입력을 제출하기 전 `animationDuration`은 0이다. 1 또는 -1을 입력하면 입력창 suffix(접미사)가 `second`이고, 다른 값이면 `seconds`이다.
- 확인되지 않은 부분: `animationDuration`이 0일 때 재생 UI가 어떻게 보이는지.

### Graph.animationKeyboardStepValue [sink] <!-- A-graph-13 -->
- 코드 요지: `animationDuration`을 `numericValue("2*\pi")`로 두고, `animationKeyboardStepValue`를 입력창 제출값 또는 `numericValue("\pi/8")`로 정한다.
- 확정 문장:
  - `(master):1`은 빨간 마차(red carriage)의 경로를 sketch tool로 따라 그리라는 `subtitle`을 설정한다.
  - `animationGraph:1`은 `numericValue("2*\pi")`(약 6.28초)를 `animationDuration`으로 설정한다.
  - `animationKeyboardStepValue`는 애니메이션 슬라이더에서 키보드 화살표를 누를 때 시간이 이동하는 간격이다. `animationGraph:3-5`는 `animationInput.submitted`가 참이면 `animationInput.numericValue`를, 아니면 `numericValue("\pi/8")`를 이 간격으로 설정한다. 즉 화살표 한 번에 움직이는 시간 간격을 학생이 정하게 한다.
  - `animationGraph:7`은 `this.animationTime`을 number `t_0`로 제공한다.
  - `animationInput:1`은 `numericValue`가 1 또는 -1이면 suffix(접미사)를 `second`, 그 외에는 `seconds`로 설정한다.
- 관찰예측: 애니메이션 슬라이더에서 키보드 화살표를 누르면 제출 전에는 π/8(약 0.39)씩, 학생이 `animationInput`에 값을 제출한 뒤에는 그 값씩 시간이 이동한다.

### Graph.saveOnChange [sink] <!-- A-graph-14 -->
- 코드 요지: `graphLeft`의 `saveOnChange`에 number `a`를 문자열로 보간한 값을 설정하고, `graphRight`의 number `p_{ress}`가 `graphLeft`의 같은 number를 읽는다.
- 확정 문장:
  - `(master):1`은 "Start Timers"를 누른 뒤 다른 화면에 갔다 돌아왔을 때 한쪽 타이머는 이어지고 다른 쪽은 초기화되는지 보라는 `subtitle`을 설정한다.
  - `graphLeft:1`은 `this.number(\`a\`)`를 문자열로 보간한 값을 `saveOnChange` sink에 설정한다. 그래프 안의 `a` 값이 바뀔 때마다 그래프 상태가 저장된다.
  - `graphRight:1`은 `graphLeft`의 number `p_{ress}`(source)를 `graphRight`의 number `p_{ress}`로 제공한다.
  - 두 타이머를 돌린 뒤 다른 화면에 갔다 돌아오면 `saveOnChange`가 설정된 `graphLeft`의 타이머는 멈췄던 지점부터 이어지고, `graphRight`의 타이머는 초기화된다.
- 관찰예측: `graphLeft`의 `a` 값이 바뀌면 `saveOnChange`에 들어가는 값도 바뀐다. `graphRight`의 `p_{ress}`는 `graphLeft`의 같은 number를 따른다.
- 확인되지 않은 부분: `saveOnChange`가 저장하는 상태의 정확한 범위.

### Graph.resetAnimationOnChange [sink] <!-- A-graph-15 -->
- 코드 요지: `graphLeft`의 `resetAnimationOnChange`에 `btn.pressCount`를 문자열로 설정하고, `GraphRight`가 `graphLeft`의 시간과 재생 상태를 읽으며, `btn`은 `graphLeft.animationTime`이 0이면 숨긴다.
- 확정 문장:
  - `graphLeft:1`은 `animationDuration`을 60으로 설정한다.
  - `graphLeft:2`는 `this.animationTime`을 number `t_0`로 제공한다.
  - `graphLeft:4`는 `btn.pressCount`를 문자열로 만들어 `resetAnimationOnChange` sink에 설정한다. 이 값의 변화, 즉 `btn`을 누른 횟수가 리셋의 트리거이므로 `btn`을 누를 때마다 `graphLeft`의 애니메이션이 리셋된다.
  - `GraphRight:1`은 `graphLeft.animationTime`을 number `T`로 제공한다.
  - `GraphRight:3`은 `graphLeft.isAnimating`이 참이면 number `p_{lay}`를 1, 아니면 0으로 설정한다.
  - `btn:1`은 `graphLeft.animationTime`이 0이면 `btn`을 `hidden`으로 설정한다.
- 관찰예측: `GraphRight`의 `T`와 `p_{lay}`는 `graphLeft`의 시간과 재생 상태를 반영한다. `graphLeft.animationTime`이 0인 동안 `btn`은 숨겨진다.
- 확인되지 않은 부분: 리셋 뒤의 정확한 상태(0초로 돌아가는지). `animationDuration`의 단위.

### Graph.bounds [sink] <!-- A-graph-16 -->
- 코드 요지: `zoomButton.timeSincePress`가 0보다 크면 `zoomGraph`의 number 네 개로 만든 bounds를, 아니면 `makeBounds(-10,10,-10,10)`을 `bounds`로 설정한다.
- 확정 문장:
  - `zoomGraph:1-5`는 `xSmall`, `xBig`, `ySmall`, `yBig`를 각각 `zoomGraph`의 number `x_{small}`, `x_{big}`, `y_{small}`, `y_{big}`로 정의한다.
  - `zoomGraph:7-9`의 `bounds`는 `zoomButton.timeSincePress > 0`이면 `makeBounds(xSmall, xBig, ySmall, yBig)`이고, 그렇지 않으면 `makeBounds(-10,10,-10,10)`이다.
  - `zoomButton:1`은 `resetLabel`을 `"Reset"`으로 설정한다. 이것은 리셋 링크에 보일 글자만 정한다. Reset을 눌렀을 때 무엇이 어떻게 되돌아가는지는 이 코드만으로는 알 수 없다.
- 관찰예측: `zoomButton`을 누르기 전에는 x, y 모두 -10부터 10까지의 범위가 보이고, 누른 뒤에는 `x_{small}`, `x_{big}`, `y_{small}`, `y_{big}` 값이 bounds를 정한다.
- 확인되지 않은 부분: `timeSincePress`를 괄호 없이 쓴 것이 `timeSincePress()`와 같은지. `timeSincePress`가 유지되는 시간 범위와 버튼의 초기 상태. `x_{small}` 등이 그래프 안에서 어떻게 정의되는지.

### Graph.background [sink] <!-- A-graph-17 -->
- 코드 요지: `sketchA.sketch`를 `transform`과 `simpleFunction`으로 서로 다른 배율로 변환한 다섯 `sketchLayer`를 `layerStack`으로 겹쳐 `backgroundGraph`의 `background`로 설정한다.
- 확정 문장:
  - `backgroundGraph:1-10`은 `sketch1`~`sketch5`를 정의한다. 각각 `sketchA.sketch`에 `transform`을 적용하며 `simpleFunction`으로 만든 x 함수와 y 함수를 넣어 `sketchLayer`로 만든다.
  - 배율은 `sketch1`이 2x, 2y, `sketch2`가 4x, 4y, `sketch3`이 6x, 6y, `sketch4`가 7x, 8y, `sketch5`가 10x, 10y이며, 원점을 기준으로 확대된다.
  - `backgroundGraph:12`는 다섯 layer를 `layerStack`으로 겹쳐 `background`로 설정한다.
  - `(master):1`은 sketch tool로 도형을 그리라는 `subtitle`을 설정한다.
- 관찰예측: 학생이 `sketchA`에 선이나 도형을 그리고 획을 마치면(마우스를 떼면), `backgroundGraph`의 배경에 그 도형이 원점을 기준으로 2배, 4배, 6배, (가로 7·세로 8)배, 10배로 커진 다섯 복사본으로 한꺼번에 나타난다.
- 확인되지 않은 부분: `layerStack`의 겹침 순서. `sketchA`는 화면에 놓인 컴포넌트 목록에 없다.

### Graph.number [sink] <!-- A-graph-18 -->
- 코드 요지: `xValue`의 제출값을 `tangentGraph`의 number `a`로 보내고, `tangentGraph`의 `c_{orrect}`가 1인지로 메모의 `feedback`과 `xValue`의 `correct`를 정하며, 숫자가 정의되지 않으면 `xValue`에 `warning`을 설정한다.
- 확정 문장:
  - `tangentGraph:1-3`은 `xValue.submitted`가 참이면 `xValue.numericValue`를, 아니면 10000을 number `a`로 설정한다.
  - `레이블 없는 메모:1`은 `tangentGraph.number("c_{orrect}") = 1`을 변수 `correct`로 정의한다.
  - `레이블 없는 메모:3-6`의 `feedback`은 `xValue.submitted and correct`이면 정답 문구, `xValue.submitted and not(correct)`이면 오답 문구, 그 외에는 빈 문자열이다.
  - `레이블 없는 메모:8`의 `content`는 `"Enter the \`x\`-value of a point where the derivative is positive."` 뒤에 `${feedback}`을 이어 붙인 것이다.
  - `xValue:1`은 `tangentGraph.number("c_{orrect}") = 1`을 `correct` sink로 설정한다.
  - `xValue:3-5`의 `warning`은 `not(isDefined(xValue.numericValue))`이면 `"Student didn't enter a number."`, 아니면 빈 문자열이다. 이 `warning`은 교사의 대시보드 화면에만 나타난다.
- 관찰예측: 제출 전에는 `content`에 안내문만 보인다. 수를 제출하면 `tangentGraph`의 `a`가 그 수가 되고 `c_{orrect}`에 따라 정답 또는 오답 `feedback`이 안내문 뒤에 붙는다. 숫자가 정의되지 않은 상태이면 교사 대시보드에 `warning` 문구가 나타난다.
- 확인되지 않은 부분: `c_{orrect}`를 계산하는 그래프 내부 표현.

### Graph.numberList [sink] <!-- A-graph-19 -->
- 코드 요지: `guessTable`의 1번 열 numericValues를 `guessGraph`의 numberList `G_{uessX}`로 제공한다.
- 확정 문장:
  - `guessGraph:1`은 `guessTable.columnNumericValues(1)`(source)을 numberList `G_{uessX}`로 설정한다.
  - 학생이 `guessTable`의 첫 번째 열에 숫자를 입력할 때마다, 그 숫자들을 x좌표 등으로 쓰는 점이나 도형이 `guessGraph` 위에 실시간으로 나타난다.
- 관찰예측: `guessTable` 첫 열의 숫자 값 목록이 바뀌면 `guessGraph`의 `G_{uessX}`도 바뀐다.
- 확인되지 않은 부분: 표에서 비숫자 칸과 빈 칸이 `columnNumericValues`에서 어떻게 처리되는지.

### Graph.trace [sink] <!-- A-graph-24 -->
- 코드 요지: 그래프의 `trace` sink를 `traceChoice.isSelected(1)`로 설정한다.
- 확정 문장:
  - `trace` sink는 `traceChoice.isSelected(1)`(source)로 설정된다. 첫 번째 선택지가 선택되면 `trace`는 참이 된다.
  - `trace`가 켜지면 그래프의 곡선을 클릭·드래그해 점의 좌표를 확인할 수 있고, 선택을 해제하거나 다른 보기를 고르면 곡선을 클릭해도 좌표가 표시되지 않는다.
- 관찰예측: `traceChoice`의 첫 번째 선택지를 고르면 그래프의 `trace`가 참이 된다.

### Graph.warning [sink] <!-- A-graph-26 -->
- 코드 요지: 그래프의 number `b`가 0이면 `warning`을 경고 문자열로, 아니면 빈 문자열로 설정한다.
- 확정 문장:
  - `레이블 없는 그래프:1-3`의 `warning` sink는 `this.number("b") = 0`이면 `"Student has set the circumference to zero."`, 그 외에는 빈 문자열이다.
  - `b`가 0이 되어도 학생 화면에는 변화가 없고, 교사 대시보드의 해당 학생 칸에 주황색 경고 아이콘이 뜨며 마우스를 올리면 경고 문구가 보인다.
- 관찰예측: `b`가 0이면 `Student has set the circumference to zero.`라는 warning 문구가 설정된다.

### Sketch.number [source] <!-- A-sketch-01 -->
- 코드 요지: `sketch1`이 정수 위치 −9~9에서의 스케치 좌표 최댓값을 `number("Y_{…}")`·`number("X_{…}")`로 내놓고, (master)의 `subtitle`이 선 길이와 `number("M")`·`number("v_{ertical}")`에 따라 문구를 바꾼다.
- 확정 문장:
  - `sketch1:1`의 `initialTool`은 `sketchTools.line`이다.
  - `sketch1:5-23`은 x = −9~9 각 정수에서 `this.sketch.yValuesAt(x)`의 `max`를 `number("Y_{…}")`로 내놓고, 값이 없으면 `firstDefinedValue`가 −15를 쓴다.
  - `sketch1:26-44`는 y = −9~9 각 정수에서 `this.sketch.xValuesAt(y)`의 `max`를 `number("X_{…}")`로 내놓고, 값이 없으면 −15를 쓴다.
  - `sketch1:3`의 `resetOnChange`는 `this.sketch`와 `this.currentStroke`를 합친 `strokeCount`가 1보다 크면 `"1"`, 아니면 `"0"`이다. 값이 `"1"`로 바뀌는 순간 기존 그림을 지우고 새 획만 남긴다.
  - (master)의 `subtitle`은 `totalStrokeLength`가 1.5보다 크고 `v_{ertical}`이 1이면 `"Your line is vertical."`, 1.5보다 크면 `"Your line has a slope of …"`(`M` 값 포함), 0보다 크면 `"Sketch a longer line."`, 그 밖에는 `"Sketch a line."`을 보인다.
  - `number("M")`과 `number("v_{ertical}")`은 `sketch1`의 배경 그래핑 계산기에 입력된 함수에서 계산되는 값이다. 그 함수는 이 코드에 보이지 않으므로, 계산식은 배경 그래프의 식 목록을 봐야 알 수 있다.
- 관찰예측: 직선 도구가 처음부터 선택되어 있다. 선을 긋지 않으면 `"Sketch a line."`, 길이 1.5 이하의 짧은 선이면 `"Sketch a longer line."`, 그보다 길면 기울기 문구가 나타난다. 두 번째 획을 긋기 시작하면 기존 선이 지워지고 새 획만 남는다.
- 확인되지 않은 부분: `M`과 `v_{ertical}`의 계산식(배경 그래프 식 목록이 필요하다).

### Sketch.numberList [source] <!-- A-sketch-02 -->
- 코드 요지: (master)의 `subtitle`이 `sketch1.numberList("X")`의 길이로 "선이 지나는 gridline 수"를 보이는 화면이며, `sketch1` 코드에는 `numberList("X")` 정의가 없다.
- 확정 문장:
  - `sketch1.sketch.totalStrokeLength`가 0보다 크면 `subtitle`은 `length(sketch1.numberList("X"))`를 넣어 `"Your line passes through N gridlines."`를 보이고, 아니면 `"Sketch a line."`을 보인다.
  - `sketch1:1`의 `initialTool`은 `sketchTools.line`, `sketch1:3`의 `resetOnChange`는 합친 `strokeCount`가 1보다 크면 `"1"`이 되어 이전 획을 지운다.
  - `sketch1:5-23`은 x = −9~9 각 정수에서 `yValuesAt`의 `max`(없으면 −15)를 `number("Y_{…}")`로 내놓는다.
  - `numberList("X")`는 `sketch1` 코드에 정의가 없지만 `sketch1`에서 불러온 source다. `sketch1`의 배경 그래프가 유효한 교점만 모은 리스트로 읽히며, 그 길이가 선이 지나는 격자선 수다. 정확한 값은 `sketch1`의 배경 그래핑 계산기 식 목록을 봐야 알 수 있다.
- 관찰예측: 선을 긋기 전에는 `"Sketch a line."`이 보이고, 선을 그으면 `numberList("X")`의 길이가 gridline 수 자리에 들어간 문구가 보인다.
- 확인되지 않은 부분: `numberList("X")`를 채우는 배경 그래프의 식.

### Sketch.currrentStroke [source] <!-- A-sketch-08 -->
- 코드 요지: 메모의 `content`가 `sampleSketch.currentStroke.totalStrokeLength`가 0인지에 따라 달라진다. 제목의 철자는 `Sketch.currrentStroke`로 되어 있다.
- 확정 문장:
  - `currentStroke`의 `totalStrokeLength`가 0이면 `"Sketch something."`, 그 밖에는 `"sketching..."`을 `content` sink에 낸다.
  - 완료된 `sketch`가 아니라 현재 긋고 있는 획을 읽는다. 마우스를 누른 채 선을 긋는 동안에만 `"sketching..."`이 보이고, 마우스 버튼을 떼면 즉시 `"Sketch something."`으로 돌아간다.
- 관찰예측: 평소에는 `"Sketch something."`이고, 획을 긋는 동안 `"sketching..."`이 보인다.

### Sketch.currentX [source] <!-- A-sketch-09 -->
- 코드 요지: (master)의 `subtitle`에 `sampleSketch.currentX`를 넣는다.
- 확정 문장:
  - `sampleSketch.currentX`는 그림판 위 마우스 커서의 현재 x좌표다. 이 값을 문자열 보간으로 `subtitle` sink에 넣는다.
  - 백틱 안은 수식으로 표시된다.
- 관찰예측: 학생이 `sampleSketch` 위에서 마우스 커서를 좌우로 움직이면 부제목의 `Current x:` 뒤 숫자가 커서 위치의 x좌표로 실시간으로 바뀐다.

### Sketch.currentY [source] <!-- A-sketch-10 -->
- 코드 요지: (master)의 `subtitle`에 `sampleSketch.currentY`를 넣는다.
- 확정 문장:
  - `sampleSketch.currentY`는 그림판 위 마우스 커서의 현재 y좌표다. 이 값을 문자열 보간으로 `subtitle` sink에 넣는다.
  - 백틱 안은 수식으로 표시된다.
- 관찰예측: 학생이 `sampleSketch` 위에서 마우스 커서를 위아래로 움직이면 부제목의 `Current y:` 뒤 숫자가 커서 위치의 y좌표로 실시간으로 바뀐다.

### Sketch.smartStrokeJoining [sink] <!-- A-sketch-11 -->
- 코드 요지: 그림판의 `smartStrokeJoining`을 `mc1`의 1번 선택 여부로 정한다.
- 확정 문장:
  - `mc1`의 1번 선택지가 선택되면 `smartStrokeJoining`을 `true`로 설정한다.

### Sketch.narration [sink] <!-- A-sketch-12 -->
- 코드 요지: 그림판의 첫 번째 `narration`에 획 수를 넣은 문자열을 지정한다.
- 확정 문장:
  - `narration(1)` sink는 `this.sketch.strokeCount`를 넣어 `"N strokes"` 형태의 문자열이 된다.
  - 단수 처리가 없으므로 획이 1개일 때도 `"1 strokes"`이다.
  - `narration`은 스크린 리더(화면 낭독기)가 읽는 그림판 설명이다. 일반 화면에는 변화가 없고, 획을 그을 때마다 스크린 리더가 읽는 문구가 `"0 strokes"`, `"1 strokes"`처럼 바뀐다.
- 관찰예측: 화면에는 눈에 보이는 변화가 없고, 스크린 리더에서 `"0 strokes"`, `"1 strokes"`처럼 읽힌다.

### Sketch.bounds [sink] <!-- A-sketch-13 -->
- 코드 요지: 그림판의 `bounds`를 고정 좌표 범위로 둔다.
- 확정 문장:
  - `bounds` sink는 `makeBounds(-5,15,-15,5)`이다. 인자 순서는 x 최솟값, x 최댓값, y 최솟값, y 최댓값이므로 x는 −5~15, y는 −15~5 범위이다.
- 관찰예측: 그림판의 좌표 영역이 기본 범위 대신 x −5~15, y −15~5로 맞춰져 보인다.

### Sketch.previewCurrentStroke [sink] <!-- A-sketch-14 -->
- 코드 요지: 그림판의 `previewCurrentStroke`를 `false`로 둔다.
- 확정 문장:
  - `previewCurrentStroke: false`는 현재 그리고 있는 획의 미리보기를 끄는 설정이다.
  - 그리는 동안에는 선이 보이지 않고, 마우스를 놓아 획을 완성하면 선이 나타난다.
- 관찰예측: 마우스를 누르고 드래그하는 동안에는 선이 보이지 않다가, 버튼을 떼어 획을 마치는 순간 완성된 선이 나타난다.

### Sketch.allowEraser [sink] <!-- A-sketch-15 -->
- 코드 요지: 그림판의 `allowEraser`를 `false`로 둔다.
- 확정 문장:
  - `allowEraser: false`는 그림판 도구 모음에서 지우개 도구를 사용할 수 없도록 숨기는 설정이다.

### Sketch.background [sink] <!-- A-sketch-16 -->
- 코드 요지: 그림판의 `background`를 다른 컴포넌트 `graph`의 계산기 상태로 만든 레이어로 둔다.
- 확정 문장:
  - `background` sink는 `graph.calculatorState` source를 `graphLayer`로 감싼 값이다.
  - 따라서 `graph`의 내용이 그림판 뒤에 배경으로 깔린다. 다만 레이블을 포함해 일부 정보는 나타나지 않는다.
- 관찰예측: 그림판 뒤에 `graph`의 그래프 내용이 배경으로 보이고(레이블 등 일부 제외), 그 위에 그림을 그린다.
- 확인되지 않은 부분: 배경이 `graph`의 창 범위까지 따라가는지. 레이블 외에 빠지는 정보.

### Sketch.disableSketch [sink] <!-- A-sketch-17 -->
- 코드 요지: 그림판의 `disableSketch`를 획 수가 5 이상인지로 정한다.
- 확정 문장:
  - `disableSketch` sink는 `this.sketch.strokeCount >= 5`이므로, 완성된 획이 5개 이상이면 그림판이 잠긴다.
  - 잠기면 더 그리거나 지우는 등 아무것도 할 수 없다. 다섯 번째 획을 완성해 마우스를 떼는 순간 잠긴다.
- 관찰예측: 네 번째 획까지는 정상적으로 그려지고, 다섯 번째 획을 마치면 그리기 도구가 잠겨 추가 그리기나 지우기를 할 수 없다.
- 확인되지 않은 부분: 잠긴 뒤 이미 그린 획이 화면에 남는지.

### Sketch.hideSketch [sink] <!-- A-sketch-18 -->
- 코드 요지: 그림판의 `hideSketch`를 `sketchChoice`의 2번 선택 여부로 정한다.
- 확정 문장:
  - `hideSketch` sink는 `sketchChoice.isSelected(2)` source이므로, 2번 보기가 선택되면 그림판에 그려진 내용이 숨겨진다.
  - 숨겨지는 것은 학생이 그린 선(획)뿐이고, 그림판 컴포넌트 자체와 배경은 그대로 남는다. 다른 보기를 고르면 그렸던 선이 다시 나타난다.
- 관찰예측: 2번을 선택하면 그린 내용이 보이지 않고, 다른 보기를 선택하면 다시 보인다.
- 확인되지 않은 부분: 숨겨진 상태에서 그리기가 가능한지.

### Sketch.number [sink] <!-- A-sketch-22 -->
- 코드 요지: `sketch1`이 `graph1`의 변수 `a`와 창 범위를 받아 쓰고, `graph1`은 `sketch1`의 획을 배경 레이어로 쌓는다.
- 확정 문장:
  - `sketch1`의 `number("a")` sink는 `graph1.number("a")` source를 읽는다.
  - `sketch1`의 `bounds` sink는 `graph1`의 `x_m`, `x_M`, `y_m`, `y_M` 네 `number`로 만든 `makeBounds`이다.
  - `graph1`의 `background` sink는 `sketch1.sketch`와 `sketch1.currentStroke`를 `sketchLayer`로 바꿔 `layerStack`으로 쌓는다.
  - (master)의 `subtitle`은 고양이 그림을 완성하라는 안내 문구이다.
  - `graph1`의 `a`가 바뀌면 `sketch1`도 같은 `a` 값을 갖고, `graph1`의 창을 움직이면 `sketch1`의 창도 따라간다.
- 관찰예측: `graph1`의 `a`가 바뀌면 `sketch1`도 같은 `a` 값을 갖고, `graph1`의 창을 움직이면 `sketch1`의 창도 따라간다. `sketch1`의 획이 `graph1`의 배경에 나타난다.
- 확인되지 않은 부분: `sketch1`로 전달된 `a`가 어디에 쓰이는지.

### Sketch.function [sink] <!-- A-sketch-27 -->
- 코드 요지: 수식 입력창의 LaTeX를 `x`에 대한 함수로 만들어 그림판의 `function("f")`에 넣는다.
- 확정 문장:
  - `function("f")` sink는 `equationInput.latex` source와 변수 `"x"`로 만든 `simpleFunction`이다.
  - 이 함수는 그림판 배경 그래프에 정의된 함수 `f`에 전달된다. 학생이 `equationInput`에 x에 대한 식을 입력하면 배경 그래프의 `f(x)`가 그 식을 받아 실시간으로 그려진다.
  - 그림판은 그래프 컴포넌트를 추가한 뒤 속성을 그림판으로 바꿔 만들 수 있다. 이렇게 만든 그림판은 배경 그래핑 계산기에 함수를 식으로 입력·출력하면서 필기도 할 수 있다.
- 관찰예측: `equationInput`에 유효한 식을 입력하면 그 식이 함수 `f`로 반영된다.
- 확인되지 않은 부분: 잘못된 입력의 처리.

### Sketch.resetOnChange [sink] <!-- A-sketch-29 -->
- 코드 요지: 완료된 획과 현재 획을 합친 `totalSketch`의 획 수로 `resetOnChange` 값을 `"0"`/`"1"` 중에서 정한다.
- 확정 문장:
  - `totalSketch`는 `mergeSketches`로 `this.sketch`와 `this.currentStroke`를 합친 값이다.
  - `resetOnChange` sink는 `totalSketch.strokeCount`가 2 미만이면 `"0"`, 아니면 `"1"`이다.
  - `resetOnChange`는 값이 바뀌면 리셋되는 방식이 아니라 `when`/`otherwise`로 조건을 판정하는 값이다. `"1"`이면 리셋함(true), `"0"`이면 리셋하지 않음(false)이다. boolean 판정과 같다.
  - (master)의 `subtitle`은 한 번의 획으로 도형을 따라 그리라는 안내 문구이다.
  - 첫 번째 획은 그대로 유지되다가, 두 번째 획을 긋기 시작하는 순간(`strokeCount`가 2가 될 때) 첫 번째 획이 즉시 사라지고 방금 긋기 시작한 획만 남는다.
- 관찰예측: 한 획으로만 그리는 동안은 값이 `"0"`이고, 두 번째 획이 시작되면 `"1"`로 바뀌어 첫 획이 지워진다.
- 확인되지 않은 부분: 리셋 뒤 값이 다시 `"0"`이 되는지. 판정 방식(조건 판정형, `"1"`=리셋)은 확정됐고, 리셋 뒤 값 변화는 확인되지 않았다.

### Sketch.warning [sink] <!-- A-sketch-31 -->
- 코드 요지: master는 `subtitle` sink에 안내문을 넣고, 그림판은 `warning` sink를 `this.sketch.strokeCount`에 따라 빈 문자열 또는 경고문으로 정한다.
- 확정 문장:
  - `(master)`의 `subtitle` sink는 "Trace the figure using a single sketch stroke."로 설정된다.
  - 그림판의 `warning` sink는 `this.sketch.strokeCount < 2`이면 `""`이고, 그 외(strokeCount가 2 이상)에는 "More than one stroke is used."이다.
  - 인용: `when this.sketch.strokeCount < 2 ""` / `otherwise "More than one stroke is used."`
  - 경고 문구는 미리보기에서 표시된다. 교사 대시보드와 학생 화면에서의 표시 여부는 확인 필요로 남긴다.
- 관찰예측: stroke가 0개 또는 1개이면 경고 문구가 비어 있고, stroke가 2개 이상이 되면 "More than one stroke is used." 경고 문구가 나타난다.
- 확인되지 않은 부분: 경고가 교사 대시보드와 학생 화면에 표시되는지(확인 필요). 코드에는 없다.

### Sketch.readOnly [sink] <!-- A-sketch-32 -->
- 코드 요지: 그림판은 `readOnly: true`로 두고, 수식 답변은 `correct: this.numericValue = 10`으로 정답 조건을 정한다.
- 확정 문장:
  - 그림판은 `readOnly: true`로 설정하여 대시보드 채점 대상에서 제외하지만, 학생은 그림판에 자유롭게 풀이 과정을 그릴 수 있다.
  - 수식 입력창은 `correct: this.numericValue = 10`으로 설정하여 10을 입력하면 정답으로 판정한다.
  - `correct`로 판정하는 대상이 2개 이상이면 최종적으로 정답 여부를 표시할 한 개만 남기고, 나머지 대상에는 `readOnly: true`를 설정하여 정답 표시 항목을 정할 수 있다.

### Note.content [sink] <!-- A-note-01 -->
- 코드 요지: `nameInput0.content`를 변수 `myName`으로 읽어 환영 문구에 보간해 메모의 `content`로 설정한다.
- 확정 문장:
  - `레이블 없는 메모:1`은 `nameInput0.content`(source)를 변수 `myName`으로 정의한다.
  - `레이블 없는 메모:3`은 `myName`을 `"Welcome to the activity, ${myName}!"`에 보간해 `content` sink로 설정한다.
  - 입력창에 제출 버튼이 없고 제출을 조건으로 걸지도 않았으므로, 입력한 이름이 입력하는 즉시(실시간으로) 환영 문구에 반영된다.
- 관찰예측: 입력창에 입력한 이름이 환영 문구에 나타난다.

### Image.hidden [sink] <!-- A-image-01 -->
- 코드 요지: `button1.timeSincePress()`가 0보다 크면 이미지를 숨기고, `button1`의 `resetLabel`은 `"Show Image"`로 설정한다.
- 확정 문장:
  - `레이블 없는 이미지:1`은 `button1.timeSincePress() > 0`(source)을 `hidden` sink로 설정한다.
  - `button1:1`은 `resetLabel`을 `"Show Image"`로 설정한다.
  - 처음에는 이미지가 보이고, `button1`을 눌러야 이미지가 사라진다. 이미지가 사라지면 리셋 라벨 `"Show Image"`가 보인다. 리셋 라벨을 누르면 초기화되어 `timeSincePress()`가 0이 되고 이미지가 다시 보인다.
- 관찰예측: `button1`을 누르면 이미지가 숨겨지고, Reset 뒤에는 이미지가 다시 보인다.

### Math Input.timeSinceSubmit [source] <!-- B-math-response-03 -->
- 코드 요지: `raceButton.timeSinceSubmit`을 `t_0`에, `firstDefinedValue(raceButton.numericValue,1)`을 `s_{peed}`에 보낸다.
- 확정 문장:
  - `number("t_0")` sink는 `raceButton.timeSinceSubmit`이다. 제출 후 흐른 시간이 그래프의 `t_0`에 전달된다.
  - `number("s_{peed}")` sink는 `firstDefinedValue(raceButton.numericValue,1)`이다. `raceButton.numericValue`가 정의되어 있으면 그 값을, 그렇지 않으면 1을 쓴다.
  - 숫자를 입력하기 전에는 `s_{peed}`가 1이고, 숫자를 입력하고 제출 버튼을 누르면 `t_0`가 0부터 계속 증가하며 그래프의 애니메이션이 작동한다.
- 관찰예측: 제출 후 `t_0`가 제출 후 경과 시간에 따라 변한다. `numericValue`가 없을 때 `s_{peed}`에는 1이 쓰인다.
- 확인되지 않은 부분: 제출 전 `timeSinceSubmit`의 값.

### Math Input.submitted [source] <!-- B-math-response-04 -->
- 코드 요지: `newInspectInput`이 제출되었을 때만 그 `numericValue`를 `a`로 쓰고, 제출 전에는 10000을 쓴다.
- 확정 문장:
  - `cubicGraph`의 `number("a")` sink는 `newInspectInput.submitted`이면 `newInspectInput.numericValue`, 그 외에는 `10000`이다.
  - 메모의 `feedback`은 `newInspectInput.submitted and (cubicGraph.number("a") < -9.3 or cubicGraph.number("a") > 10)`이면 `"\n\nYour point is off the screen."`, 그 외에는 `""`이다.
  - 메모의 `content` sink는 ``"Enter the value for `x` you want to inspect.${feedback}"``이다.
  - 값을 타이핑하는 중에는 변화가 없고, 제출하면 그래프에 반영되며 범위 밖이면 경고가 나타난다. 제출 뒤 입력창을 다시 수정하기 시작하면 `submitted`가 거짓이 되어 경고가 사라지고 `a`는 10000이 된다.
- 관찰예측: 제출 전에는 `a`가 10000이지만 경고 조건에 `submitted`가 들어 있어 경고는 보이지 않는다. 범위 밖 값을 제출하면 경고가 보인다.

### Math Input.explainContent [source] <!-- B-math-response-05 -->
- 코드 요지: master `subtitle`, 그래프의 `t_0`·`N`, 메모의 `explainContent` 표시, `input`의 `explainPrompt`를 설정한다.
- 확정 문장:
  - `(master)`의 `subtitle` sink는 "How many people are there in the graph display?"이다.
  - `number("t_0")` sink는 `input.timeSinceSubmit(20)`으로 제출 후 최대 20초까지 흐르는 시간이고, `number("N")` sink는 `input.numericValue`이다.
  - 메모의 `content` sink는 `isBlank(input.explainContent)`이면 `""`, 그 외에는 "Here's the strategy you used to make your estimation:" 뒤에 `input.explainContent`를 붙인 문장이다.
  - `input`의 `explainPrompt` sink는 "What strategy did you use to make your estimate?"이다. 숫자를 입력하고 제출하면 이 질문과 함께 설명 입력칸이 나타나고, 거기에 글을 쓰면 실시간으로 메모에 표시된다.
- 관찰예측: 설명(`explainContent`)이 비어 있으면 메모에 전략 문구가 나타나지 않고, 설명을 적으면 그 텍스트가 안내문 뒤에 나타난다.

### Math Input.history [source] <!-- B-math-response-06 -->
- 코드 요지: `newInspectInputFinal`이 `capture("xval"): this.numericValue`로 값을 기록하고, 그래프는 `history("xval")`을 `numberList("x_{history}")`에 받는다.
- 확정 문장:
  - `newInspectInputFinal`의 `capture("xval")` sink는 `this.numericValue`이며, 제출할 때마다 그 값을 기록한다.
  - `cubicGraph`의 `numberList("x_{history}")` sink는 `newInspectInputFinal.history("xval")`이다. 지금까지 capture된 `xval` 값 전체의 목록이다.
  - 메모의 `feedback`은 `submitted`이고 `lastValue("xval")`이 -9.3 미만 또는 10 초과이면 "\n\nYour point is off the screen.", 그렇지 않고 `submitted`이면 "\n\nYou're currently inspecting: `x=${lastValue("xval")}`", 그 외에는 `""`이다.
  - 숫자를 제출할 때마다 `x_{history}`에 값이 하나씩 누적되어 그래프에 점이 쌓이고, 메모에는 가장 마지막에 제출한 값에 대한 안내가 보인다.
- 관찰예측: 값을 여러 번 제출하면 `x_{history}` 목록에 capture된 값들이 반영된다. 제출 후 메모에는 마지막 `xval`이 현재 검사 값으로 보이고, 범위 밖이면 경고도 함께 보인다.

### Math Input.lastValue [source] <!-- B-math-response-07 -->
- 코드 요지: 그래프의 `number("x_{last}")` sink를 `newInspectInputFinal.lastValue("xval")`로 설정한다.
- 확정 문장:
  - `cubicGraph`의 `number("x_{last}")` sink는 `newInspectInputFinal.lastValue("xval")`로, capture된 `xval`의 마지막 값이다.
  - `newInspectInputFinal`은 `capture("xval"): this.numericValue`로 값을 capture한다. `submitted`를 조건으로 쓴다는 것은 이 입력창에 제출 버튼이 있다는 뜻이며, 제출 버튼을 눌러야 값이 기록된다.
  - 메모의 `feedback`은 `submitted`이고 마지막 `xval`이 범위(-9.3 미만 또는 10 초과) 밖이면 경고, 그렇지 않고 `submitted`이면 현재 검사 값 표시, 그 외에는 `""`이다.
- 관찰예측: 값을 제출하면 `x_{last}`와 메모의 `x=` 표기가 마지막 capture 값으로 바뀌고, 범위 밖이면 경고가 추가된다.
- 확인되지 않은 부분: capture가 아직 없을 때 `lastValue("xval")`이 무엇을 반환하는지는 코드에 없다.

### Math Input.submitCount [source] <!-- B-math-response-08 -->
- 코드 요지: `guess.submitted`일 때 `guess.numericValue`를 `G_{uessX}`로 보내고, 메모에 `guess.submitCount`를 표시한다.
- 확정 문장:
  - `number("G_{uessX}")` sink는 `guess.submitted`이면 `guess.numericValue`, 그 외에는 `1000`이다.
  - 메모의 `content` sink는 안내 문구 뒤에 `"You've guessed ${guess.submitCount} times."`를 붙인 문자열이다.
  - `submitCount`는 0부터 시작하므로, 제출하기 전에도 메모에 `"You've guessed 0 times."`가 보인다.
- 관찰예측: 제출 전 `G_{uessX}`는 1000이고, 제출 후에는 제출한 입력값으로 바뀐다. 제출할수록 메모의 횟수 표기가 증가한다.
- 확인되지 않은 부분: reset 시 처리 방식.

### Math Input.initialLatex [sink] <!-- B-math-response-09 -->
- 코드 요지: `expInput2`는 `initialLatex`로 `f\left(x\right)=`를 입력창에 미리 넣고, 그래프는 제출된 `expInput2.latex`만 `simpleFunction(latex,"x")`로 함수 `f`에 쓴다.
- 확정 문장:
  - `expInput2`의 `initialLatex` sink는 `"f\left(x\right)="`로, 입력창이 `f(x)=`로 시작한다.
  - 그래프의 `latex`는 `expInput2.submitted`이면 `expInput2.latex`, 그 외에는 `""`이다.
  - `function("f")` sink는 `simpleFunction(latex,"x")`이다. 제출 전에는 빈 `latex`가 연결된다.
  - 학생이 미리 들어 있는 `f(x)=` 뒤에 식만 이어 넣어도, `f(x)=`를 모두 지우고 식만 넣어도 제출하면 함수가 작동한다.
- 관찰예측: 입력창에 처음부터 `f(x)=`가 들어 있고, 제출 전에는 빈 `latex`가 함수에 연결되며, 제출 후에는 입력한 `latex`가 `f`에 반영된다.
- 확인되지 않은 부분: 빈 `latex`에 대한 표시 결과.

### Math input.placeholderLatex [sink] <!-- B-math-response-10 -->
- 코드 요지: 수식 답변의 `placeholderLatex` sink를 `(x,y)`로 설정한다.
- 확정 문장:
  - 수식 답변 입력란의 `placeholderLatex` sink는 `(x,y)`이다. 입력란이 비어 있을 때 보이는 안내 수식이다.
    - 인용: ``placeholderLatex: `(x,y)` ``
  - 이 안내 수식은 연한 회색으로 보이고, 학생이 타이핑을 시작하면 사라진다.
- 관찰예측: 입력란이 비어 있을 때 `(x,y)`가 안내용으로 보인다.

### Math Input.disableEvaluation [sink] <!-- B-math-response-11 -->
- 코드 요지: `fractionChecker`의 `disableEvaluation` sink를 `true`로 설정한다.
- 확정 문장:
  - `disableEvaluation: true`는 수식 입력창의 자동 계산 결과 표시를 끄는 설정이다.
  - 예를 들어 `1/2`나 `3+4`를 입력해도 입력창 오른쪽에 `0.5`나 `7`이 표시되지 않는다.
- 관찰예측: `fractionChecker`에 `1/2`나 `3+4`를 입력해도 입력창 오른쪽에 `0.5`나 `7`이 표시되지 않는다.

### Math Input.errorMessage [sink] <!-- B-math-response-12 -->
- 코드 요지: `fractionChecker`의 `errorMessage` sink를 `isUndefined(this.numericValue)`에 따라 오류 문구 또는 빈 문자열로 정한다.
- 확정 문장:
  - `fractionChecker`의 `errorMessage` sink는 `isUndefined(this.numericValue)`이면 `"You have to type a valid number."`, 그 외에는 `""`이다.
  - 숫자는 `pi` 같은 상수를 포함해 모두 받아들여 넘어간다. 문자(`a`, `x` 등)를 입력하면 제출 버튼이 비활성화되고, 누르면 오류 메시지가 출력된다.
- 관찰예측: 유효한 수로 해석되지 않는 입력이면 "You have to type a valid number."가 보이고, 유효한 수이면 그 문구가 사라진다.
- 확인되지 않은 부분: 빈 입력일 때의 처리.

### Math Input.initialText [sink] <!-- B-math-response-19 -->
- 코드 요지: Math Input의 `initialText` sink에 문자열을 넣는다.
- 확정 문장:
  - `initialText`는 수식 답변을 제출한 뒤 나타나는 설명(explain) 입력칸에 처음부터 들어 있을 문구를 정하며, 여기서는 "My strategy was . . ."이다.
- 관찰예측: 숫자를 제출해 설명 입력칸이 나타나면, 그 칸에 처음부터 "My strategy was . . ."가 채워져 있다.

### Math Input.explainPrompt [sink] <!-- B-math-response-20 -->
- 코드 요지: Math Input의 `explainPrompt` sink에 질문 문자열을 넣는다.
- 확정 문장:
  - `explainPrompt`는 수식 답변의 설명(explain) 입력칸 위에 보일 질문 문구(prompt)를 정하며, 여기서는 "What strategy did you use to make your estimate?"이다.
  - 숫자를 입력하고 제출하면 아래에 설명 입력칸이 열리면서 그 위에 이 질문이 표시된다.
- 관찰예측: explain 입력 영역이 나타나면 이 질문이 prompt로 보인다.

### Math Input.correct [sink] <!-- B-math-response-23 -->
- 코드 요지: 컴포넌트 `fractionChecker`의 `correct` sink를 자기 자신의 `numericValue` 비교로 정한다.
- 확정 문장:
  - `correct`는 `fractionChecker.numericValue = 0.05`의 비교 결과로 정해진다. `numericValue`가 0.05이면 correct이고 다른 값이면 correct가 아니다.
  - `1/20`처럼 0.05로 계산되는 분수 입력도 정답으로 인정된다.
- 관찰예측: `numericValue`가 0.05로 평가되는 입력은 correct 상태가 되고, 그 밖의 값은 correct가 아니다.
- 확인되지 않은 부분: correct가 어디에 어떻게 표시되는지.

### Math Input.readOnly [sink] <!-- B-math-response-24 -->
- 코드 요지: Math Input의 `readOnly` sink를 true로 둔다.
- 확정 문장:
  - `readOnly: true`는 수식 입력을 막지 않는다.
  - 수식 입력은 가능하지만 대시보드 정오답 판정에서 제외된다.

### Math Input.resetOnChange [sink] <!-- B-math-response-26 -->
- 코드 요지: graph가 `input.timeSinceSubmit(1)`을 `t_0`에, `input.numericValue`를 `a_{rea}`에 연결하고, input의 `resetOnChange`에는 graph의 `v`와 `h` 값을 이어 붙인 문자열을 넣는다.
- 확정 문장:
  - `resetOnChange`에 graph의 `number("v")`와 `number("h")`를 이은 문자열이 설정된다. 이 결합 문자열이 바뀌면, 즉 `v`나 `h`가 바뀌면 input이 reset된다.
  - reset되면 제출 상태와 `t_0`가 초기화되어 다시 제출할 수 있게 되고, 이미 제출된 숫자도 사라져 입력칸이 빈 칸이 된다.
- 관찰예측: graph에서 `v` 또는 `h` 값이 바뀌어 결합 문자열이 달라지면 input이 reset된다.
- 확인되지 않은 부분: `v`와 `h`를 문자열로 이을 때 서로 다른 값 조합이 같은 문자열이 될 가능성.

### Math Input.hidden [sink] <!-- B-math-response-28 -->
- 코드 요지: 메모는 `input1.submitted`일 때만 입력한 식(`input1.latex`)을 content에 덧붙이고, `input1`은 `timeSinceSubmit()`이 0보다 크면 hidden이 된다.
- 확정 문장:
  - 메모의 content는 "Write an expression that evaluates to 11" 뒤에 변수 `Latex`를 붙인 문자열이다. `Latex`는 `input1.submitted`가 참이면 "Your expression:" 문구와 `input1.latex`를 담고, 아니면 빈 문자열이다.
  - `input1`은 제출 후 경과 시간(`timeSinceSubmit()`)이 0보다 커지면 hidden이 된다. 제출 버튼을 누르면 즉시 `input1` 입력창이 사라지고, 메모에 "Your expression: [입력한 수식]"이 나타난다.
- 관찰예측: 제출 전에는 메모에 질문만 보이고 `input1`이 보인다. 제출 후에는 메모에 입력한 식이 덧붙고 `input1`은 숨겨진다.

### Choice.isSelected [source] <!-- B-multiple-choice-01 -->
- 코드 요지: Choice의 `isSelected(n)` source를 graph의 `M`과 choice 자신의 `explainPrompt`, `initialText`, `correct`, `warning`에 쓴다.
- 확정 문장:
  - `isSelected(n)`은 n번 보기가 선택되었는지를 돌려주는 source이며, graph에서는 `choice.isSelected(n)`, choice 안에서는 `this.isSelected(n)`으로 읽는다.
  - graph의 `M`은 1, 2, 3번이 선택되면 각각 1, 2, 3이고, 아무것도 선택되지 않으면 0이다.
  - `explainPrompt`와 `initialText`는 선택된 번호에 따라 linear, quadratic, exponential 모델에 맞는 문장이 되고, 선택이 없으면 빈 문자열이다.
  - `correct`는 3번 선택일 때만 true다.
  - `warning`은 1, 2, 3번 중 아무것도 선택되지 않았을 때 "No option selected!"이고, 선택이 있으면 빈 문자열이다.
- 관찰예측: 보기를 고르면 `M` 값과 explain의 질문·초기 문장이 선택한 번호에 맞게 바뀐다. 3번만 correct이고, 아무것도 고르지 않으면 warning이 생긴다.

### Choice.choiceContent [sink] <!-- B-multiple-choice-07 -->
- 코드 요지: 메모는 `mc4.submitCount`와 `mc4.submitted`로 시도 횟수 문구를 만들고, mc4는 `readOnly: true`와 보기 문구를 설정한다.
- 확정 문장:
  - `mc4`의 `readOnly: true`는 학생의 선택·제출을 막는 것이 아니라 대시보드 채점에서 제외한다.
  - 학생은 보기를 선택하고 제출할 수 있으며, 제출하면 메모에 제출 횟수와 오답 피드백이 표시된다.
- 관찰예측: 학생은 보기를 선택하고 제출할 수 있고, 제출하면 메모에 제출 횟수가 들어간 오답 피드백이 나타난다. 보기는 Apples, Bananas, Strawberries다.

### Checkboxes.prompt [sink] <!-- B-multiple-choice-09 -->
- 코드 요지: 체크박스의 `prompt` sink에 안내 문구를 넣는다.
- 확정 문장:
  - `prompt`는 체크박스에 붙는 안내 문구를 정하며, 여기서는 "(Select at most 2 out of 3)"다. 이 코드에는 선택 수를 실제로 제한하는 설정이 없고 문구만 설정한다.
  - 이 문구는 체크박스의 가운데 상단에 약간 반투명한 회색으로 보인다.
- 관찰예측: 체크박스 주변에 "(Select at most 2 out of 3)" 안내 문구가 보인다.

### Choice.maxSelectedChoices [sink] <!-- B-multiple-choice-11 -->
- 코드 요지: 체크박스의 `maxSelectedChoices` sink를 2로 둔다.
- 확정 문장:
  - `maxSelectedChoices`는 동시에 선택할 수 있는 보기의 최대 개수를 정하며, 여기서는 2다.
  - 보기 2개를 선택하면 나머지 보기가 즉시 비활성화되어 다른 보기를 추가로 선택할 수 없다.
- 관찰예측: 2개를 선택하면 나머지 보기를 더 고를 수 없게 된다.

### Choice.correct [sink] <!-- B-multiple-choice-16 -->
- 코드 요지: choice의 `correct`를 선택 조합 두 가지의 논리식으로 정하고, graph는 `c = choice`로 choice를 변수에 담아 5개 보기의 선택 여부를 1 또는 0으로 전달한다.
- 확정 문장:
  - `correct`는 1번과 4번만 선택했거나 2번, 3번, 5번만 선택했을 때만 true다. 그 외 조합은 correct가 아니다.
  - graph의 `i_{sSelectedC}`~`i_{sSelectedG}`는 각각 1~5번 보기가 선택되면 1, 아니면 0이다.
  - graph는 `c = choice`로 choice를 변수 `c`에 연결해 `c.isSelected(n)`을 읽는다.
  - graph에는 `readOnly: true`, `bounds: makeBounds(x_m, x_M, y_m, y_M)`, `initialColor: colors.black`, `initialTool: sketchTools.line`이 설정된다.
  - graph의 `readOnly: true`에도 B-math-response-24·B-multiple-choice-07의 판정이 같은 방식으로 적용된다. 즉 학생의 입력·조작을 막지 않고, 대시보드 정오답 판정에서만 제외한다.
- 관찰예측: 1·4번만, 또는 2·3·5번만 선택한 조합에서만 correct가 되고, 선택 상태는 graph의 5개 수에 1 또는 0으로 반영된다.

### Choice.readOnly [sink] <!-- B-multiple-choice-18 -->
- 코드 요지: 메모는 `mc4.submitCount`와 `mc4.submitted`로 시도 횟수 피드백 문장을 만들고, `mc4`는 `readOnly: true`로 설정된다.
- 확정 문장:
  - `readOnly: true`는 객관식의 선택·제출을 막지 않는다.
  - 객관식은 대시보드 정오답 채점에서 제외된다.

### Ordered List.order [source] <!-- B-ordered-list-02 -->
- 코드 요지: 그래프의 numberList `L`이 order1의 현재 순서(`order` source)를 받는다.
- 확정 문장:
  - `order1.order`는 정렬 리스트의 현재 순서를 담은 source이며, 현재 배치 순서대로 각 항목의 원래 인덱스 번호를 담은 리스트다. 이 리스트가 그래프의 numberList `L`에 전달된다.
  - 항목 순서를 위아래로 바꿀 때마다 현재 순서에 해당하는 숫자 리스트가 실시간으로 `L`에 반영된다.
- 관찰예측: 항목을 끌어 순서를 바꾸면 `L`의 숫자 순서가 바뀐다.
- 확인되지 않은 부분: 인덱스가 1부터인지.

### Ordered List.warning [sink] <!-- B-ordered-list-09 -->
- 코드 요지: g가 order1의 현재 순서를 numberList `L`로 받고, (master)의 subtitle이 `L[1]`, `L[2]`, `L[3]`을 이어 붙이며, order1의 `warning`은 1번째 자리가 2이고 2번째 자리가 3일 때 경고 문구를 낸다.
- 확정 문장:
  - `g`의 numberList `L`은 `order1.order`를 받는다. 학생이 보기의 순서를 바꾸면 그 순서가 그대로 배열(list) `L`에 저장된다.
  - (master)의 `subtitle`은 `g.number("L[1]")`, `g.number("L[2]")`, `g.number("L[3]")`으로 `L`의 원소를 차례대로 읽어 이어 붙인 문자열이다.
  - `order1`의 `warning`은 1번째 위치의 항목이 2이고 2번째 위치의 항목이 3일 때 "Student might be using the image size instead of actual size."이고, 그 밖에는 `""`이다.
- 관찰예측: 정렬 순서가 바뀌면 subtitle에 보이는 숫자가 현재 순서에 맞춰 바뀐다. 순서가 2, 3으로 시작하면 이미지 크기를 쓴 것일 수 있다는 warning 문구가 설정된다.
- 확인되지 않은 부분: subtitle에서 세 숫자를 붙일 때 구분자가 생기는지.

### Ordered List.readOnly [sink] <!-- B-ordered-list-10 -->
- 코드 요지: 정렬 리스트의 `readOnly` sink를 `true`로 설정한다.
- 확정 문장:
  - `readOnly: true`는 정렬 리스트의 조작을 막지 않는다.
  - 학생은 항목 순서를 바꿀 수 있지만, 대시보드 정오답 채점에서는 제외된다.

### Input.content [source] <!-- B-free-response-01 -->
- 코드 요지: `nameInput.content` source를 변수 `myName`에 담아 메모의 `content` sink 문자열 안에 넣는다.
- 확정 문장:
  - `myName = nameInput.content`로 입력 컴포넌트의 `content` source(입력한 텍스트)를 변수에 연결한다.
  - 메모의 `content` sink는 `"Welcome to the activity, ${myName}!"`이다.
  - `submitted` 같은 조건이 없으므로 이름을 타이핑하는 즉시 메모에 반영된다.
- 관찰예측: 이름을 입력하면 메모에 "Welcome to the activity, 이름!" 형태의 문구가 나타나고, 입력 내용이 바뀌면 문구 속 이름도 바뀐다.

### Table.initialCellContent [sink] <!-- C-table-10 -->
- 코드 요지: 표 셀의 initialCellContent로 좌표쌍 5개의 초기값을 넣고, 두 열을 그래프 numberList로 읽는다. 핵심 줄: `initialCellContent(1,1): "5"` / `numberList("X"): table.columnNumericValues(1)`
- 확정 문장:
  - 1열의 초기값은 위에서부터 "5", "-7", "-4", "-7", "5"이다.
  - 2열의 초기값은 위에서부터 "-6", "-5", "3", "3", "4"이다.
  - 그래프는 1열을 numberList("X"), 2열을 numberList("Y")로 받고, number("t_0")은 button.timeSincePress(6)이다. 인자 6은 최대 시간으로, 버튼을 누른 뒤 6초까지의 경과 시간이 `t_0`에 들어간다.
  - 표에는 다섯 좌표쌍이 미리 채워져 있고 학생이 수정할 수 있다. 버튼을 누르면 최대 6초간 그래프 애니메이션이 재생되고 표의 좌표가 그래프의 점 리스트로 연동된다.
- 관찰예측: 표가 다섯 개의 좌표쌍으로 채워져 나타나고, 이 값이 그래프의 X, Y 목록으로 전달된다.

### Table.cellDisableEvaluation [sink] <!-- C-table-12 -->
- 코드 요지: 표의 1행 1열 셀의 수식 자동 계산을 끈다. 핵심 줄: `cellDisableEvaluation(1,1): true`
- 확정 문장:
  - `cellDisableEvaluation(1,1): true`는 표의 1행 1열 셀에서 수식 자동 계산을 끄는 설정이다.
  - `1/2`나 `2+3`을 입력해도 계산 결과로 자동 변환되지 않는다.
- 관찰예측: 1행 1열 셀에 `1/2`나 `2+3`을 입력해도 계산된 값으로 바뀌지 않는다.

### Table.resetOnChange [sink] <!-- C-table-17 -->
- 코드 요지: button을 누를 때마다 표의 두 셀 값을 capture하고, 표는 button.pressCount가 바뀔 때마다 reset한다. 핵심 줄: `resetOnChange: "${button.pressCount}"` / `capture("width"): table.cellNumericValue(1,1)`
- 확정 문장:
  - button의 capture("width")는 (1,1)의 숫자값, capture("height")는 (1,2)의 숫자값을 기록하며, graph는 button.history("width"), button.history("height")를 numberList(`W`), (`H`)로 받는다.
  - graph의 number(`w`), number(`h`)는 두 셀의 cellNumericValue이다.
  - button의 disabled는 두 셀 중 하나라도 정의되지 않았을 때이다.
  - table의 resetOnChange는 button.pressCount를 문자열로 쓰므로 button을 누를 때마다 표가 reset되어 빈 칸이 된다.
- 관찰예측: 두 셀에 값을 넣어야 button이 활성화되고, 누르면 기록 목록에 값이 쌓이며 표가 reset된다.

### Action Button.timeSincePress [source] <!-- C-action-button-01 -->
- 코드 요지: 메모가 `submitMe.timeSincePress`를 `myTime`에 담아 "It has been ${myTime} seconds since you pressed "Submit"." 문장에 넣는다.
- 확정 문장:
  - `submitMe.timeSincePress`는 submitMe 버튼을 누른 뒤 경과한 시간을 돌려주는 source이다.
  - 메모의 `content`는 이 값을 "seconds" 앞에 넣은 문장이다.
  - 버튼을 누르기 전에는 0이 나온 채로 시작하고, 버튼을 누르면 문장 속 숫자가 계속 늘어난다.
- 관찰예측: submitMe를 누른 뒤 문장 속 숫자가 증가한다.

### Action Button.resetLabel [sink] <!-- C-action-button-07 -->
- 코드 요지: goodTime 버튼의 `resetLabel`을 "Make a Bad Time Again"으로 설정하고, 그래프의 number `s_{mile}`이 `goodTime.timeSincePress`를 받는다.
- 확정 문장:
  - `resetLabel` sink는 goodTime 버튼의 reset용 label을 "Make a Bad Time Again"으로 정한다.
  - `s_{mile}`은 goodTime을 누른 뒤 경과한 시간을 받는다.
  - 처음에는 표정 A이고, goodTime을 누르면 표정이 B로 바뀌면서 리셋 버튼("Make a Bad Time Again")이 나타난다. 리셋하면 표정이 다시 B에서 A로 바뀐다.
- 관찰예측: goodTime을 누른 뒤 `s_{mile}`이 경과 시간을 반영하고, reset용 label로 "Make a Bad Time Again"이 사용된다.
- 확인되지 않은 부분: 버튼의 처음 label.

### Action Button.style [sink] <!-- C-action-button-09 -->
- 코드 요지: 행동 버튼의 `style`이 `pressCount`가 0이면 `buttonStyles.default`, 1이면 `buttonStyles.red`, 그 밖에는 `buttonStyles.link`이다.
- 확정 문장:
  - `style`은 `this.pressCount`가 0이면 `buttonStyles.default`, 1이면 `buttonStyles.red`, 2 이상이면 `buttonStyles.link`이다.
  - `buttonStyles.link`는 밑줄이 있는 텍스트 링크 형태다.
- 관찰예측: 처음에는 기본 버튼 모양이고, 한 번 누르면 빨간 스타일, 두 번 이상 누르면 밑줄이 있는 텍스트 링크 모양이 된다.
- 확인되지 않은 부분: `buttonStyles.default`의 정확한 외형.

### Action Button.resetOnChange [sink] <!-- C-action-button-11 -->
- 코드 요지: button의 `resetOnChange`가 graph의 `v`와 `h`를 이은 문자열이고, graph의 `t_0`과 메모가 `button.timeSincePress(...)`로 경과 시간을 받는다.
- 확정 문장:
  - `resetOnChange` 문자열(`v`와 `h` 값을 이은 것)이 바뀌면 button이 reset된다.
  - `t_0`은 `button.timeSincePress(1)`을, 메모는 `button.timeSincePress(100)`을 문장에 넣는다.
  - 점을 움직여 `v`나 `h`가 바뀌면 버튼이 즉시 리셋되어 타이머가 멈추고 경과 시간이 0으로, 즉 초기 상태로 돌아간다.
- 관찰예측: 버튼을 누르면 경과 시간이 증가하고, 점을 움직여 `v`나 `h`가 바뀌면 버튼이 reset된다.
- 확인되지 않은 부분: `timeSincePress`의 인자(1, 100)의 정확한 효과.

### Challenge Creator.challengeText [Sink] <!-- C-challenge-creator-03 -->
- 코드 요지: Challenge Creator의 `challengeText`에 `inputCC1.latex`를 설정한다.
  - `challengeText: inputCC1.latex`
- 확정 문장:
  - `challengeText` sink는 `inputCC1.latex`(source)이다.
  - `(master)`의 `subtitle`은 부분 활동 안내와 완성 활동 URL이다.
  - 학생이 입력창에 수식을 쓰고 챌린지를 만들면, 다른 학생들이 풀게 될 챌린지 카드의 문제 문구에 그 수식이 그대로 나타난다.
- 관찰예측: 입력한 수식이 챌린지의 문제 text로 반영된다.

### Media.time [source] <!-- C-media-01 -->
- 코드 요지: 비디오(미디어) 컴포넌트 `eggsVideo2`의 `time`을 그래프 변수 `b`에 보낸다.
  - `number("b"): eggsVideo2.time`
- 확정 문장:
  - `number("b")` sink는 `eggsVideo2.time`(source)을 그래프 변수 `b`에 설정한다.
  - `time`은 영상의 현재 재생 시점(초)이다. 동영상을 재생하거나 탐색 바를 움직이면 그 시점이 `b`에 실시간으로 전달된다.
- 관찰예측: 영상의 재생 위치가 바뀌면 `b`도 따라 바뀐다.
- 확인되지 않은 부분: 일시정지 중 값이 유지되는지.

### Media.time [sink] <!-- C-media-02 -->
- 코드 요지: `mcEggs`에서 고른 번호에 따라 `eggsVideo1`의 `time` sink 값을 정하고, 메모는 같은 번호로 달걀 수 설명 문장을 만들어 content로 보인다.
  - `eggsVideo1`: `time: when mcEggs.isSelected(1) 13.78 ... when mcEggs.isSelected(5) 1.2 otherwise 0`
  - 메모: `content: "How many eggs do you want to see?${eggsRemoved}"`
- 확정 문장:
  - `eggsVideo1`의 `time` sink는 `mcEggs`에서 1~5번이 선택되면 각각 13.78, 11.72, 6.54, 5.66, 1.2초이고, 선택이 없으면 0이다. 이 sink는 영상의 재생 위치를 그 시각으로 즉시 이동시킨다(예: 3번을 고르면 6.54초 위치로 이동).
  - 메모의 `eggsNum`은 선택 번호(1~5), 없으면 0이다. `pluralVerb`는 1번이 아니면 `"were"`, 1번이면 `"was"`이고, `pluralNoun`은 1번이 아니면 `"s"`, 1번이면 `""`이다.
  - 메모의 `optionSelected`는 1~5번 중 하나라도 선택되었는지이고, `time`은 `eggsVideo1`의 `time`과 같은 값표(13.78, 11.72, 6.54, 5.66, 1.2, 아니면 0)이다.
  - `eggsRemoved`는 선택이 있으면 `"\n\nThere ${pluralVerb} ${eggsNum} egg${pluralNoun} at ${time} seconds."`, 없으면 `""`이다.
  - 메모의 `content` sink는 `"How many eggs do you want to see?${eggsRemoved}"`이다.
- 관찰예측: 달걀 수 선택에 대응하는 시점으로 영상의 시간이 바뀌고, 메모에 질문과 함께 단수/복수가 맞춰진 설명 문장이 나타난다.
- 확인되지 않은 부분: 메모의 `eggsTimes`는 코드 안에서 참조하는 줄이 없다.

### Random Numbers <!-- C-adv-01 -->
- 코드 요지: note1이 난수 생성기로 A, B를 만들고 C와 equation을 구성하며, 수식 답변은 입력의 numericValue가 `note1.script.B`와 같을 때 correct이다.
- 확정 문장:
  - `r = randomGenerator()`로 난수 생성기를 만들고, `A`는 `r.int(-12,-2)`, `B`는 `r.int(3,7)`로 정한다.
  - `C`는 `${A}*${B}` 문자열을 `numericValue(...)`로 계산한 값, 즉 A와 B의 곱이다.
  - `equation`은 `${A}x+${B}y=${C}` 형태의 문자열이다.
  - 수식 답변의 `correct`는 `this.numericValue`가 `note1.script.B`와 같을 때 참이다.
  - 화면이 열릴 때마다 무작위 방정식이 제시되고, 수식 입력창에 B에 해당하는 숫자를 입력하면 대시보드에 정답으로 체크된다.
- 관찰예측: A, B가 난수로 정해지고, 학생이 B와 같은 숫자를 입력하면 정답으로 판정된다.

### Simple aggregate <!-- C-adv-10 -->
- 코드 요지: `exp1.numericValue`를 `aggregate`해 그래프 숫자 리스트 `L`로 보낸다.
  - `numberList("L"): aggregate(exp1.numericValue)`
- 확정 문장:
  - 여러 학생의 `exp1.numericValue`를 `aggregate`하여 그래프의 숫자 리스트 `L`로 만든다.

### Aggregate <!-- C-adv-11 -->
- 코드 요지: `graph1`이 학생들의 `btn1` capture 값(`a`, `b`)의 마지막 값을 `aggregate`해 리스트 `A`, `B`로 만든다.
  - `numberList("A"): aggregate(btn1.lastValue("a"))`
  - `capture("a"): graph1.number("a")`
- 확정 문장:
  - 판정 대상은 `graph1`의 `aggregate` 코드이다.
  - `btn1`은 캡처값을 만드는 참고 코드이다.
  - 학급 전체 학생들이 `btn1`로 캡처한 마지막 `a`, `b` 값을 각각 `aggregate`하여 배열(LIST) `A`, `B`로 저장한다.
- 관찰예측: 점을 옮긴 뒤 버튼을 누르면 캡처된 마지막 `a`, `b` 값이 집계되어 리스트 `A`, `B`에 나타난다. `a = -9`이고 `b = 9`인 위치에서는 버튼이 비활성화된다.

### Using simple function <!-- C-adv-12 -->
- 코드 요지: 수식 답변 `exp1`의 latex를 `simpleFunction`으로 바꿔 그래프 함수 `f`에 연결하고, 그래프의 변수 `C`가 1이면 `exp1`을 정답 처리한다.
  - `function("f"): simpleFunction(exp1.latex)`
  - `correct: graph1.number(\`C\`) = 1`
- 확정 문장:
  - `graph1`은 `readOnly: true`이다.
  - `function("f")` sink는 `simpleFunction(exp1.latex)`의 결과를 그래프 함수 `f`로 설정한다. `simpleFunction`에 변수 이름 인자를 주지 않으면 기본 변수는 `x`다.
  - `exp1`의 `correct` sink는 `graph1.number(\`C\`) = 1`이다.
- 관찰예측: 입력한 식이 그래프 함수 `f`로 그려지고, `C`가 1이면 정답이다.
- 확인되지 않은 부분: `simpleFunction`이 허용하는 식 범위. 그래프 안에서 `C`가 1이 되는 조건(코드에 없음).

### Using simple function <!-- C-adv-13 -->
- 코드 요지: 수식 답변 `exp1`의 latex를 `parseEquation`으로 해석해 `x`, `y`의 `differenceFunction`을 그래프 함수 `f`에 연결하고, `C`가 1이면 정답 처리한다.
  - `function("f"): parseEquation(exp1.latex).differenceFunction("x", "y")`
  - `correct: graph1.number(\`C\`) = 1`
- 확정 문장:
  - `graph1`은 `readOnly: true`이다.
  - `parseEquation`은 먼저 등호를 기준으로 좌변(left hand side, `lhs`)과 우변(right hand side, `rhs`)을 나눈다. `differenceFunction`은 좌변에서 우변을 뺀 함수(`lhs − rhs`)를 만든다.
  - `function("f")` sink는 `parseEquation(exp1.latex).differenceFunction("x", "y")`, 즉 `x`, `y`에 대한 `lhs − rhs` 함수를 그래프 함수 `f`로 설정한다.
  - `exp1`의 `correct` sink는 `graph1.number(\`C\`) = 1`이다.
- 관찰예측: 입력한 방정식이 `x`, `y`에 대한 함수로 그래프에 반영되고, `C`가 1이면 정답이다.
- 확인되지 않은 부분: 그래프에 그려지는 방식. `C`가 1이 되는 조건(코드에 없음).

### sink와 source는 각각 무엇인가? 값이 어느 방향으로 흐르는지, 각각 예를 하나씩 들어라. <!-- D-concept-02 -->
- 코드 요지: sink와 source의 정의, 값의 흐름 방향을 묻는 개념 질문. 예시: `content: "정답입니다!"` / `btn.pressCount`
- 확정 문장:
  - Sink: CL 스크립트에서 계산·지정한 값을 컴포넌트 속성에 주입하여 상태나 화면 표시를 변경함. 데이터 흐름은 CL → 컴포넌트 (쓰기/수신). 예: `content: "정답입니다!"`, `hidden: true`
  - Source: 학생의 입력값이나 컴포넌트 내부 상태를 CL 스크립트에서 참조할 수 있도록 제공함. 데이터 흐름은 컴포넌트 → CL (읽기/발신). 예: `btn.pressCount`, `input.numericValue`
- 관찰예측: sink로 설정한 값은 해당 컴포넌트의 상태나 화면 표시에 반영되고, source는 학생의 입력이나 컴포넌트 상태를 스크립트에서 읽게 해 준다.

### `this`와 `컴포넌트이름.무언가` 형태의 참조는 각각 무엇을 가리키는가? <!-- D-concept-05 -->
- 코드 요지: `this`와 `컴포넌트이름.무언가` 참조의 대상을 묻는 개념 질문. 예시: `this.numericValue` / `input1.numericValue`
- 확정 문장:
  - `this`는 한 컴포넌트가 자기 CL 안에서 코드를 쓸 때, 자기 이름을 따로 지정하지 않고 자기 자신을 부르는 말이다.
  - `컴포넌트이름.무언가`는 이름이 붙은 다른 컴포넌트의 source 또는 script 변수를 가리킨다.
- 관찰예측: `this.numericValue`는 자기 컴포넌트의 값을, `input1.numericValue`는 input1의 값을 읽는다.

### 코드에서 줄의 순서는 실행 결과에 영향을 주는가? <!-- D-concept-09 -->
- 코드 요지: 코드에서 줄 순서가 결과에 영향을 주는지 묻는 개념 질문. 예시: `a = b`
- 확정 문장:
  - CL은 순차 실행이 아니라 값 사이의 연결을 선언하는 언어라서, 줄 순서는 실행 결과에 영향을 주지 않는다.
- 관찰예측: 같은 변수를 쓰는 줄이 앞에 있든 뒤에 있든 결과 화면은 같다.
- 확인되지 않은 부분: 같은 이름을 두 번 정의했을 때의 처리.

### 수식 입력의 `numericValue`와 `latex`는 어떻게 다르고, 문자열 안에 넣으면 각각 어떻게 보이는가? <!-- D-concept-11 -->
- 코드 요지: 수식 입력의 `numericValue`와 `latex`의 차이를 묻는 개념 질문. 예시: `content: "${exp1.numericValue} / ${exp1.latex}"`
- 확정 문장:
  - `numericValue`는 입력한 수식을 계산한 숫자 값이다.
  - `latex`는 입력한 수식을 나타내는 LaTeX 표기 문자열이다.
  - 문자열 안에 넣으면 `numericValue`는 숫자 값이, `latex`는 LaTeX 텍스트가 삽입된다.
  - `latex`를 백틱으로 감싸면 LaTeX 외형으로 바뀌어 수식으로 표시된다. 백틱이 없으면 plain text로 보인다.
- 확인되지 않은 부분: 백틱 렌더링 규칙 외의 세부(수식 종류별 차이 등)는 기록에 없다.

### 여러 줄 문자열은 어떻게 쓰는가? 줄바꿈은 어떻게 표현하는가? <!-- D-concept-12 -->
- 코드 요지: 여러 줄 문자열과 줄바꿈 표현을 묻는 개념 질문. 예시: `content: "첫 줄\n둘째 줄"`
- 확정 문장:
  - 따옴표로 감싼 문자열 안에서 줄을 바꿀 수 있다. 엔터를 쳐서 실제로 줄을 바꾸는 방법과 `\n`을 쓰는 방법 둘 다 허용되며, 둘 다 화면 텍스트에 줄바꿈으로 반영된다.
- 관찰예측: 따옴표 안에서 줄을 바꿔 쓰면 화면 텍스트도 줄이 나뉘어 표시된다(D-code-06 코드와 같은 형태).

### 조건에 쓸 수 있는 비교 연산자와 논리 연산자를 나열하고 문법을 보여라. <!-- D-concept-15 -->
- 코드 요지: 조건에 쓰는 비교 연산자와 논리 연산자를 묻는 개념 질문. 예시: `ok = n >= 1 and n <= 10`
- 확정 문장:
  - 비교 연산자는 `=`, `<`, `>`, `<=`, `>=`이다. 같음 비교는 `=` 하나를 쓴다.
  - 논리 연산자는 `and`, `or`, `not(...)`이다.
  - 같지 않음을 나타내는 연산자는 따로 없다. `not(a = b)`처럼 `not`과 등호를 섞어 써서 표현한다.
- 관찰예측: `and`로 이은 비교는 두 조건이 모두 참일 때 참이 된다.

### 숫자를 비교해서 정답 판정을 할 때 주의할 점이 있는가? (예: 소수, 오차) <!-- D-concept-17 -->
- 코드 요지: 숫자를 비교해 정답 판정할 때의 주의점을 묻는 개념 질문. 핵심 줄: `correct: this.numericValue > 9.99 and this.numericValue < 10.01`
- 확정 문장:
  - 소수 계산이나 나눗셈은 오차가 생길 수 있으므로 단순 등호(`=`) 비교에 주의해야 한다.
  - 허용 범위를 부등식으로 지정한다.
  - 예: `correct: this.numericValue > 9.99 and this.numericValue < 10.01`
- 관찰예측: 허용 범위를 부등식으로 지정하면 그 범위 안의 값이 정답으로 판정된다. 단순 `=` 비교는 오차가 있는 값이 오답 처리될 수 있다.

### 존재하지 않는 sink나 source 이름을 쓰거나 문법이 틀렸을 때 Amplify에서는 어떻게 표시되는가? <!-- D-concept-18 -->
- 코드 요지: 존재하지 않는 sink·source 이름이나 문법 오류가 Amplify에서 어떻게 표시되는지 묻는 개념 질문.
- 확정 문장:
  - 문법 오류, 오타, 참조가 제대로 불러와지지 않는 상황에서는 해당 줄에 오류가 있음을 표시한다.
  - 표시 방식은 이미지처럼 주황색 세모 안에 느낌표가 있는 오류 아이콘이다.
  - 오류 아이콘에 마우스를 대면 어떤 오류인지 대략적인 설명이 나온다.
  - 이미지 예시의 설명은 `Syntax Error: Unexpected end of tokens.`이다.
  - 주석(`#`으로 시작하는 줄)은 오류 표시 대상이 아니다. 그 밖의 오타·문법 오류는 주황색 세모 아이콘으로 바로 표시된다.
- 관찰예측: 틀린 이름이나 문법이 있는 줄에 주황색 세모 느낌표 아이콘이 나타나고, 마우스를 올리면 오류 설명이 나온다.

### (master)(화면 전체)에 쓰는 코드와 개별 컴포넌트에 쓰는 코드는 무엇이 다른가? <!-- D-concept-19 -->
- 코드 요지: `(master)`(화면 전체) 코드와 개별 컴포넌트 코드의 차이를 묻는 개념 질문. 예시: `subtitle: "Hello"`
- 확정 문장:
  - `(master)`는 공식 용어가 아니라 화면 전체 코드를 가리키는 편의 표기다.
  - `(master)` 코드는 화면 전체에 적용되는 sink를 설정한다.
  - 개별 컴포넌트 코드는 해당 컴포넌트의 sink와 source를 다룬다.
  - 예시로 `title`, `subtitle`, `coverText`, `coverButtonLabel`, `disableCalculatorReason` 등이 있다. 예: `subtitle: "Hello"`
  - `(master)` 코드에서는 `this`가 작동하지 않는다.
- 관찰예측: `(master)`에 `subtitle:` 등을 쓰면 특정 컴포넌트가 아니라 화면 전체의 부제목 등이 바뀐다.

### Getting Started / sinks-sources <!-- D-code-04 -->
- 코드 요지: 버튼 btn1의 누른 횟수와 누른 뒤 경과 시간을 그래프 변수 b, a로 보낸다. 핵심 줄: `number("b"): btn1.pressCount` / `number("a"): btn1.timeSincePress(10)`
- 확정 문장:
  - number("b")는 btn1.pressCount이다. 버튼을 클릭할 때마다 b가 1씩 증가한다.
  - number("a")는 btn1.timeSincePress(10)이다. 인자 10은 최대 시간으로, `a`는 클릭 즉시 0에서 시작해 10초에 걸쳐 10까지 증가한다.
- 관찰예측: 버튼을 누를수록 b가 늘고, 누른 뒤에는 a가 경과 시간에 따라 증가한다.

### Getting Started / dynamic-text <!-- D-code-06 -->
- 코드 요지: 수식 입력의 LaTeX와 계산값을 변수로 받아 `content` sink에 여러 줄 문자열로 넣는다. 핵심 줄: `n = input1.latex` / `You wrote: ${n}` / `Which evaluates to: ${v}`
- 확정 문장:
  - `예시:1`은 `v`를 `input1.numericValue`로, `예시:3`은 `n`을 `input1.latex`로 정의한다.
  - `예시:5-9`는 `content` sink에 여러 줄 문자열을 설정하고, `${n}`과 `${v}`로 두 변수 값을 문자열 안에 삽입한다.
  - 첫 줄에는 입력한 수식(`n`), 둘째 줄에는 그 계산값(`v`)이 나온다.
  - 문자열 안에서 백틱으로 감싼 부분은 일반 텍스트가 아니라 수식 전용 텍스트로 바뀌어 글씨체가 달라 보인다.
- 확인되지 않은 부분: `${n}`을 백틱 없이 넣었을 때 수식으로 보이는지 문자열 그대로 보이는지.

### 변수에 컴포넌트를 넣어 부르기 (`i = input1`) <!-- U-alias-01 -->
- 코드 요지: 변수에 컴포넌트를 넣어 두고(`i = input1`), 그 변수 이름으로 그 컴포넌트의 source를 부른다. 실제로 쓰는 방식이다.
  - `i = input1`
  - `i.numericValue`, `i.latex`, `i.timeSinceSubmit(20)`, `i.lastValue("end")`
- 확정 문장:
  - 변수에 컴포넌트를 넣어 두면(`i = input1`) 그 변수 이름으로 그 컴포넌트의 source를 부를 수 있다. 예를 들어 `i.numericValue`는 `input1`의 `numericValue`를 읽는 것이다.
  - 실물로 확인된 사용 형태는 `i.numericValue`, `i.latex`, `i.timeSinceSubmit(20)`, `i.lastValue("end")` 네 가지이다.
  - 판정은 이 방식을 "그 컴포넌트의 source를 전부 부를 수 있다"고 표현했다. 이 패키지에서 확정으로 쓰는 범위는 **패턴 자체와 위 네 가지 형태까지**이다. 모든 컴포넌트, 모든 source, 모든 위치(어느 컴포넌트의 CL 안에서, 어느 sink·변수 정의 안에서 쓸 수 있는지)에서 된다고는 쓰지 않는다.
- 관찰예측: 해당 없음. 화면 동작이 아니라 이름을 붙이는 방식이다.
- 확인되지 않은 부분: 확인된 네 가지 외의 source에서도 되는지, 다른 컴포넌트(graph, sketch 등)를 변수에 넣는 경우, 변수 이름 규칙, 이 패턴을 쓸 수 있는 위치, 원문 코드.
- 읽는 법: 코드에 `이름 = 컴포넌트이름` 모양이 있고 그 이름으로 `.source`를 부르면, 그 이름이 해당 컴포넌트를 가리키는 것으로 읽는다. 컴포넌트 이름이 코드에 이미 있으므로 `input1`의 CL 요청은 "외부 컴포넌트 CL"로만 한다.
