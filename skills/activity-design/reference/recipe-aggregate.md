# 레시피: 조별 표 입력 → 반 전체 집계 그래프

6-2 확률 14번(압정 던지기)에서 직접 만든 예시다. 편집기 오류 표시와 저장값으로 확인했다. **여러 학생이 동시에 입력할 때의 실제 집계는 아직 확인하지 못했다**(아래 제한). 이 문서의 CL과 그래프 식은 모두 저자가 새로 만든 것이다.

**장면:** 조별로 압정을 던져 「던진 개수」 「침이 하늘로 향한 개수」를 표에 입력하면, 그래프가 반 전체의 누적 상대도수를 보여 주고 1/2 기준선과 비교한다.

## 구성
메모(큰 글씨 발문) → 객관식 예상(정답 표시 안 함, 무작위 순서) → 표 `tbl`(머리글: 조 번호 / 던진 압정의 개수 / 침이 하늘로 향한 압정의 개수) → 그래프 `gr` → 교사 팁(운영 방법).

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
A=[max(join(N[G=j],0)) for j=[1...6]]       ← 조별 던진 개수(같은 조 여러 학생이 입력해도 최댓값 하나만)
B=[max(join(U[G=j],0)) for j=[1...6]]       ← 조별 침이 하늘로
C=[total(A[1...j]) for j=[1...6]]           ← 누적 던진 개수
D=[total(B[1...j]) for j=[1...6]]           ← 누적 침이 하늘로
F=D/C                                       ← 누적 상대도수
(C,F)                                       ← 점
y=1/2 {x>0}                                 ← 기준선
T=total(A)  S=total(B)  Q=S/T  R=round(Q,3)
(T,R)  라벨 "반 전체: ${T}개 중 ${S}개, 상대도수 ${R}" (above_left)
(0,1/2) 라벨 "1/2"
```
그래프 식은 편집기의 「그래프 편집」 창에서 계산기 API로 넣는다(`editor-ops.md`).

## 줄마다 설명
| CL 요소 | 뜻 | 확인 정도 |
|---|---|---|
| `aggregate(…)` | 학생마다 하나씩 값을 모은 목록 | 편집기·미리보기 (저장값 확인) |
| `tbl.cellNumericValue(1,열)` | 표의 숫자 값. 행 1 = 머리글 바로 아래 첫 줄 | 공식 문서와 실측 일치 (저장값 확인) |
| `isDefined(…)` | 빈 칸이면 정의되지 않음 → `otherwise 0` | (저장값 확인) |
| `numberList("G"): …` | 그래프 식의 변수 `G`에 목록을 보냄(sink) | (저장값 확인) |
| `this.number("T")` | 그래프 식의 값 `T`를 읽음(source) | (저장값 확인) |
| `makeBounds(…)` | 그래프 화면 범위 | (저장값 확인) |
| `numericValue("…${m}")` | 문자열 속 `${}` 보간으로 계산 | (저장값 확인) |
| `readOnly: true` | 학생이 그래프를 조작하지 못하게 함 | (저장값 확인) |

CL 문법은 `cl-interpreter` 스킬로 확인한다.

## 막혔을 때
| 증상 | 원인 | 해결 |
|---|---|---|
| `makeBounds(-0.05*m, 1.1*m, …)`에 빨간 오류 | CL 안에서 `*` 산술을 직접 씀 | `numericValue("-0.05*${m}")`처럼 문자열 계산, 또는 그래프 변수로 계산 (편집기 오류 표시로 확인, 규칙 판정 대기) |
| 같은 조 학생이 모두 입력해서 개수가 부풀려짐 | aggregate는 학생마다 하나씩 모음 | 조 번호 열을 두고 그래프에서 조별 `max` |
| 아무도 입력하지 않았을 때 축이 이상함 | `T = 0` | `m = when T>0 … otherwise 100` |
| 오른쪽 끝 점 라벨이 잘림 | 라벨 기본 방향 | `labelOrientation: 'above_left'` |
| 미리보기에서 점이 하나만 보임 | 미리보기는 학생 1명 | 정상. 여러 학생은 수업 세션에서만 확인 가능(미확인) |

## 제한
- 조 번호 1~6 밖의 입력은 막지 않았다.
- **여러 학생이 실제로 입력한 집계는 확인하지 못했다.** 수업 전에 교사 기기와 학생 기기 2대로 시험한다.
