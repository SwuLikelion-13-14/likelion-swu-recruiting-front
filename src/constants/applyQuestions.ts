import type { Question } from '@/components/ApplyForm/types'

export const BASIC_INFO_QUESTIONS: Question[] = [
    { id: 1, question: '이름', answer: '', placeholder: '김슈니',required: true },
    { id: 2, question: '학번', answer: '', placeholder: '학번 10자리를 입력하세요' ,required: true},
    { id: 3, question: '본 전공', answer: '', placeholder: '소프트웨어융합학과' ,required: true},
    {
        id: 4,
        question: '복수 전공', answer: '',
        placeholder: '디지털미디어학과 (없다면 작성하지 않아도 됩니다.)'
    },
    {
        id: 5,
        question: '재학 상태', answer: '',
        placeholder: 'X학년 X학기 재학, 휴학 또는 졸업 유예',
        required: true
    },
    { id: 6, question: '전화번호', answer: '', placeholder: '010-1234-5678' ,required: true},
    { id: 7, question: '메일 주소', answer: '', placeholder: 'example@gmail.com' ,required: true},
]

export const BASIC_QUESTIONS: Question[] = [
    { id: 8, question: '1. 다양한 IT 동아리 중에서 멋쟁이 사자처럼 대학 14기를 선택하고 지원하시게 된 이유를 작성해주세요.  · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 9, question: '2. 해당 파트와 관련된 경험을 작성해주세요. · · · · · (600자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 10, question: '3. 해당 파트에서 이루고자하는 목표를 작성해주세요. · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 11, question: '4. 팀 프로젝트 경험과 프로젝트에서 맡은 역할을 설명해주세요. 팀 프로젝트를 통해 무엇을 얻었는지, 프로젝트를 진행 도중에 어떤 문제를 만났으며 어떻게 해결했는지 알려주세요. 팀 프로젝트 경험이 없다면 개인 프로젝트로 무언가 개발했거나 학습한 경험을 알려주세요. · · · · · (1000자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 12, question: '5. 본인의 기술적 역량을 향상시키기 위해 학습한 경험을 설명해주세요. 해당 경험과 그 과정에서의 느낀점을 구체적으로 작성해주세요. · · · · · (700자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 13, question: '6. 멋쟁이사자처럼 대학은 최소 1회 모임 & 10시간 이상의 시간 투자를 권장합니다. 활동 기간 동안 얼마나 열정적으로, 매주 얼만큼의 시간을 할애하실 수 있는지 작성해주세요. · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 14, question: '7. 포트폴리오 또는 깃허브 링크를 제출해주세요.', answer: '', placeholder: '링크를 첨부하거나 파일을 업로드 해주세요', type: 'file' ,required: false},
]

export const BASIC_QUESTIONS_DESIGN: Question[] = [
    { id: 8, question: '1. 다양한 IT 동아리 중에서 멋쟁이 사자처럼 대학 14기를 선택하고 지원하시게 된 이유를 작성해주세요.  · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 9, question: '2. 해당 파트와 관련된 경험을 작성해주세요. · · · · · (600자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 10, question: '3. 해당 파트에서 이루고자하는 목표를 작성해주세요. · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 11, question: '4. 팀 프로젝트 경험과 프로젝트에서 맡은 역할을 설명해주세요. 팀 프로젝트를 통해 무엇을 얻었는지, 프로젝트를 진행 도중에 어떤 문제를 만났으며 어떻게 해결했는지 알려주세요. 팀 프로젝트 경험이 없다면 개인 프로젝트로 무언가 개발했거나 학습한 경험을 알려주세요. · · · · · (1000자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 12, question: '5. 본인의 기술적 역량을 향상시키기 위해 학습한 경험을 설명해주세요. 해당 경험과 그 과정에서의 느낀점을 구체적으로 작성해주세요. · · · · · (700자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 13, question: '6. 멋쟁이사자처럼 대학은 최소 1회 모임 & 10시간 이상의 시간 투자를 권장합니다. 활동 기간 동안 얼마나 열정적으로, 매주 얼만큼의 시간을 할애하실 수 있는지 작성해주세요. · · · · · (500자 이내)', answer: '', placeholder: '내용을 입력해주세요' ,required: true},
    { id: 14, question: '7. 포트폴리오 또는 깃허브 링크를 제출해주세요.', answer: '', placeholder: '링크를 첨부하거나 파일을 업로드 해주세요', type: 'file', required: true },
]

export const CHECK_QUESTIONS: Question[] = [
    { id: 15, question: '학번', answer: '', placeholder: '학번 10자리를 입력하세요' ,required: true},
    { id: 16, question: '본인 확인용 비밀번호', answer: '', placeholder: '숫자 4자리를 입력하세요' ,required: true, type: 'password', pattern: /^\d{4}$/, errorMessage: '비밀번호는 숫자 4자리여야 합니다.'},
]

export const BACKEND_QUESTIONS: Question[] = [
    { id: 17, question: '1. 프로그래밍 언어를 수강해본 적 있나요?  • • • • • (100자 이내)', answer: '', placeholder: '내용을 입력해 주세요' ,required: true},
    { id: 18, question: '2. 데이터베이스기초를 수강해본 적 있나요?  • • • • • (100자 이내)', answer: '', placeholder: '내용을 입력해 주세요' ,required: true},
    { id: 19, question: '3. 어려운 과제를 스스로 해결하고자 하는 근성이 있나요? • • • • • (200자 이내)', answer: '', placeholder: '내용을 입력해 주세요' ,required: true},
]