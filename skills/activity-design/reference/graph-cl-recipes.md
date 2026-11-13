# 그래프 표현과 CL 판정 레시피

직접 쓰고 저장값·학생 미리보기로 확인한 패턴이다. 모든 예시는 직접 만든 것이다. 식은 그래프 편집 창의 Desmos 계산기에 넣는다(`editor-ops.md` 8절). 확인 정도를 항목 끝에 적었다.

## 1. 표 칸 판정과 ✅/❌ 표시 (확인됨)
```
v1 = this.cellNumericValue(1,1)
ok1 = v1 > 0.2999 and v1 < 0.3001
cellSuffix(1,1): when isBlank(this.cellContent(1,1)) "" when ok1 " ✅" otherwise " ❌"
allOK = when ok1 and ok2 1 otherwise 0
correct: allOK = 1
```
- 값 범위로 비교하면 분수·소수(30/100, 3/10, 0.3)가 모두 정답이 된다.
- 행·열 번호는 머리글 행을 빼고 센다. 첫 열을 「텍스트로 구성」한 표라면 입력 칸은 2열부터다.

## 2. 수식 답변 판정과 ✅/❌ (확인됨)
```
v = this.numericValue
ok = v > 0.9999 and v < 1.0001
okN = when ok 1 otherwise 0
correct: ok
suffix: when isBlank(this.latex) "" when ok " ✅" otherwise " ❌"
```
- 식이 답인 칸은 변수에 값을 넣어 비교한다. 이렇게 하면 `1-p`와 `-p+1`이 모두 정답이다.
```
f = simpleFunction(this.latex, "p")
a1 = f.evaluateAt(0.3)
a2 = f.evaluateAt(0.9)
ok = a1 > 0.6999 and a1 < 0.7001 and a2 > 0.0999 and a2 < 0.1001
```
- **방정식 칸(축의 방정식 등)과 좌표 칸 판정(1회 관찰):**
```
f = parseEquation(this.cellContent(1,2)).differenceFunction("x","y")
ax = f.evaluateAt(0,0) = 0 and f.evaluateAt(0,7) = 0 and not(f.evaluateAt(1,0) = 0)     # x=0
p = parseOrderedPair(this.cellContent(1,3))
vx = numericValue(p.x) = 0 and numericValue(p.y) = -3                                  # (0,-3)
```
  - `parseOrderedPair(...).x`는 latex라 `numericValue()`로 감싸야 한다. 감싸지 않으면 「Objects of different types are never equal」 오류.
  - 학생이 쓴 식(`y=…`)을 그래프에 그리려면 그래프 CL에 `function("g"): parseEquation(eq.latex).differenceFunction("x","y")`, 그래프 식은 `0=g(x,y)`(`editor-ops.md` 8절). `initialLatex: "y="`를 쓰면 `suffix`에서 `this.latex = "y="`일 때 빈칸으로 처리한다.
- 자리 표시(`placeholderLatex`)에 답을 쓰지 않는다.

## 3. 단계 열기 (확인됨)
- 앞 칸이 맞아야 다음 메모·입력이 보이게 한다. 참·거짓을 숫자로 바꿔 내보내면 연결이 안정적이다.
```
# 앞 구성요소(sumIn)의 스크립트
okN = when ok 1 otherwise 0
# 다음 구성요소
hidden: not(sumIn.script.okN = 1)
```
- 객관식은 `hidden: not(pickMC.matchesKey)`. 편집기에서 정답을 표시해야 `matchesKey`가 의미를 갖는다.
- 표 전체는 `hidden: not(tbl.script.allOK = 1)`.

## 4. 체크박스·버튼 선택을 그래프로 보내기 (확인됨)
```
# 그래프 구성요소의 스크립트
number("k_1"): when pickFlav.isSelected(1) 1 otherwise 0
```
- 그래프에는 같은 이름의 숨김 변수 `k_{1}=0`을 미리 둔다. 그래프 안에서 `n_k = total([k_1,…])`로 고른 개수, `s = total(K·C)`로 고른 대상의 수를 계산한다.
- 고른 대상만 진하게 보이게 하려면 점 투명도에 변수를 쓴다: `pointOpacity: "o_1"`, `o_1 = {n_k=0:1, k_1=1:1, 0.18}`.

## 4-1. 학생이 고른 답을 다음 지시에 인용하기 (확인됨)
```
# 메모 구성요소의 스크립트 (메모 본문은 비워 둔다)
hidden: not(oppMC.isSelected(1))
insert = oppMC.choiceContent(1)
content = "위 '${insert}'에 해당하는 경우를 모두 표시하고 표를 채우시오."
```
- 학생이 고른 문장을 그대로 다음 지시에 넣어 단계를 잇는다. 같은 조건(`isSelected`)으로 학생이 표시할 그림판도 함께 보이게 하면 버튼 없이 도구가 나타난다.

