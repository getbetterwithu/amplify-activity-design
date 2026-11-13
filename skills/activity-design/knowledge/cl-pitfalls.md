# CL·구성요소 함정과 미확인 사항

> 액티비티를 만들며 확인한 동작, 자료끼리 어긋나는 것, 아직 확인되지 않은 것을 모았다. 신뢰도 표시(확인됨·1회 관찰·미확인)를 따른다. 미확인은 화면 복사본에서 먼저 시험한다.

## 1. 제작 실측

### 1. CL 문법

#### CL에서는 사칙연산을 직접 쓰지 않는다 (확인됨: 곱셈·덧셈 / 미확인: 빼기·나누기)
- CL 식 안에서 `*`, `+` 같은 연산을 직접 쓰면 편집기에 오류가 표시된다. 예: `bounds: makeBounds(-0.05*m, 1.1*m, -0.08, 1.05)`, `btn.pressCount + 1`.
- 계산이 필요하면 문자열 수식으로 만들어 `numericValue`로 감싼다: `numericValue("-0.05*${m}")`, `numericValue("${btn.pressCount}+1")`.
- 숫자 리터럴의 단항 마이너스(`-0.08`)는 그대로 된다.

### 2. 구성요소

#### 정렬 리스트: `matchesKey`로 순서가 맞았는지 판정한다 (확인됨)
- 편집기에서 항목을 **정답 순서대로** 입력하면 그 순서가 정답이 되고, 학생 화면에서는 섞여 나온다.
- 다른 구성요소의 CL에서 `별칭.matchesKey`를 읽는다. 예: 메모 CL `say = when order.matchesKey "성공" otherwise "실패"`, 메모 내용에 `${say}`. 학생이 순서를 맞추면 「실패」가 「성공」으로 바뀐다.
- 정렬 리스트 자체에는 ✅/❌를 붙이는 sink(`suffix` 류)가 없다. 피드백은 메모, 화면 부제(`subtitle`), 다음 단계 열림(`hidden: not(order.matchesKey)`)으로 준다.

#### 카드 정렬: 화면에 다른 구성요소 없이 단독으로 둔다 (1회 관찰)
- 다른 구성요소와 함께 두면 카드가 겹친다.
- 학생 지시는 화면 부제(`subtitle`)에, 설명은 교사 팁에 둔다.
- 카드 정렬에는 CL sink가 없다. 판정은 화면 CL에서 `별칭.matchesKey`를 읽어 부제에 띄운다.

#### 객관식: 편집기에서 정답 표시를 해야 `matchesKey`·`correct`가 의미를 가진다 (확인됨)
- 정답 표시가 없으면 `matchesKey`는 늘 거짓이다.
- 정렬 리스트는 입력한 순서가 곧 정답이라 따로 표시할 필요가 없다.

#### 수식 답변: CL에 `prompt`를 쓰지 않는다 (확인됨)
- 수식 답변에는 `prompt` sink가 없어 편집기에 빨간 오류가 뜬다. 질문은 앞에 메모로 둔다.

### 3. 시험 방법

#### 자동화로 흉내 낸 끌기는 판정 근거로 쓰지 않는다 (확인됨)
- 학생 미리보기에서 스크립트로 마우스 끌기를 흉내 내면 화면 모양만 바뀌고 구성요소 상태(순서, 위치)가 바뀌지 않을 수 있다. 그 결과로 「동작하지 않는다」고 판정하지 않는다.
- 판정이 필요하면 사람이 직접 조작하거나, 저장값·CL 값으로 상태가 바뀌었는지 함께 확인한다.

## 2. 자료끼리 어긋나는 것 (단정하지 않음)

> 이 파일의 항목은 자료끼리 어긋나 있다. 실행 검증 전까지 **한쪽으로 단정하지 않는다.** 어느 쪽 설명인지 밝히고 교사에게 Amplify에서 확인할 지점으로 알려 준다. 단, 2번(differenceFunction 부호)은 판정으로 해소되어 판정 쪽으로 쓴다.

