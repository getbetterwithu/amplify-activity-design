# Desmos 그래프 식: 지켜야 할 제약과 함수 목록

> 그래프(`input/graph`) 안에 쓰는 Desmos 식과, CL이 그래프와 주고받는 방법을 적었다. 「이런 기능은 어떤 식으로 만드나」는 `desmos-cookbook.md`에 있다.
> 함수 목록의 출처: 커뮤니티에서 정리해 공개한 Desmos 함수 모음 그래프(https://www.desmos.com/calculator/psh7own5ep , u/fireflame241 정리). 여기서는 함수 이름과 뜻만 우리 말로 옮겼다.
> Amplify의 그래프 편집 화면은 Desmos 계산기다. 2절의 함수는 Desmos 계산기에서 동작하는 그대로 쓴다. Amplify에서 따로 지킬 것은 1절에 모았다.

## 1. Amplify 그래프에서 지켜야 할 제약 (확인됨)

1. **그래프 안 변수 이름은 한 글자 + 중괄호로 묶은 아래 첨자**: `v_{al}`, `p_{ct}`, `i_{sCorrect}`처럼 쓴다. `val`처럼 여러 글자를 이어 쓰면 하나의 변수로 읽히지 않는다. CL 안의 사용자 변수는 `val = …`처럼 여러 글자로 지어도 되지만, CL과 그래프를 잇는 이름(`number("v_{al}")`, `graph.number("v_{al}")`)은 그래프 쪽 이름이므로 반드시 `v_{al}` 꼴로 쓴다. 첨자가 한 글자일 때는 CL 쪽에 `number("g_v")`, `number("t_0")`처럼 괄호 없이 써도 그래프의 `g_{v}`, `t_{0}`과 이어진다. 헷갈리지 않게 그래프 식에는 늘 중괄호를 쓴다.
2. **리스트 내포식의 `for`는 `\operatorname{for}`로 쓴다**: `[(k, f(k)) \operatorname{for} k=[1...5]]`. 리스트의 각 값마다 점이나 함수를 만들 때 쓴다.
3. **정수 주사위**: `uniformdist`는 실수를 내므로 `\operatorname{floor}(\operatorname{random}(\operatorname{uniformdist}(1,7), n, s))`처럼 내림해 1~6을 만든다.
4. **CL이 그래프 값을 읽을 때**: `graph.number("v_{max}")`처럼 변수 이름을 큰따옴표로 감싼다. 리스트 원소도 `graph.number("Y[i_{max}]")`처럼 그대로 읽힌다. 그래프 안에 `v_{max}=Y[i_{max}]`처럼 보조 변수를 만들어 `graph.number("v_{max}")`로 읽어도 된다.
5. **CL 식 안에서 사칙연산을 직접 쓰지 않는다**: `numericValue("${a.numericValue}-${b.numericValue}")`처럼 큰따옴표 안 문자열 수식으로 계산하고, 값은 `${…}`로 넣는다(`cl-pitfalls.md` 1절).
6. **차트·통계 패널 함수는 변수에 넣지 않는다**: `boxplot`, `histogram`, `dotplot`, `stats`, `ttest`, `ittest`는 값을 내지 않고 그림·패널을 그린다. `S=\operatorname{boxplot}(L)`, `H=\operatorname{histogram}(L)`처럼 넣으면 「이해할 수 없습니다」 오류가 난다. `\operatorname{boxplot}(L)`처럼 한 줄에 따로 쓴다. 리스트 자체(`L=[1...10]`)는 변수에 넣어도 된다. 숫자로 된 t 통계량이 필요하면 `tscore(Y, \mu)`를 쓴다.
7. **차트 위치·높이**는 식이 아니라 그 식 아래 「디스플레이 속성」의 「시작점」·「높이」 칸으로 정한다(저장값 이름 `axisOffset`, `breadth`). 상자그림에는 「극단치를 점으로 표시」 체크도 있다.
8. **백분율** `25\% \operatorname{of} H`는 그대로 계산된다(`H=80`이면 20). 편집 창에서는 `25%of`처럼 붙여 쳐야 `% of` 연산자가 된다. `of`를 띄어 치면 o·f 두 문자로 읽혀 「변수가 너무 많습니다」 오류가 난다.
9. **처음 상태가 정답을 보여 주지 않게 한다**: 끌 수 있는 점의 처음 위치는 오답 자리(`i_{sCorrect}=0`)에 둔다.
10. **정의되지 않는 값 막기**: 삼각함수·로그에서 정의되지 않는 자리(예: 로그 안이 0 이하)가 있으면 CL에서 `when isDefined(graph.number("v_{ln}")) … otherwise "정의되지 않음"`으로 막는다. 정의되지 않은 값(`undefined`)은 그래프에 그려지지 않는다.

## 2. 함수 목록

### 기본 문법
| 식 | 뜻·주의 |
|---|---|
| `\{조건: 참값, 거짓값\}` | 조건 분기. CL의 `when … otherwise`와 같다. 기본값을 안 쓰면 조건 밖은 정의되지 않음, 값을 안 쓰면 1(`x^2\{x>1\}`은 x>1에서만 그린다). 비교는 `<`, `>`, `\le`, `\ge`, `=` |
| 같지 않음 | 연산자가 없다. `\{a=b: d, c\}`처럼 참·거짓 자리를 바꿔 쓴다 |
| `\pi`, `\tau`, `e`, `\infty` | 상수. `1/0`은 무한대, 빈 리스트의 원소 `[][1]`은 정의되지 않음 |
| 자료형 | 수, 점, 리스트, 분포, 색. `undefined`는 수라서 조건 분기의 한쪽이 점이고 다른 쪽이 `undefined`이면 오류가 난다 |
| `2\frac{1}{2}` | 대분수로 읽는다(2.5) |
| `12\% \operatorname{of} 25` | 백분율 |

### 수 함수
| 식 | 뜻·주의 |
|---|---|
| `\sin`, `\cos`, `\tan`, `\cot`, `\sec`, `\csc`, `\arcsin`, `\arccos`, `\arctan`, `\operatorname{arccot}`, `\operatorname{arcsec}`, `\operatorname{arccsc}` | 삼각함수. **라디안**이 기본이다. 도(°)로 넣을 값은 바꿔 넣는다. `\sin^2(x)`, `\sin^{-1}(x)` 표기도 된다 |
| `\arctan(y, x)` | 두 인자 꼴은 (−π, π] 범위의 각을 낸다. 점의 방향각에 쓴다 |
| `\sinh`, `\cosh`, `\tanh`, `\coth`, `\operatorname{sech}`, `\operatorname{csch}`, `\operatorname{arcsinh}`, `\operatorname{arccosh}`, `\operatorname{arctanh}`, `\operatorname{arccoth}`, `\operatorname{arcsech}`, `\operatorname{arccsch}` | 쌍곡선 함수 |
| `\sqrt{x}`, `\sqrt[5]{x}`, `\log`, `\log_5`, `\ln`, `\exp` | 제곱근, 거듭제곱근, 로그 |
| `\operatorname{floor}`, `\operatorname{ceil}`, `\operatorname{round}` | 내림·올림·반올림. `\operatorname{round}(x, 2)`는 소수 둘째 자리, `\operatorname{round}(x, -3)`은 천의 자리 |
| `\operatorname{abs}`, `\operatorname{sign}`, `\operatorname{mod}(x, y)` | 절댓값, 부호, 나머지(`mod(x,1)`은 소수 부분) |
| `\operatorname{nCr}`, `\operatorname{nPr}`, `5!`, `\operatorname{lcm}`, `\gcd` | 조합, 순열, 계승, 최소공배수, 최대공약수 |
| `f'(x)`, `\frac{d}{dx}` | 도함수. 함수를 정의하면 바로 미분해 그린다 |
| `\int_a^b … dx`, `\sum_{i=1}^{n}`, `\prod` | 정적분(이상적분 포함), 합, 곱 |

### 점·도형·색
| 식 | 뜻·주의 |
|---|---|
| `P.x`, `P.y` | 점의 좌표. 점 리스트에 쓰면 좌표 리스트가 된다 |
| `(1,2)+(3,4)` | 점끼리 더하고 뺄 수 있다 |
| `\operatorname{distance}(A, B)`, `\operatorname{midpoint}(A, B)` | 두 점의 거리, 중점 |
| `\operatorname{polygon}(…)` | 점 나열, 점 리스트, x 리스트와 y 리스트 세 꼴. 안이 반투명하게 칠해진다. 점 사이에 `([][1], 0)`을 넣으면 끊고 다음 도형을 그려, 한 식으로 여러 도형을 그린다 |
| `\operatorname{rgb}(r,g,b)`, `\operatorname{hsv}(h,s,v)` | 색. `h`는 0~360 |

### 리스트
| 식 | 뜻·주의 |
|---|---|
| `L[1]` | 1부터 센다 |
| `[1...9]`, `[1,3...13]` | 범위 리스트 |
| `L[3...5]`, `L[3...]` | 잘라 내기 |
| `L[L>4]` | 조건으로 거르기. 조건이 둘이면 `L[L\ge0][L\le20]`처럼 이어 쓴다 |
| `\operatorname{mean}`, `\operatorname{median}`, `\operatorname{total}`, `\operatorname{length}`, `\min`, `\max` | 평균, 중앙값, 합, 개수, 최솟값, 최댓값 |
| `\operatorname{stdev}`, `\operatorname{stdevp}`, `\operatorname{var}`(=`\operatorname{variance}`), `\operatorname{varp}`, `\operatorname{mad}` | 표본·모 표준편차, 표본·모 분산, 평균절대편차 |
| `\operatorname{quantile}(L, p)`, `\operatorname{quartile}(L, k)` | 분위수, 사분위수(`k`=0 최솟값, 2 중앙값, 4 최댓값) |
| `\operatorname{cov}`, `\operatorname{corr}`, `\operatorname{spearman}` | 두 리스트의 공분산, 상관계수 |
| `\operatorname{sort}(L)`, `\operatorname{sort}(A, B)` | 정렬. 두 인자 꼴은 `B`의 크기 순서로 `A`를 늘어놓는다 |
| `\operatorname{unique}(L)` | 중복 제거 |
| `\operatorname{join}(L_1, L_2, 0)` | 이어 붙이기. 빈 리스트는 원래 오류를 내지 않는다. 비었을 때 값이 없는 대신 `0`으로 보이게 하고 싶을 때 `\operatorname{join}(L,0)`을 쓴다(평균에는 0이 섞이므로 쓰지 않는다) |
| `\operatorname{shuffle}(L, s)` | 섞기. `s`는 씨앗값 |
| `L.\operatorname{sort}()` 등 | 점 표기로도 부를 수 있다. 원래 리스트는 바뀌지 않고 새 리스트를 낸다 |

### 확률·통계
| 식 | 뜻·주의 |
|---|---|
| `\operatorname{normaldist}`, `\operatorname{binomialdist}`, `\operatorname{poissondist}`, `\operatorname{uniformdist}`, `\operatorname{tdist}` | 분포 |
| `\operatorname{pdf}(D, x)`, `\operatorname{cdf}(D, a, b)`, `\operatorname{inversecdf}(D, p)` | 확률밀도, 누적확률, 역누적. `D.\operatorname{pdf}(x)` 꼴도 된다. 오차함수는 `\operatorname{erf}(x)` |
| `\operatorname{random}(D, n, s)` | 분포 `D`에서 `n`개, 씨앗값 `s`. 분포를 빼면 0~1 균등, 개수를 빼면 수 하나 |
| `\operatorname{histogram}`, `\operatorname{dotplot}`, `\operatorname{boxplot}`, `\operatorname{stats}`, `\operatorname{ttest}`, `\operatorname{ittest}` | 차트·패널(1절 6번: 변수에 넣지 않는다). 리스트가 비어 있으면 오류 없이 아무것도 그리지 않는다 |
| `y_1 \sim a x_1^2 + b x_1 + c` | 회귀 |

### 쓰지 않는 것
- `\operatorname{argmax}`, `\operatorname{argmin}`, `\operatorname{hypot}`, `\operatorname{normalcdf}`, `\operatorname{normalpdf}`, `\operatorname{invNorm}`, `\operatorname{polyGamma}`, `…QuantileIndex`·`…QuartileIndex` 같은 내부 함수는 편집기에서 식을 고치면 깨질 수 있다. 같은 일을 하는 공개 식을 쓴다(예: 최댓값 위치는 `\operatorname{sort}([1...\operatorname{length}(L)], L)[\operatorname{length}(L)]`, 거리는 `\operatorname{distance}`).
- `\det`, `\operatorname{inv}`, `\operatorname{rref}` 같은 행렬 함수는 Desmos 행렬 계산기용이라 그래프에서 쓰지 않는다.
