# 구성요소별 CL sink 목록

> CL에 sink를 쓰기 전에 그 구성요소의 목록에 이름이 있는지 확인한다. 목록에 없는 sink는 편집기에 빨간 오류가 뜬다.
> 최종 판정은 편집기 오류 표시다(`reference/lint.md` 2-2절). 이 목록은 편집기 스크립트 창의 sink 목록과 오류 표시로 확인한 것이다. (확인됨)
> 이 목록은 「이름이 있는가」만 알려 준다. 실제로 쓰는 것은 쓰임이 `cl-judgments.md`나 아래 2·3절에 적힌 sink뿐이다.

## 1. 구성요소별 sink 목록

### ① 그래프 (Graph, 33종)
`number`, `numberList`, `pointLabel`, `bounds`, `trace`, `xmin`, `xmax`, `ymin`, `ymax`, `background`, `animationDuration`, `animationKeyboardStepValue`, `saveOnChange`, `resetAnimationOnChange`, `renderGraphBox`, `hasResponse`, `rawExpression`, `rawExpressionColor`, `rawExpressionHidden`, `rawExpressionStyle`, `expression`, `xAxisLabel`, `yAxisLabel`, `audioTraceReverseExpressions`, `narration`, `graphDescription`, `showResetButton`, `correct`, `warning`, `readOnly`, `hidden`, `function`, `resetOnChange`

### ② 그림판 (Sketch, 34종)
`previewCurrentStroke`, `initialTool`, `initialColor`, `availableColors`, `smartStrokeJoining`, `allowEraser`, `disableSketch`, `hideSketch`, `rawExpression`, `rawExpressionColor`, `rawExpressionHidden`, `rawExpressionStyle`, `xmin`, `xmax`, `ymin`, `ymax`, `number`, `numberList`, `expression`, `pointLabel`, `xAxisLabel`, `yAxisLabel`, `audioTraceReverseExpressions`, `trace`, `narration`, `bounds`, `graphDescription`, `background`, `correct`, `warning`, `readOnly`, `hidden`, `function`, `resetOnChange`

### ③ 표 (Table, 17종)
`cellContent`, `cellDisableEvaluation`, `cellSuffix`, `cellEditable`, `cellErrorMessage`, `initialCellContent`, `maxRows`, `disableRowChanges`, `submitButtonText`, `submitButtonDisabled`, `capture`, `hasResponse`, `correct`, `warning`, `readOnly`, `hidden`, `resetOnChange`

### ④ 수식 답변 (Math Input, 22종)
`initialLatex`, `placeholderLatex`, `disableEvaluation`, `errorMessage`, `suffix`, `capture`, `submitLabel`, `showSubmitButton`, `resetLabel`, `clearOnReset`, `submitDisabled`, `initialText`, `explainPrompt`, `showPeerResponses`, `showExplain`, `disableEdit`, `promptAriaLabel`, `correct`, `warning`, `readOnly`, `hidden`, `resetOnChange`

### ⑤ 행동 버튼 (Action Button, 8종)
`capture`, `label`, `resetLabel`, `disabled`, `style`, `resetStyle`, `hidden`, `resetOnChange`

### ⑥ 객관식 & 체크박스 (Multiple Choice & Checkbox, 각 22종)
`choiceContent`, `choiceLayerContent`, `choiceRichText`, `narration`, `initialText`, `prompt`, `showExplain`, `multiSelectHeading`, `maxSelectedChoices`, `initialSelection`, `explainPrompt`, `maxButtonsPerRow`, `submitLabel`, `resetLabel`, `showSubmitButton`, `disableChange`, `disableChoice`, `correct`, `warning`, `readOnly`, `hidden`, `resetOnChange`

### ⑦ 자유 답변 (Free Response, 15종)
`precedingRichText`, `initialText`, `initialRichText`, `placeholderText`, `showSubmitButton`, `submitDisabled`, `submitLabel`, `resetLabel`, `clearOnReset`, `passageHighlights`, `correct`, `warning`, `readOnly`, `hidden`, `resetOnChange`

### ⑧ 메모 (Note, 25종)
`content`, `richText`, `marksForLabel`, `maxSelectionCount`, `initialScrollPosition`, `initialHighlightColor`, `availableHighlightColors`, `disableHighlights`, `hideHighlights`, `maxHighlights`, `setScroll`, `inlineMathInitialLatex`, `inlineMathPlaceholderLatex`, `inlineMathErrorMessage`, `inlineMathDisableEdit`, `inlineDropdownDisableEdit`, `inlineDropdownChoiceContent`, `inlineTextPlaceholderContent`, `inlineTextInitialContent`, `inlineTextDisableEdit`, `hidden`, `correct`, `warning`, `readOnly`, `resetOnChange`

### ⑨ 정렬 리스트 & 미디어 (Ordered List 6종, Media 2종)
- **정렬 리스트**: `initialOrder`, `itemContent`, `correct`, `warning`, `readOnly`, `hidden`
- **미디어**: `time`, `hidden`