### 1. readOnly일 때 교사 대시보드에 보이는 모양

| 자료 | 내용 |
|---|---|
| 공식 문서(1등급, 영어) | `readOnly`는 컴포넌트를 화면의 정오 판정에서 무시하게 한다. 화면의 **모든** 컴포넌트가 readOnly `true`이면 대시보드 요약에서 그 화면에 **대시(-)** 가 표시된다. |
| 판정 | `readOnly: true`는 학생의 입력·선택·제출·조작을 막지 않는다. 대시보드 정오답 채점에서만 제외된다. (판정 확정 — 이 부분은 단정해도 된다.) |

- 충돌 지점: 대시보드에 **어떤 모양**이 표시되는지(대시 / 점 / 그 밖). 판정 확정에는 표시 모양이 없다.

### 2. differenceFunction의 부호 (공식 문서 안의 충돌 → 판정으로 해소)

`parseEquation(...).differenceFunction("x","y")` (type:equation)

| 위치 | 내용 |
|---|---|
| 설명 | "simpleFunction representing for **(lhs) - (rhs)** of an equation. Useful for setting equal to zero to test or plot" |
| 예시 주석 | "Difference function takes the lhs of the equation and **subtracts it from the rhs**." 예: `3x+5 = y-2 -> (y-2)-(3x+5)` (즉 **rhs − lhs**) |

- 설명은 lhs−rhs, 예시는 rhs−lhs로 서로 반대다.
- **판정**: `differenceFunction`은 좌변에서 우변을 뺀 함수(**lhs − rhs**)다. `parseEquation`이 먼저 등호를 기준으로 좌변(lhs)과 우변(rhs)을 나눈다. 공식 문서의 **설명** 쪽과 같고, 예시 주석이 반대로 적혀 있는 것이다.
- 참고: `parseInequality(...).differenceFunction`은 설명과 예시가 모두 "(greater side) − (lesser side)"라서 이 충돌이 없다.

### 3. timeSinceSubmit의 시간 단위 (지식 파일 안의 불일치)

- 공식 문서는 `timeSinceSubmit`과 `timeSincePress` 모두 "Gets the **seconds** (plus milliseconds) since ..."라고 쓴다. 단위는 **초**다.

### 4. 공식 문서 안의 오기 (참고)

- 수식 답변(expression input)의 `timeSinceSubmit` 설명은 "Increase that time by passing a parameter, as in **timeSincePress(20)**"라고 끝난다. `timeSinceSubmit` 항목인데 예시가 `timeSincePress(20)`로 적혀 있다. 원문의 오기로 보이며, 이 자료만으로는 판단할 수 없다.

## 3. 확인되지 않은 것

> 이 파일의 항목은 확정 지식이 아니다. 확인되면 해당 지식 파일 항목으로 옮기고, 이 파일에서는 지운다(지운 기록은 VERSION.md에 남긴다). 이 파일의 내용을 판정이나 확정 문장으로 쓰지 않는다.

### 1. 확인되지 않은 함수 (B-3)

> 주의: 아래 표는 **CL 스크립트 함수**로 쓰였을 때 공식 CL 문서에서 확인되지 않았다는 뜻이다. 반면 **Desmos 그래프 수식(`input/graph`)이나 `simpleFunction`·`numericValue`의 LaTeX 수식 안**에서 쓰인 `total`, `mod`, `median`, `quantile`은 Amplify 실측으로 확인되어 `desmos-functions.md`에 수록되어 있다.

