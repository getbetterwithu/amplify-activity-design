# Desmos 그래프로 이런 기능 만들기

> 「이런 화면을 만들고 싶은데 어떤 식을 쓰나」에 답하는 짧은 조리법이다. 그래프 편집 화면은 Desmos 계산기라서 식은 Desmos 계산기와 똑같이 동작한다. 함수의 뜻과 **Amplify 그래프에서 지켜야 할 제약**(그래프 변수 이름은 한 글자 + 중괄호 첨자, `\operatorname{for}`, 차트 함수는 변수에 넣지 않기 등)은 `desmos-functions.md` 1절에 있고, 아래 예시는 그 제약을 지켜 썼다.
> 그래프는 수식만 늘어놓은 정지 화면으로 두지 않는다. 끌 수 있는 점, 표 입력, 행동 버튼처럼 학생이 조작할 것을 넣어 그래프가 반응하게 한다. 그래프를 쓸지는 화면 설계에서 정한다. 분류·순서·오개념 진단은 카드 정렬·정렬 리스트·객관식이 더 맞을 수 있다.

## 목차
1. 반 응답 모으기, 중복 없애기, 거르기
2. 정렬과 1등 찾기
3. 거리·중점·다각형
4. 정답에 따라 색 바꾸기
5. 반올림해서 채점하기
5-1. 방정식의 근을 회귀로 찾기
6. 버튼을 누를 때마다 새 난수
7. 곡선 위를 움직이는 점과 접선
8. 점 여러 개를 한 식으로, 조별 대표값

## 1. 반 응답 모으기, 중복 없애기, 거르기
- 그래프에 받을 리스트를 먼저 빈 리스트로 정의해 둔다: `L=[]`. CL이 값이 들어오는 대로 채운다.
- CL: `numberList("L"): table.columnNumericValues(1)`(표 한 열) 또는 `numberList("L"): aggregate(exp1.numericValue)`(반 전체, `reference/recipe-aggregate.md`).
- 아직 아무도 내지 않아 `L`이 비어 있어도 `x=\operatorname{mean}(L)`(평균선)이나 `\operatorname{dotplot}(L)`은 오류 없이 아무것도 그리지 않는다. 평균에 `\operatorname{join}(L,0)`을 쓰면 0이 값으로 섞이므로 쓰지 않는다.
- 그래프: 중복 없애기 `U=\operatorname{unique}(L)`, 양수만 `P=L[L>0]`, 0 이상 20 이하 `R=L[L\ge0][L\le20]`(조건 둘은 대괄호를 이어 쓴다).
- 대표값: `\operatorname{mean}(L)`, `\operatorname{median}(L)`, `\operatorname{total}(L)`, `\operatorname{length}(L)`.

## 2. 정렬과 1등 찾기
- 점수 `S` 순서로 번호 `N`을 늘어놓기: `R=\operatorname{sort}(N, S)`. 예: `N=[1,2,3,4]`, `S=[85,95,70,90]`이면 `[3,1,4,2]`.
- 최댓값의 위치: `i_{max}=\operatorname{sort}([1...\operatorname{length}(L)], L)[\operatorname{length}(L)]`. CL에서는 `graph.number("L[i_{max}]")`로 바로 읽거나, 보조 변수 `v_{max}=L[i_{max}]`를 만들어 읽는다.
- 위에서 3개: `T=\operatorname{sort}(L)`, `T[\operatorname{length}(T)-2...\operatorname{length}(T)]`.

## 3. 거리·중점·다각형
- 좌표 꺼내기: `P.x`, `P.y`. 점 리스트 `Q`이면 `Q.x`가 x좌표 리스트.
- `\operatorname{distance}(A, B)`, `\operatorname{midpoint}(A, B)`, 점 덧셈 `A+B`.
- 다각형: `\operatorname{polygon}(A, B, C)` 또는 `\operatorname{polygon}(Q)`. 끌 수 있는 점과 이으면 넓이가 바로 바뀐다.
- 도형 여러 개를 한 식으로: 점 사이에 `([][1],0)`을 넣으면 거기서 끊긴다.