## 5. 행동 버튼 (확인됨)
- 힌트: 버튼 CL `label: "힌트 보기"`, 힌트 메모 CL `hidden: hintBtn.pressCount = 0`. 정답을 맞힌 뒤 버튼을 숨기려면 `hidden: ans.script.okN = 1`.
- 다시보기 잠금: `disabled: 그래프.number("q") < 3`처럼 조건이 참인 동안 버튼이 눌리지 않는다.
- 버튼의 `pressCount`를 그래프 `number("r")`로 보내 재생 트리거로 쓸 수 있다.

## 6. 카드 정렬 결과로 부제 띄우기 (1회 관찰)
- 카드 정렬에는 CL sink가 없다. 화면 스크립트에서 `sortX.matchesKey`를 읽어 `subtitle`에 연결한다.

## 7. 조건부로 보이는 그래프 식 (확인됨)
- 식 끝에 `\{g_{v}=1\}`을 붙이고, 숨김 변수 `g_{v}=0`을 둔다. 구성요소 CL에서 `number("g_v"): 다른.script.okN`으로 값을 넣는다.
- 단계마다 다른 라벨을 보이려면 조건을 겹친다: `(0.65,-0.31)\{g_{v}=1\}\{m_{v}=0\}`, `(0.65,-0.31)\{m_{v}=1\}`.

## 8. 학생이 만든 값을 기록해 쌓기 (확인됨)
- 숨김 티커(`handlerLatex: A_{rec}`, `minStepLatex: 50`, 「학생에게 이 티커 숨기기」)와 조건부 동작을 쓴다.
```
H = [-1]                       (빈 목록 대신 -1로 시작)
H_v = H[H ≥ 0]
q = {n_k > 0: {total({H = s: 1, 0}) = 0: 1, 0}, 0}
A_rec = {q = 1: H → join(H, s)}
```
- 저장 전에 `H=[-1]`로 되돌린다. 판정식은 숨김 폴더에 둔다.

## 9. 점에서 점선으로 이은 라벨·상자 (확인됨)
- 점 `(x,0)`, 점선 `x=x_0\{-0.12≤y≤0\}`(`lineStyle: DASHED`), 상자 `polygon(…)`, 라벨 점은 상자 가운데(`labelOrientation: center`)에 둔다.
- 끝에서 상자가 그래프 밖으로 나가지 않게 상자 중심을 제한한다: `x_b = min(max(x_0, 0.03), 0.97)`.
- 두 대상의 라벨이 겹치면 높이를 엇갈리게 하고, 위아래로 나눈다(예: 한 상황은 수직선 위, 다른 상황은 아래).

## 10. 선분을 꺾쇠로 묶어 이름 붙이기 (확인됨)
- 꺾쇠는 점 목록을 선으로 잇는다: `([0,0,0.3,0.3], \{g_v=1:[-0.03,-0.07,-0.07,-0.03]\})`, `lines: true`, `points: false`. 가운데 짧은 세로선을 라벨까지 내린다.

## 11. 수직선 눈금 숫자를 크게 (확인됨)
- `updateSettings({xAxisNumbers: false})`로 기본 숫자를 끄고, `(0,0)`, `(0.5,0)`, `(1,0)` 점에 라벨(`labelSize` 1.5~1.8)을 단다. 숫자가 커지면 다른 라벨의 높이도 함께 조정한다.
- 숫자가 점선과 겹치면 숫자를 점선 옆(`below_right`)으로 옮긴다.

## 12. 두 점으로 구간 칠하기 (확인됨)
- 판정은 `L_o = min(L,R)`, `R_o = max(L,R)`로 해서 두 점의 좌우가 바뀌어도 되게 한다.
```
n_in = total({L_o ≤ P ≤ R_o: 1, 0})
c = {n_in = n_all: {|R_o - L_o - (max(P) - min(P))| < 0.001: 1, 0}, 0}
h = {n_in = n_all: {L_o < min(P): 1, R_o > max(P): 1, 0}, 0}       (더 넓은 구간)
m_v = {L = 시작값: {R = 시작값: 0, 1}, 1}                           (움직였는지)
```
- 화면 부제는 c(정답), h(더 짧은 구간 안내), 움직였는데 빠진 점이 있으면(m_v=1이고 n_in < n_all) 「아직 포함되지 않은 사건」 안내로 나눈다.