| 이름 | 쓰인 곳 (2차 검증) | 현재 상태 |
|---|---|---|
| `total()` | 26, 27번 | CL 함수로는 공식 index에서 찾지 못함 (단, Desmos 그래프 수식 함수로는 `desmos-functions.md`에서 실측 확인됨) |
| `randomGenerator`, `r.int` | 43번 | 스킬 자료에서 찾지 못함. 공식 index 재검색 필요 |
| `mod` | 39, 43번 | CL 함수로는 공식 index에서 찾지 못함 (단, Desmos 그래프 수식 함수 `\operatorname{mod}(a,b)`로는 실측 확인됨) |
| `median`, `quantile` | 43번 | CL 함수로는 공식 index에서 찾지 못함 (단, Desmos 그래프 수식 함수로는 `desmos-functions.md`에서 실측 확인됨) |
| `matches` (패턴 메서드) | 예제 20 (C-adv 관련 항목) | 공식 index에는 함수로 없고, 설명 주석 한 곳만 있다 |
| `patterns`, `fraction` 등 패턴 빌더 | 예제 20 | 공식 index에서 찾지 못함 |

### 2. `#` 주석 규칙 (B-1)

- 관찰: 31·32번 원문에서 줄 머리가 `#`인 줄을 두 해석이 모두 주석(비활성)으로 읽었다.
- 상태: 스킬 자료에서 규칙을 찾지 못했다.
- 확인 방법:
  1. 공식 CL 문서에서 "comment", "#"을 검색한다.
  2. 없으면 최소 화면을 만든다. 조건이 참인 `#` 줄 하나와 같은 내용의 `#` 없는 줄을 두고, 그 sink가 적용되는지 미리보기로 본다.

### 3. 표 빈 칸 비교 (B-2)

- 관찰: `disable = not(laser = laser)`처럼 칸이 비었을 때의 비교 결과를 스킬 자료에서 찾지 못했다 (36·38번). 묶음 1에서 두 해석이 모두 "자료에서 찾지 못함"으로 답했고, 이것이 맞는 답이다.
- 확인 방법: 표 칸 하나를 비운 최소 화면을 만들고, 그 값을 `disabled`에 연결한 버튼이 회색이 되는지 본다. 결과가 나오면 초안을 만들고 실측 후에 확정한다. 초안이 나오기 전에는 지식 파일에 넣지 않는다.

### 4. 패턴 도구 초안 (D-patterns-01, 공식 대조 미완)

- 상태: 확정 아님. 공식 문서 대조가 되지 않은 초안이다.
- 출처 한계: 초안의 출처는 Desmos 커뮤니티 게시판 두 건이다 (`https://cl.desmos.com/t/checking-fractions/2987`, `https://cl.desmos.com/t/pattern-matching-for-checking-correctness/7837`). 비공식 자료이므로 근거로 쓰지 않는다. 확인 대상으로만 둔다.
- 초안 내용:
  - `p = patterns`로 패턴 도구를 얻는다. 패턴은 입력값이 아니라 LaTeX의 모양을 검사한다.
  - 패턴 빌더: `p.number`, `p.integer`, `p.fraction(분자 패턴, 분모 패턴)`, `p.mixedNumber`, `p.product`, `p.exponent`, `p.literal`, `p.contains`, `p.anyOf`.
  - 부분에 조건을 걸 수 있다. 예: `p.fraction(p.integer.satisfies(`x=3`), p.integer.satisfies(`x=5`))`는 분자 3, 분모 5인 분수 모양.
  - `패턴.matches(LaTeX)`: 입력 LaTeX가 모양에 맞으면 참, 아니면 거짓.
  - `패턴.parse(LaTeX)`: 분자와 분모를 꺼낸다. 부분마다 `.latex`와 `.numericValue` 중 무엇을 원하는지 지정해야 한다.
  - 모양 검사는 값이 같아도 형태가 다르면 다르게 판정한다 (`3/4`, `0.75`, `6/8`).
- 확인 방법:
  1. 공식 index에서 `matches`, `patterns`, `fraction`을 검색한다.
  2. 공식 문서에 없으면 이 초안은 위 1번 표에만 둔다.
  3. 공식 문서에 있으면 공식 문장을 근거로 해당 지식 파일에 옮긴다.
