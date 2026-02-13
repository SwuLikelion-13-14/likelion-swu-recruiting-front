import { useState, useEffect } from 'react'
import { api } from '@/api/client'
import type { Question } from '@/components/ApplyForm/types'
import { Header } from '@/components/Layout/Header/Header';
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import Banner from '@/components/ActivityContent/Banner'
import styles from './TrackApplyPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS, CHECK_QUESTIONS, BACKEND_QUESTIONS } from '@/constants/applyQuestions'
import ApplyFooter from '@/components/Layout/Footer/ApplyFooter';


type ApiQuestion = {
    id: number
    questionPart: 'BASIC' | 'COMMON' | 'BACK'
    no: number
    questionText: string
}

const mergeQuestions = (dummy: Question[], api: ApiQuestion[]) => {
    return dummy.map((d, i) => {
        const apiQ = api[i]
        if (!apiQ) return d
        return {
            ...d,
            question: apiQ.questionText,
        }
    })
}

const BackPage = () => {

    const [sets, setSets] = useState<
        { title: string; subtitle?: string; questions: Question[] }[]
    >([
        { title: '필수 기본 정보', questions: [] },
        { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: [] },
        { title: '트랙 별 추가 질문', subtitle: '백엔드 트랙의 지원자를 위한 필수 답변 항목입니다', questions: [] },
        { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: [] },
    ])

    const [consentChecked, setConsentChecked] = useState(false)
    const allQuestions = sets.flatMap(set => set.questions)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/api/recruit/application/BACK')
                const apiQuestions: ApiQuestion[] =
                    Array.isArray(res?.data?.result) ? res.data.result : []

                const basicApi = apiQuestions.filter(q => q.questionPart === 'BASIC').sort((a, b) => a.no - b.no)
                const commonApi = apiQuestions.filter(q => q.questionPart === 'COMMON').sort((a, b) => a.no - b.no)
                const backApi = apiQuestions.filter(q => q.questionPart === 'BACK').sort((a, b) => a.no - b.no)

                setSets([
                    { title: '필수 기본 정보', questions: mergeQuestions(BASIC_INFO_QUESTIONS, basicApi), },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mergeQuestions(BASIC_QUESTIONS, commonApi), },
                    { title: '트랙 별 추가 질문', subtitle: '백엔드 트랙 지원자를 위한 필수 답변 항목입니다', questions: mergeQuestions(BACKEND_QUESTIONS, backApi), },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: CHECK_QUESTIONS },
                ])

            } catch (err) {
                console.error('질문 불러오기 실패:', err)
                setSets([
                    { title: '필수 기본 정보', questions: BASIC_INFO_QUESTIONS },
                    { title: '서류 공통 질문', questions: BASIC_QUESTIONS },
                    { title: '백엔드 추가 질문', questions: BACKEND_QUESTIONS },
                    { title: '지원서 최종 제출 확인', questions: CHECK_QUESTIONS },
                ])
            }
        }
        fetchQuestions()
    }, [])

    const handleChange = (setIndex: number, id: number, value: string) => {
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? { ...set, questions: set.questions.map(q => q.id === id ? { ...q, answer: value } : q) }
                    : set
            )
        )
    }

    const handleFileChange = (setIndex: number, id: number, file: File) => {
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? { ...set, questions: set.questions.map(q => q.id === id ? { ...q, file, answer: file.name } : q) }
                    : set
            )
        )
    }

  const buildPayload = (applicationField2: number) => {
    // ✅ CHECK_QUESTIONS의 학번/비밀번호 (15, 16번)
    const checkStudentId = allQuestions.find(q => q.id === 15)?.answer || ''
    const password = allQuestions.find(q => q.id === 16)?.answer || ''

    if (!checkStudentId || !password) {
        alert('학번과 비밀번호를 입력해주세요!')
        return null
    }

    // ✅ userInfoDTO는 기본정보(1~7번) 사용
    const userInfoDTO = {
        name: allQuestions.find(q => q.id === 1)?.answer || '',
        studentId: allQuestions.find(q => q.id === 2)?.answer || '',
        password: password,
        major: allQuestions.find(q => q.id === 3)?.answer || '',
        doubleMajor: allQuestions.find(q => q.id === 4)?.answer || '',
        schoolStatus: allQuestions.find(q => q.id === 5)?.answer || '',
        phone: allQuestions.find(q => q.id === 6)?.answer || '',
        email: allQuestions.find(q => q.id === 7)?.answer || '',
    }

    // ✅ responses는 공통질문(8~14) + 백엔드질문(17~19)
    const responses = allQuestions
        .filter(q => (q.id >= 8 && q.id <= 14) || (q.id >= 17 && q.id <= 19))
        .map(q => ({
            questionId: q.id,
            responseText: q.answer || '',
        }))

    // ✅ 포트폴리오 처리
    const portfolioQuestion = allQuestions.find(q => q.id === 14)
    const portfolioFile = portfolioQuestion?.file
    const portfolioLink = portfolioQuestion?.answer || ''

    const dtoPayload = {
        applicationField2,
        userInfoDTO,
        responses,
        portfolioLink: portfolioFile ? '' : portfolioLink,
    }

    console.log('=== 전송 데이터 확인 ===')
    console.log('userInfoDTO:', userInfoDTO)
    console.log('responses:', responses)
    console.log('portfolioFile:', portfolioFile)

    const formData = new FormData()
    formData.append('dto', new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' }))
    // ✅ portfolioFile 없으면 빈 파일로 append
    formData.append('portfolioFile', portfolioFile || new File([], 'empty.txt'))

    // ✅ 디버깅용 FormData 확인
    for (let pair of formData.entries()) {
        console.log('FormData', pair[0], pair[1])
    }

    return formData
}

const handleFinalSubmit = async () => {
    try {
        const formData = buildPayload(1)
        if (!formData) return

        // ✅ headers 제거하고 기본 multipart/form-data 사용
        const res = await api.post('/api/recruit/application/BACK/', formData)
        alert('지원서가 성공적으로 제출되었습니다!')
        console.log(res.data)
    } catch (err) {
        console.error('제출 실패:', err)
        alert('제출 실패')
    }
}

const handleDraftSave = async () => {
    try {
        const formData = buildPayload(2)
        if (!formData) return

        const res = await api.post('/api/recruit/application/BACK/', formData)
        alert('임시 저장되었습니다!')
        console.log(res.data)
    } catch (err) {
        console.error('임시 저장 실패:', err)
        alert('임시 저장 실패')
    }
}

    return (
        <div className={styles.page}>
            <div className={styles['page-content']}>
            <Header />
            <Banner line1="백엔드 개발" line2="서울여대 멋쟁이사자처럼 14기 아기사자 지원서" />

            {sets.map((set, idx) => (
                <ApplyForm
                    key={idx}
                    mode="edit"
                    variant="survey"
                    title={set.title}
                    subtitle={set.subtitle}
                    questions={set.questions}
                    allQuestions={allQuestions}
                    onChange={(id, value) => handleChange(idx, id, value)}
                    enableConsent={idx === sets.length - 1}
                    enableNotice={idx === sets.length - 1}
                    enableActions={idx === sets.length - 1}
                    consentChecked={consentChecked}
                    onConsentChange={setConsentChecked}
                    onFileChange={(id, file) => handleFileChange(idx, id, file)}
                    onSubmit={handleFinalSubmit}
                    onDraftSave={handleDraftSave}
                />
            ))}

            <ApplyFooter />
            </div>
        </div>
    )
}

export default BackPage
