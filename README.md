# amplify-activity-design

Amplify Classroom(Desmos) 액티비티를 설계하고 편집기에서 만드는 일을 돕는 스킬입니다.

액티비티를 **자동으로 만들어 주는 스킬이 아닙니다.** 교사와 먼저 브레인스토밍으로 전체 화면 구성을 함께 정한 뒤, 화면마다 구성요소 조합을 제안하고 편집기에서 만들고 저장값으로 점검하도록 AI를 돕습니다. CL을 잘 모르는 교사에게는 화면 구성 과정을 돕습니다. 내용은 실제 액티비티를 만들면서 편집기와 저장값으로 확인한 것이며, 항목 끝에 확인 정도(확인됨 / 1회 관찰 / 미확인)를 적었습니다.

## 할 수 있는 일

- **0단계 브레인스토밍:** 자료(교과서·수업자료·앞 단원 링크)를 부탁하고, 화면 수와 쓸 도구(그래프·기하학·집계·학생 응답 인용 등)가 다른 구성안을 2개 이상 구체적으로 제시해 고르게 하기
- **관문과 점검:** 시작 선언, 참조 스킬 읽기, 제작 전 체크리스트, 저장 직후 점검 스크립트(수식 노드·점 이름·긴 문단·경고·스크롤), 종료 보고

- **화면 설계:** 구성요소 조합, 글·발문 줄이기, 단계별 공개(정답을 먼저 보여 주지 않기), 객관식 보기 만들기, 색 역할 정하기
- **편집기 조작:** 화면·구성요소·메모·수식·이미지·그래프·교사 팁을 만들고 고친 뒤 저장값으로 확인하기
- **CL 레시피:** 표·수식 답 판정과 ✅/❌ 표시, 단계 열기, 학생이 고른 답 인용, 조별 표 입력을 반 전체 그래프로 모으기
- **색 프리셋:** 기본형 / 차분형 / 색약 배려형 견본을 보여 주고 골라 쓰기

- **기하학·작도:** 도구 이름, 진짜 점·선분으로 만들기, 학생 답을 도형 안에 표시하기, 따라 그릴 수 있는 작도 안내 쓰기
- **가벼운 삽화 추천:** 글만 있는 문제 화면에 삽화를 제안하고, 교사가 준 이미지가 흐리거나 크면 알맞은 경로(폴리패드·다시 그리기) 고르기
- **폴리패드 필기 작업지:** 자료 이미지와 실제 텍스트창을 분리하고, 필기용 도구 프리셋·자료 잠금·일부 글자 확대와 색을 설정하기

## 구성

```
skills/activity-design/SKILL.md                          스킬 본체 (원칙·읽을 문서·일하는 순서)
skills/activity-design/reference/brainstorming.md        0단계 브레인스토밍(자료 받기, 구성 제안서)
skills/activity-design/reference/design-rules.md         화면 설계 규칙
skills/activity-design/reference/lint.md                 저장 직후 점검 스크립트·체크리스트·종료 보고
skills/activity-design/reference/illustration.md         가벼운 삽화 추천과 교사가 준 이미지 점검
skills/activity-design/reference/geometry-recipes.md     기하학 도구·작도·학생 답 표시
skills/activity-design/reference/screen-patterns.md      화면 구성 패턴
skills/activity-design/reference/editor-ops.md           편집기 조작 절차와 저장값 확인
skills/activity-design/reference/polypad-fullscreen-writing.md  전체화면 필기 프리셋·부분 서식
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

- 편집기 조작 절차는 Amplify 편집기의 내부 구조(클래스 이름 등)에 기대는 부분이 있습니다. Amplify가 바꾸면 동작하지 않을 수 있으니 항목 끝의 확인 정도를 보고 판단해 주세요.
- 기존 절차는 주로 Mac에서 확인했고, 폴리패드 필기 작업지는 Windows에서도 구성·저장값·학생 미리보기를 확인했습니다. 다른 계정과 실제 학생 기기에서는 추가 검증이 필요합니다.
- 반 전체 집계(여러 학생이 동시에 입력하는 경우)는 학생 1명 미리보기로만 확인했습니다.
- 공식 Amplify 액티비티의 CL 원문이나 그래프 상태는 담지 않았습니다. 예시는 모두 직접 만든 액티비티에서 가져왔습니다.

## 라이선스

MIT License. Copyright (c) 2026 BetterwithU.

Amplify, Amplify Classroom, Desmos 및 관련 상표는 각 권리자의 자산입니다. 이 저장소는 Amplify와 제휴하거나 후원·승인을 받은 자료가 아닙니다.