## 4. 정답에 따라 색 바꾸기
- 그래프 변수 `c_{s}`(1 정답, 0 오답, 그 밖은 미입력)를 CL에서 넣거나 그래프 안에서 계산한다.
- `r_{c}=\{c_{s}=1:34, c_{s}=0:220, 150\}`, `g_{c}=\{c_{s}=1:170, c_{s}=0:50, 150\}`, `b_{c}=\{c_{s}=1:70, c_{s}=0:50, 150\}`, `K=\operatorname{rgb}(r_{c}, g_{c}, b_{c})` → 점·도형의 색 설정에 `K`를 지정한다.
- 진척도 색: 비율 `p`(0~1)로 `\operatorname{hsv}(120p, 0.8, 0.9)`(빨강 → 초록).
- 맞음·틀림을 빨강·초록만으로 알리지 않는다(색약 학생). 글·기호(✅/❌)를 함께 둔다(`reference/design-rules.md`).

## 5. 반올림해서 채점하기
- 계산 오차로 맞은 답이 틀리게 나오지 않게 둘 다 반올림해 비교한다: `c_{s}=\{\operatorname{round}(a,2)=\operatorname{round}(t,2):1, 0\}`.
- CL에서 바로 비교할 때는 범위로 비교한다(`cl-judgments.md` 1절 「소수 비교」).

## 5-1. 방정식의 근을 회귀로 찾기
- 그래프에 `f(x)=x^2-2`와 회귀 줄 `f(x_c)\sim0`을 두면 `x_c`가 근(1.41421)으로 맞춰진다. CL은 `graph.number("x_{c}")`로 읽는다. (확인됨)

## 6. 버튼을 누를 때마다 새 난수
- CL: `number("s"): btn.pressCount`.
- 그래프: 주사위 100번 `D=\operatorname{floor}(\operatorname{random}(\operatorname{uniformdist}(1,7),100,s))`. 씨앗값 `s`가 같으면 화면을 보는 동안 같은 결과가 나오므로, 버튼을 누를 때만 바뀐다. 다만 화면을 다시 열면 같은 씨앗값이어도 결과가 달라진다(편집 창·미리보기를 열 때마다 다른 값). 학생마다 같은 결과를 보여야 하면 난수 대신 고정 리스트를 쓴다.
- 점으로 보이기: `[(k, D[k]) \operatorname{for} k=[1...100]]`.
- 정규분포: `N=\operatorname{normaldist}(0,1)`, 곡선 `y=N.\operatorname{pdf}(x)`, 확률 `N.\operatorname{cdf}(1.96)`.

## 7. 곡선 위를 움직이는 점과 접선 (확인됨)
- 함수는 그래프에 직접 써도 되고, CL로 넣거나(`function("f"): simpleFunction(input.latex)`) 학생이 쓴 수식 답변으로 정해도 된다. 학생이 `y=x^2`처럼 `y=`를 붙여 써도 된다.
- **움직이는 점과 그 위치 변수는 따로 입력한다.** 그래프 식 목록:
  ```
  f(x)=x^2
  (a, f(a))
  a=1
  y-f(a)=f'(a)(x-a)
  ```
  `a=1`은 슬라이더가 되고, 점 `(a, f(a))`를 끌면 `a`가 바뀌어 점이 곡선을 따라 움직이며 접선도 함께 움직인다. 도함수 `y=f'(x)`도 따로 계산하지 않고 쓸 수 있다.

## 8. 점 여러 개를 한 식으로, 조별 대표값
- 점 다섯 개: `[(t,t^2) \operatorname{for} t=[1...5]]`. 격자: `[(x,y) \operatorname{for} x=[1...5], y=[1...5]]`.
- 반 전체의 조 번호 `G`와 값 `N`을 `aggregate`로 받았을 때 조별 최댓값 6개: `M=[\max(\operatorname{join}(N[G=j],0)) \operatorname{for} j=[1...6]]`. `\operatorname{join}(…,0)`을 붙이면 아직 아무도 내지 않은 조가 비지 않고 0으로 보인다.
