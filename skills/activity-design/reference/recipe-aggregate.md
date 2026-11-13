# 레시피: 조별 표 입력 → 반 전체 집계 그래프

직접 만든 예시다. 편집기 오류 표시와 저장값으로 확인했다. **여러 학생이 동시에 입력할 때의 실제 집계는 아직 확인하지 못했다**(아래 제한). 이 문서의 CL과 그래프 식은 모두 저자가 새로 만든 것이다.

**장면:** 조별로 동전을 던져 「던진 횟수」 「앞면이 나온 횟수」를 표에 입력하면, 그래프가 반 전체의 누적 상대도수를 보여 주고 1/2 기준선과 비교한다.

## 구성
메모(큰 글씨 발문) → 객관식 예상(정답 표시 안 함, 무작위 순서) → 표 `tbl`(머리글: 조 번호 / 던진 횟수 / 앞면이 나온 횟수) → 그래프 `gr` → 교사 팁(운영 방법).

## 그래프 구성요소의 CL
```
numberList("G"): aggregate(when isDefined(tbl.cellNumericValue(1,1)) tbl.cellNumericValue(1,1) otherwise 0)
numberList("N"): aggregate(when isDefined(tbl.cellNumericValue(1,2)) tbl.cellNumericValue(1,2) otherwise 0)
numberList("U"): aggregate(when isDefined(tbl.cellNumericValue(1,3)) tbl.cellNumericValue(1,3) otherwise 0)
m = when this.number("T") > 0 this.number("T") otherwise 100
bounds: makeBounds(numericValue("-0.05*${m}"), numericValue("1.1*${m}"), -0.08, 1.05)
readOnly: true
```

## 그래프 식
```
G=[0]   N=[0]   U=[0]                       ← CL numberList가 덮어쓰는 기본값
A=[max(join(N[G=j],0)) for j=[1...6]]       ← 조별 던진 횟수(같은 조 여러 학생이 입력해도 최댓값 하나만)
B=[max(join(U[G=j],0)) for j=[1...6]]       ← 조별 앞면이 나온 횟수
C=[total(A[1...j]) for j=[1...6]]           ← 누적 던진 횟수
D=[total(B[1...j]) for j=[1...6]]           ← 누적 앞면이 나온 횟수
F=D/C                                       ← 누적 상대도수
(C,F)                                       ← 점
y=1/2 {x>0}                                 ← 기준선
T=total(A)  S=total(B)  Q=S/T  R=round(Q,3)
(T,R)  라벨 "반 전체: ${T}번 중 ${S}번, 상대도수 ${R}" (above_left)
(0,1/2) 라벨 "1/2"
```
그래프 식은 편집기의 「그래프 편집」 창에서 계산기 API로 넣는다(`editor-ops.md`).

## 줄마다 설명
| CL 요소 | 뜻 | 확인 정도 |
|---|---|---|
| `aggregate(…)` | 학생마다 하나씩 값을 모은 목록 | 편집기·미리보기 (확인됨) |
| `tbl.cellNumericValue(1,열)` | 표의 숫자 값. 행 1 = 머리글 바로 아래 첫 줄 | 공식 문서와 실측 일치 (확인됨) |
| `isDefined(…)` | 빈 칸이면 정의되지 않음 → `otherwise 0` | (확인됨) |
| `numberList("G"): …` | 그래프 식의 변수 `G`에 목록을 보냄(sink) | (확인됨) |
| `this.number("T")` | 그래프 식의 값 `T`를 읽음(source) | (확인됨) |
| `makeBounds(…)` | 그래프 화면 범위 | (확인됨) |
| `numericValue("…${m}")` | 문자열 속 `${}` 보간으로 계산 | (확인됨) |
| `readOnly: true` | 학생이 그래프를 조작하지 못하게 함 | (확인됨) |

CL 문법은 `../knowledge/`의 `cl-sinks.md`·`cl-judgments.md`·`cl-pitfalls.md`로 확인한다.

## 학생 숫자 하나를 점도표로 모으고 보기 범위가 따라가게 하기
학생마다 숫자 하나(시간, 개수 등)를 입력하면 반 전체 값이 한 점도표에 모이고, 엉뚱하게 큰 값이 나와도 점이 화면 밖으로 나가지 않게 보기 범위가 자동으로 넓어지는 화면이다. 위 조별 표 레시피보다 단순하다.

**구성(한 열)**: ① 질문 메모 ② 수식 답변 `answer`(숫자 입력) ③ 그래프 `plot`. 질문은 입력칸 바로 위에 둔다(`design-rules.md` 3-0절). 그래프는 일반 그래프이고 학생이 조작하지 못하게 `readOnly: true`를 쓴다.

**그래프 `plot`의 CL**
```
number(`x_1`): answer.numericValue
numberList(`X`): aggregate(this.number(`x_1`))
bounds: makeBounds(this.number("x_{Min}"),this.number("x_{Max}"),-2,20)
readOnly: true
```