- 영향: 예제 20 해석에서 `fr.matches`를 쓴 부분은 "자료에서 찾지 못함"이 맞는 답이다. 이 초안이 확정되면 예제 20 해석을 다시 본다.

### 5. 확인 순서 요약

공식 문서 검색 → 최소 화면 실측 → 확정(지식 파일 이동). 실측 결과에는 확인 날짜와 화면 조건을 함께 적는다.

## 4. 가설

> **이 파일의 내용은 확정이 아닙니다.** 답에 쓸 때는 "예상"이라고 밝히고 단정하지 않습니다. 실행 검증 전입니다.

### A-sketch-26 — 예상

- 화면 제목: Sketch.audioTraceReverseExpressions [sink]
- 코드: 그림판(sketch) 컴포넌트에 `audioTraceReverseExpressions: true`
- 예상(판정): `audioTraceReverseExpressions: true`는 그림판 배경 그래프의 오디오 트레이스에서 수식 탐색 순서를 역순으로 재생하는 설정으로 기록한다.
- 실행검증: **필요.** 화면에서는 변화가 없을 것으로 보이며 오디오 트레이스(접근성 기능)를 실행해 확인해야 한다.
- 비어 있음: 오디오 트레이스가 수식을 어떤 순서로 읽는지의 기본 순서, 역순이 적용되는 범위.

답할 때 쓰는 말: "판정에서는 배경 그래프의 오디오 트레이스 수식 순서를 거꾸로 재생하는 설정으로 **예상**하고 있으나, 아직 실행으로 확인되지 않았습니다."

## 5. 아직 풀지 못한 과제

> **목적**: 270개 커뮤니티 액티비티 전수조사 및 라이브 에디터 린터(CodeMirror) 덤프 과정에서 명백히 플랫폼 공인 예약어로 포착되었으나, 실전 사용례 부족 또는 세부 작동 스펙이 아직 완전히 규명되지 않은 심화 미제 항목들을 격리 보관합니다.
> 향후 추가 연구, 교사 커뮤니티 스터디, 또는 실제 테스트를 통해 단계별로 해결(Resolved) 처리합니다.

---

### 1. 6대 핵심 미해결 연구 과제

#### 과제 1. `WOTS` 싱크의 정체 및 작동 스펙
- **포착 위치**: 자유 답변(Free Response), 수식 답변, 객관식, 체크박스 등 학생 답변 컴포넌트 전반의 공인 싱크 목록
- **핵심 의문**:
  - `WOTS`라는 약어의 본래 의미 (*What Others Thought Screen*? *Word Of The Screen*?)
  - 우변에 요구하는 데이터 타입 (불리언 플래그 `true/false`, 특정 문자열, 아니면 컴포넌트 참조?)
  - 교실 화면에서 학생들에게 다른 학생들의 답변을 보여주는 동적 오버레이 기능인지 검증 필요

---

#### 과제 2. `export...Artifact` 계열 전역 상태/내보내기 싱크군 (10여 종)
- **포착 위치**: 그래프, 표, 메모, 그림판, 미디어 등 거의 모든 11개 컴포넌트
- **확인된 싱크 목록**:
  - `exportNumberArtifact`, `exportStringArtifact`, `exportNumberListArtifact`
  - `exportStringListArtifact`, `exportRichTextArtifact`, `exportRichTextListArtifact`
  - `exportLatexArtifact`, `exportLatexListArtifact`
  - `exportSketchArtifact`, `exportSketchListArtifact`
  - `exportPolypadArtifact`
- **핵심 의문**:
  - 화면과 화면 사이(Screen-to-Screen)로 이전 화면의 그림이나 수식을 넘기는 전역 상태(Global State) 엔진인지?
  - 교사용 대시보드 포트폴리오 산출물로 내보내는 기능인지?
  - 우변에 바인딩하는 문법 형식(문자열 키-값 바인딩? 함수 호출?) 규명 필요

---

