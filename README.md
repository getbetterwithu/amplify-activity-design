# amplify-activity-design

Amplify Classroom(Desmos) 액티비티를 설계하고 편집기에서 만드는 일을 돕는 스킬입니다.

액티비티를 **자동으로 만들어 주는 스킬이 아닙니다.** 화면을 어떻게 구성할지에 대한 설계 원칙과, 편집기에서 실제로 조작하고 저장값으로 확인하는 절차를 알려 주어 AI가 선생님의 지시 범위 안에서 함께 만들도록 돕습니다. 내용은 중학교 확률 단원 액티비티를 실제로 만들면서 편집기와 저장값으로 확인한 것이며, 항목 끝에 확인 정도(저장값 확인 / 1회 관찰 / 미확인)를 적었습니다.

## 할 수 있는 일

- **화면 설계:** 구성요소 조합, 글·발문 줄이기, 단계별 공개(정답을 먼저 보여 주지 않기), 객관식 보기 만들기, 색 역할 정하기
- **편집기 조작:** 화면·구성요소·메모·수식·이미지·그래프·교사 팁을 만들고 고친 뒤 저장값으로 확인하기
- **CL 레시피:** 표·수식 답 판정과 ✅/❌ 표시, 단계 열기, 학생이 고른 답 인용, 조별 표 입력을 반 전체 그래프로 모으기
- **색 프리셋:** 기본형 / 차분형 / 색약 배려형 견본을 보여 주고 골라 쓰기

## 구성

```
skills/activity-design/SKILL.md                          스킬 본체 (원칙·읽을 문서·일하는 순서)
skills/activity-design/reference/design-rules.md         화면 설계 규칙
skills/activity-design/reference/screen-patterns.md      화면 구성 패턴
skills/activity-design/reference/editor-ops.md           편집기 조작 절차와 저장값 확인
skills/activity-design/reference/graph-cl-recipes.md     그래프 표현과 정답 판정 CL 레시피
skills/activity-design/reference/recipe-aggregate.md     조별 표 입력 → 반 전체 집계 그래프
skills/activity-design/reference/color-presets.md        색 역할표와 색 프리셋
skills/activity-design/reference/color-presets-swatch.html  색 프리셋 견본
```

CL 문법 해석은 이 스킬에 넣지 않았습니다. 수식 문법은 [amplify-math](https://github.com/getbetterwithu/amplify-math) 스킬을 함께 쓰면 좋습니다.

## 설치 방법 (개요)

레포 주소만으로 설치합니다. 아래 명령은 [amplify-math](https://github.com/getbetterwithu/amplify-math)와 같은 구성이며, 이 레포에서는 아직 도구별로 설치를 시험하지 않았습니다.

- **Claude Code**:
  ```
  claude plugin marketplace add getbetterwithu/amplify-activity-design
  claude plugin install amplify-activity-design@amplify-activity-design
  ```
  설치 후 `claude plugin list`에서 `amplify-activity-design@amplify-activity-design`가 enabled로 보이면 됩니다. 다음 세션부터 적용됩니다.
- **Antigravity** (`agy`):
  ```
  agy plugin install https://github.com/getbetterwithu/amplify-activity-design
  agy plugin list
  ```
- **Codex CLI** (OpenAI):
  ```
  codex plugin marketplace add getbetterwithu/amplify-activity-design
  codex plugin add amplify-activity-design@amplify-activity-design
  codex plugin list
  ```
- **명령어를 쓸 수 없는 도구**: `skills/activity-design/SKILL.md`를 지침으로 붙여 넣고 `skills/activity-design/reference/` 파일을 첨부합니다.

## 알아 둘 점

- 편집기 조작 절차는 Amplify 편집기의 내부 구조(클래스 이름 등)에 기대는 부분이 있습니다. Amplify가 바꾸면 동작하지 않을 수 있으니 항목의 확인 날짜를 보고 판단해 주세요.
- Mac의 브라우저 AI 환경에서만 확인했습니다. Windows와 다른 계정에서는 확인하지 않았습니다.
- 반 전체 집계(여러 학생이 동시에 입력하는 경우)는 학생 1명 미리보기로만 확인했습니다.
- 공식 Amplify 액티비티의 CL 원문이나 그래프 상태는 담지 않았습니다. 예시는 모두 직접 만든 액티비티에서 가져왔습니다.

## 라이선스

MIT License. Copyright (c) 2026 BetterwithU.

Amplify, Amplify Classroom, Desmos 및 관련 상표는 각 권리자의 자산입니다. 이 저장소는 Amplify와 제휴하거나 후원·승인을 받은 자료가 아닙니다.