**그래프 식**: 보이는 식은 `\operatorname{dotplot}\left(X\right)` 하나다. 막대도 보이려면 `\operatorname{histogram}\left(X,100\right)`(둘째 값은 계급 너비)를 더한다. 폴더 「windows」를 만들어 아래 두 식을 숨김(`hidden`)으로 넣는다. 아래 예의 `0`·`180`은 「정상적인 값의 구간」, `-10`·`180`은 「평소에 보여 줄 고정 창」이다(숙제 시간(분)). 문제에 맞게 바꾼다. 끝의 `-5`·`+5`는 값이 1개일 때도 범위가 무효가 되지 않게 하는 상수 여백이다.
```
x_{Min}=\left\{0<\min\left(X\right)<180:\left\{0<\max\left(X\right)<180:-10,\min\left(X\right)-.1\left(\max\left(X\right)-\min\left(X\right)\right)-5\right\},\min\left(X\right)-.1\left(\max\left(X\right)-\min\left(X\right)\right)-5\right\}
x_{Max}=\left\{0<\max\left(X\right)<180:\left\{0<\min\left(X\right)<180:180,\max\left(X\right)+.1\left(\max\left(X\right)-\min\left(X\right)\right)+5\right\},\max\left(X\right)+.1\left(\max\left(X\right)-\min\left(X\right)\right)+5\right\}
```

**줄마다 설명**
| 줄 | 하는 일 |
|---|---|
| `number(x_1): answer.numericValue` | 각 학생이 입력한 값을 그래프 안의 이름 `x_1`로 넘긴다 |
| `numberList(X): aggregate(this.number(x_1))` | 모든 학생의 `x_1`을 모아 목록 `X`를 만든다. 점도표가 이 목록을 그린다 |
| `bounds: makeBounds(xmin, xmax, ymin, ymax)` | 보기 범위를 정한다. x 끝은 숨긴 식 `x_{Min}`·`x_{Max}`가 정하고, y는 −2~20으로 고정한다 |
| `x_{Min}`, `x_{Max}` | 모든 값이 정상 구간 안이면 고정 창을 쓰고, 하나라도 밖이면 최솟값·최댓값에서 (최대−최소)의 10%에 상수 5를 더한 만큼 바깥으로 넓힌다 |

**시험 결과** (학생 미리보기, 값 하나씩) (1회 관찰)
| 상태 | 보인 것 |
|---|---|
| 값 없음 | `bounds`가 적용되지 않고 **저장된 보기 범위**가 보인다 |
| 값 40(정상 구간 안) | 축이 고정 창(0~180 근처)이고 점이 40 근처에 보인다 |
| 값 500(구간 밖) | 축이 약 496~504로 넓어지고 점이 화면 안에 보인다 |

**주의**
- 값이 없을 때는 `bounds`가 아니라 저장된 보기 범위가 보이므로, 그래프의 저장 범위를 고정 창과 같게 맞춰 둔다.
- 고정 창의 왼쪽 값과 오른쪽 값을 두 식에 각각 맞게 쓴다. 복사하면서 오른쪽 값을 왼쪽 값과 같게 쓰면 xmin과 xmax가 같아져 범위가 무효가 된다.
- 상수 여백 없이 `max−min`만 쓰면 값이 하나이고 그 값이 정상 구간 밖일 때 여백이 0이 되어 범위가 무효일 수 있다. 상수 여백(`±5`)을 더해 막는다.
- 질문을 입력 뒤에 열려면 질문 메모와 답칸에 `hidden: not(answer.submitted)`를 단다(`design-rules.md` 3-0절).
- **미리보기가 반 전체를 모으는지 자기 값만 모으는지는 확인하지 못했다.** 수업 전에 교사 기기와 학생 기기 2대로 시험한다. (미확인)

## 막혔을 때
| 증상 | 원인 | 해결 |
|---|---|---|
| `makeBounds(-0.05*m, 1.1*m, …)`에 빨간 오류 | CL 안에서 `*` 산술을 직접 씀 | `numericValue("-0.05*${m}")`처럼 문자열 계산, 또는 그래프 변수로 계산 (1회 관찰) |
| 같은 조 학생이 모두 입력해서 개수가 부풀려짐 | aggregate는 학생마다 하나씩 모음 | 조 번호 열을 두고 그래프에서 조별 `max` |
| 아무도 입력하지 않았을 때 축이 이상함 | `T = 0` | `m = when T>0 … otherwise 100` |
| 오른쪽 끝 점 라벨이 잘림 | 라벨 기본 방향 | `labelOrientation: 'above_left'` |
| 미리보기에서 점이 하나만 보임 | 미리보기는 학생 1명 | 정상. 여러 학생은 수업 세션에서만 확인 가능(미확인) |

## 제한
- 조 번호 1~6 밖의 입력은 막지 않았다.
- **여러 학생이 실제로 입력한 집계는 확인하지 못했다.** 수업 전에 교사 기기와 학생 기기 2대로 시험한다.