## 13. 표·격자 그림 (확인됨)
- 격자선을 `x=[목록]\{범위\}`로 그리면 학생 화면에서 교차점에 점이 보인다. 칸 다각형 목록으로 그린다: `polygon((X-0.5,Y-0.5),(X+0.5,Y-0.5),(X+0.5,Y+0.5),(X-0.5,Y+0.5))`, `fillOpacity 0`.
- 칸 안 숫자는 칸마다 라벨 점을 둔다(숨긴 점 + `labelOrientation: center`).
- 학생이 그 위에 필기해야 하면 그림판으로 변환한다(`editor-ops.md` 8-1).

## 14. 끌 수 있는 막대·점과 범위 (확인됨)
- 점 `(a+1, 2)`에 `dragMode: X`를 주면 끌어서 `a`가 바뀐다. 범위와 간격은 슬라이더 `{hardMin, hardMax, min, max, step}`으로 정한다. 이 값은 `setState`로 넣어야 저장된다(`editor-ops.md` 8절).

## 15. 색 변수 (확인됨)
- `c_A = rgb(96,66,166)`처럼 색 변수를 「팔레트」 폴더에 두고, 식의 색을 그 변수로 지정한다(`colorLatex`). 변수 한 줄만 바꾸면 그 색을 쓰는 식이 모두 바뀐다. `hsv(h,…)`처럼 숫자 변수로 색을 만들 수도 있다. 프리셋은 `color-presets.md`.
- CL `number()`로 색을 만드는 숫자 변수를 바꾸는 방법은 확인하지 못했다. (미확인)

## 16. 끌기 화면의 피드백 (확인 버튼 판정은 1회 관찰)
- **피드백은 그래프 안의 `pointLabel`로 학생이 끄는 점 옆에 준다.** 다른 구성요소에 돌려 쓰지 않는다. 학생이 보고 있는 점 바로 옆에 나와서 가장 잘 보인다.
- 표 칸처럼 ✅/❌만 붙이지 않는다. 그 조작의 목적이 이루어졌다는 것을 상황의 말로 쓴다. 예: 「빨간 차가 먼저 도착했습니다」. 탐색하는 화면이면 판정 대신 지금 상태를 알려 준다. 예: 「빨간 차가 2분 늦게 도착합니다」. 정답 위치를 알려 주는 문장은 쓰지 않는다(`design-rules.md` 2-2절).
- 따옴표 안 이름은 그래프의 점 이름(라벨)과 같아야 한다(`geometry-recipes.md`의 교점 라벨과 같은 방식). 점의 라벨 표시를 켜 둔다.
```
ok = (판정 식)
pointLabel("P"): when ok "빨간 차가 먼저 도착했습니다" otherwise ""
```
- **얻어걸리기를 막는다.** 끄는 동안 판정이 실시간으로 바뀌면 학생이 생각 없이 움직이다 맞는 자리에서 멈춘다. 정답을 판정하는 화면은 행동 버튼(「확인하기」)을 눌렀을 때 `capture`로 점 위치를 기록하고 그 값으로 판정한다. 확인한 뒤 점을 다시 움직이면 「위치가 바뀌었습니다. 다시 확인해 보세요」로 바꾼다. 정답이 하나뿐인 화면은 버튼 `disabled`로 시도 횟수를 제한할 수 있다(상황 만들기처럼 답이 여럿인 화면에는 제한하지 않는다). 맞힌 뒤에는 이유 쓰기 칸을 연다. 확인 횟수를 `exportNumber`로 내보내면 교사가 마구잡이 조작을 볼 수 있다.
- **확인 버튼 판정(1회 관찰, 학생 미리보기 실제 마우스):**
```
# 버튼(chk)의 스크립트
label: "확인하기"
capture("a1"): g.number("a_1")        (점마다 한 줄)
# 그래프(g)의 스크립트
number("n_p"): chk.pressCount
number("k_1"): chk.lastValue("a1")    (점마다 한 줄)
# 그래프 안
K = [k_1, …], A = [a_1, …], T = [정답, …]
c_k = {n_p>0: {total(|K−T|)=0: 1, 0}, 0}          (판정)
m_v = {n_p>0: {total(|K−A|)>0: 1, 0}, 0}          (확인 뒤 움직였는가)
o = {c_k=1: {m_v=0: 1, 0}, 0}                     (다음 단계 열기에 씀)
```
  - 그래프의 `k_N` 기본값은 `\frac{0}{0}`(정의되지 않음)으로 둔다. 버튼을 누르기 전 `lastValue`가 무엇을 돌려주는지는 확인하지 못해 `n_p>0` 조건으로 막는다.
  - 라벨 문장: 틀림 「아직 맞지 않는 점이 있습니다」(어느 점인지 알려 주지 않음), 확인 뒤 이동 「위치가 바뀌었습니다. 다시 확인해 보세요」, 정답은 상황의 말로.