### ⑩ 화면 스크립트 전용 (Screen Script, 29종)
- **핵심 화면 제어**: `title`, `subtitle`, `coverText`, `coverButtonLabel`, `disableSketchEverywhere`, `disableCalculatorReason`, `nextNavigationLabel`, `preventNextNavigationReason`, `hideBackButton`, `hideNextButton`, `navigateAutomatically`, `annotationResetOnChange`, `playFeedback`, `nextNavigationTarget`

---

## 2. 챌린지 크리에이터(`challenge`) 전용 sink
학생이 문제를 내고 다른 학생이 푸는 챌린지 구성요소에만 있는 sink다. 이 구성요소는 편집기에서 「Class Gallery(교실 갤러리)」로 이름이 바뀌었다. 출제하는 학생이 창작 화면에서 문제를 만들어 제출하면 교실 갤러리에 카드(썸네일)로 올라가고, 다른 학생이 그 카드를 골라 응답 화면에서 푼다.

| sink | 쓰임 |
|---|---|
| `challengeText` | 교실 갤러리에서 학생이 만든 챌린지 카드(썸네일)에 보이는 글. 예: 입력칸의 `latex`를 넣는다 (확인됨) |
| `challengeBackground`, `challengeBounds` | 창작물 썸네일의 배경 이미지와 그 범위 (확인됨) |
| `responseText`, `responseBackground`, `responseBounds` | 응답 썸네일의 글, 배경 이미지, 그 범위 (확인됨) |
| `preventChallengeCreationReason` | 출제하는 학생이 만든 문제가 조건에 맞지 않으면 챌린지가 만들어지지 않게 막고 이 글을 이유로 보인다. 조건에 맞으면 빈 글을 넣는다. 예: 연립방정식 문제라면 두 식을 동시에 만족하는 해를 출제자가 입력해야 만들어지게 한다. 답을 모르는 출제자가 풀 수 없는 문제를 올리는 것을 막는다 (확인됨) |
| `preventSubmissionReason` | 응답하는 학생이 정해진 정답이나 조건을 만족하지 못하면 제출을 막고 이 글을 이유로 보인다. 조건에 맞으면 빈 글을 넣는다 (확인됨) |

## 3. 그 밖에 자주 쓰는 sink
동작과 쓰는 법은 `cl-judgments.md`에 구성요소별로 있다. 아래는 거기에 설명이 없는 것이다.

| sink | 구성요소 | 쓰임 |
|---|---|---|
| `pointLabel` | 그래프, 그림판 | 그래프 점 옆 라벨. 따옴표 안에는 점을 정의한 이름(`E=(a_2,5)`의 `E`)을 쓴다 |
| `xmin`, `xmax`, `ymin`, `ymax` | 그래프, 그림판 | 보기 범위의 한쪽 경계 |
| `choiceLayerContent` | 객관식, 체크박스 | 선택지에 덧붙이는 내용 |
| `suffix` | 수식 답변 | 입력칸 뒤 표시(✅/❌, 단위) |
| `showSubmitButton`, `submitDisabled`, `submitLabel` | 수식 답변, 자유 답변 | 제출 버튼을 보일지, 잠글지, 버튼 글자 |
| `clearOnReset` | 수식 답변, 자유 답변 | 다시 하기를 누르면 입력을 지운다 |
| `submitButtonText`, `maxRows` | 표 | 표 제출 버튼 글자, 학생이 늘릴 수 있는 행 수 상한 |
| `coverText`, `coverButtonLabel` | 화면 스크립트 | 화면을 덮는 안내·축하 창과 그 버튼 글자 |

- 편집기에 없는 이름: `buttonLabel`(실제는 `label`), `columnHeader`·`rowHeader`(없음), 수식 답변의 `prompt`(없음). `preventSubmissionReason`은 그래프가 아니라 챌린지 전용이다.
- 전체 화면 구성요소의 CL: 카드 정렬은 sink 없음, source `matchesKey`·`totalCards`·`totalCorrectCards`. Polygraph(폴리그래프)와 구슬 굴리기는 CL이 없다. 그래핑 계산기는 그래프와 같은 sink·source. Polypad(폴리패드, 일부 화면)는 sink `correct`, `customConfetti`, `hidden`, `initialState`, `initialViewport`, `interactivityVariable`, `narration`, `readOnly`, `resetOnChange`, `textVariable`, `visibilityVariable`, `warning`, source `isInitialState`, `polypadState`. (확인됨, 편집기 자동 완성)
- `audioTraceReverseExpressions`(그래프, 그림판): 시각장애 학생용 오디오 트레이스(키보드로 곡선을 소리로 따라가기)에서 식을 거꾸로 둘러보게 한다(`true`). 화면 모양은 바뀌지 않는다. (확인됨)