#### 과제 3. `parseEquation` 외 고등 수학 파서 객체군
- **확인된 팩트**:
  - `parseEquation(str).differenceFunction("x", "y")`: 방정식 $f(x, y) = 0$ 꼴의 음함수 차이 함수 변환
  - `isBlank(str)`: 수식 입력창 공란 여부 불리언 체크
- **핵심 의문**:
  - 부등식을 파싱하는 함수(예: `parseInequality`?), 일반 다항식 파서(`parsePolynomial`?) 등 다른 수학 파서 빌트인 객체의 존재 여부
  - `parseEquation`이 지원하는 연산자 및 유효 방정식 형태의 한계 범위

---

#### 과제 4. `Card Sort`(카드 정렬) 컴포넌트의 CL 연동 인터페이스
- **핵심 의문**:
  - 교사들이 카드 짝 맞추기 활동을 만들 때, 학생이 카드를 정답 그룹대로 올바르게 묶었는지(`correct`) 판정하는 전용 소스 목록
  - 예: `this.matchesKey`, `this.totalUnsorted`, `this.groupCount` 등 카드 정렬 전용 소스명 전수 규명 필요

---

#### 과제 5. `Polygraph`(폴리그래프) 20고개 컴포넌트의 CL 연동 인터페이스
- **확인된 팩트**:
  - `choiceLayerContent(1): polygraphComponent.cardAtIndex(1)` (카드 인덱스 추출)
- **핵심 의문**:
  - 2인 1조 게임 중 학생이 주고받은 질문 텍스트, 탈락시킨 카드 목록, 게임 승패 상태를 CL 스크립트로 직접 제어할 수 있는 싱크/소스의 존재 여부

---

#### 과제 6. `Polypad`(가상 교구) 컴포넌트의 CL 연결 통로
- **확인된 팩트**:
  - `exportPolypadArtifact`: Polypad 상태를 아티팩트로 내보내는 싱크 존재 확인
- **핵심 의문**:
  - 가상 교구(분수 막대, 대수 타일, 주사위 등) 위젯 내부의 타일 개수나 배치 상태를 CL에서 읽어오는 소스(`polypad.tileCount`, `polypad.fractionValue` 등)의 존재 여부 및 명칭

---

### 2. 해결 절차 및 추적 규칙

1. 현장 액티비티 제작 중 새로운 단서가 발견되면 해당 과제 섹션에 즉시 [해결(Resolved)] 표시와 함께 실전 코드 스니펫을 추가합니다.
2. 확실하게 검증되기 전까지는 지식 파일에 섣불리 단정하여 싣지 않고 본 미해결 대장에서 엄격히 격리 관리합니다.

## 6. 실행 검증을 기다리는 문법

> **원칙**:
> 1. 스킬 지식(`cl-judgments.md`, `desmos-functions.md`) 및 공식 CL 문서를 전수 검색하여 매칭되지 않거나 설명이 부실한 항목은 **임의로 단정하거나 추측하지 않는다.**
> 2. 코드 문맥에서 파악된 **"예상 작동 원리와 가설"**을 명확히 메모하여 격리 보관한다.
> 3. 향후 Amplify Classroom에서 실제 액티비티 화면을 직접 제작하여 눈으로 확인하는 **"실행 검증(Amplify Test Harness)"**을 거친 뒤에만 정식 지식으로 편입한다.

---

### 1. 미등재 / 신규 발굴 항목 (스킬 지식 부재 확인 5종)

#### 1. `patterns.literal(string)`
* **스킬/공식 대조 결과**: `patterns` 객체와 `sum`, `difference`는 부분적으로 언급되나, `literal()` 메서드는 스킬 지식 본문에 정의 없음.
* **예상 작동 원리**:
  * 인자로 전달된 문자열(`"x"`)을 수식 파서에서 변수가 아닌 **고정된 리터럴 기호(상수 토큰)**로 취급하는 패턴 매칭 헬퍼로 추정.
* **실행 검증 계획 (Test Spec)**:
  * Amplify 편집기에서 `patterns.literal("y")`를 생성하고, 학생 입력창에 `y + 3`과 `x + 3`을 각각 넣었을 때 `matches()`의 반환값이 true/false로 정확히 분기하는지 확인.

---

#### 2. `pipes`
* **스킬/공식 대조 결과**: 스킬 및 공식 문서에 완전히 부재.
* **예상 작동 원리**:
  * Desmos 그래핑 계산기 내부에서 선분 리스트 또는 절대값 기호(`|...|`) 파싱 시 생성된 변수명이거나, 배관 연결 전용 사용자 정의 리스트로 추정. (내장 함수인지 사용자 변수인지 판별 필요).
* **실행 검증 계획**:
  * 계산기 수식 목록에서 `pipes`가 단독 예약어로 에러 없이 호출되는지, 아니면 사용자 정의 변수 `pipes=[...]`인지 편집기에서 직접 입력 테스트.

---

#### 3. `map` (리스트 매핑 고차 함수)
* **스킬/공식 대조 결과**: Desmos 계산기에서는 리스트 내포식(`[f(x) for x=[1...5]]`)이 표준이나, CL 스크립트 레벨에서 `map()` 함수가 지원되는지는 스킬 지식에 미등재.
* **예상 작동 원리**:
  * 배열(List)의 각 원소에 람다나 함수를 적용하여 새 리스트를 반환하는 함수로 추정.
* **실행 검증 계획**:
  * CL 스크립트에서 `L = map([1, 2, 3], ...)` 형태가 컴파일 오류 없이 허용되는지 확인.

---

#### 4. `highest` / `lowest` (순위 정렬 헬퍼)
* **스킬/공식 대조 결과**: `max()`, `min()`은 공식 등재되어 있으나, `highest()`, `lowest()`는 CL 키워드로 등재되어 있지 않음.
* **예상 작동 원리**:
  * `aggregate()`로 취합된 리스트 $S$에서 상위 $k$개 또는 하위 $k$개 값을 추출하는 함수이거나, 개발 교사가 주석/변수로 표기한 헬퍼일 가능성.
* **실행 검증 계획**:
  * CL에서 `highest(L)` 호출 시 문법 에러(`Undefined function`)가 나는지, 아니면 Desmos 계산기 내부의 통계 함수(`sort`, `max`)와 연동된 것인지 실측.

---

### 2. 공식 인덱스에는 있으나 본문 설명이 부실했던 '집중 검증' 항목 (5종)

| 항목명 | 발견된 액티비티 | 실전 용법 | 향후 실행 검증 포인트 |
|---|---|---|---|
| **`countNumberUsage`** | Four 4s | `countNumberUsage(this.latex, 4)` | 수식 내 4가 분수(`4/4`), 지수(`4^4`), 음수(`-4`)로 쓰였을 때 카운트 정확도 |
| **`parseOrderedPair`** | Tetris | `pt = parseOrderedPair(cellContent)` | 공백이 있거나 음수 좌표일 때 `pt.x`, `pt.y` 파싱 안전성 |
| **`xyLine`** | Tetris | `line = xyLine(cellContent)` | `line.isVertical`이 $x = 3$일 때 정확히 true를 반환하는지 |
| **`makeBounds`** | Tetris, Connect4 | `bounds: makeBounds(xm, xM, ym, yM)` | 화면비 왜곡 없이 자동 패딩이 적용되는지 |
| **`firstDefinedValue`** | Four 4s, Tetris | `firstDefinedValue(a, b, c)` | 인자 중 1개만 정의되었을 때 폴백 우선순위 |

---

### 3. 관리 방침

위 항목들은 **추가 실행 검증(Amplify 화면 제작 실측)**을 통과하기 전까지는 절대로 "확정된 공식 문법"으로 승격시키지 않으며, **`[추가검증필요]` 태그를 달아 별도 격리 상태를 유지**합니다.
