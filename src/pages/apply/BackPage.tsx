import { useState, useEffect, useRef } from 'react'
import { api } from '@/api/client'
import type { Question } from '@/components/ApplyForm/types'
import { ApplyHeader } from '@/components/Layout/Header/ApplyHeader'
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import Banner from '@/components/ActivityContent/Banner'
import styles from './TrackApplyPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS, CHECK_QUESTIONS, BACKEND_QUESTIONS } from '@/constants/applyQuestions'
import ApplyFooter from '@/components/Layout/Footer/ApplyFooter'
import { useLocation } from 'react-router-dom'

type ResponseDTO = {
    questionId: number
    responseText?: string
    file?: File | string | null
}

// Question 타입 확장
type MergedQuestion = Question & {
    serverId?: number
    fileLink?: string
    file?: File | null;
}



type ApiQuestion = {
    id: number
    questionPart: 'BASIC' | 'COMMON' | 'BACK'
    no: number
    questionText: string
}

const BackPage = () => {
    const location = useLocation()
    const applicationData = location.state?.applicationData

    const [sets, setSets] = useState<
        { title: string; subtitle?: string; questions: MergedQuestion[] }[]
    >([
        { title: '필수 기본 정보', questions: [] },
        {
            title: '서류 공통 질문',
            subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다',
            questions: [],
        },
        {
            title: '트랙 별 추가 질문',
            subtitle: '백엔드 트랙의 지원자를 위한 필수 답변 항목입니다',
            questions: [],
        },
        {
            title: '지원서 최종 제출을 위한 정보 확인',
            subtitle:
                '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다',
            questions: [],
        },
    ])

    const [consentChecked, setConsentChecked] = useState(false)
    const allQuestions = sets.flatMap((set) => set.questions)
    const allQuestionsRef = useRef(allQuestions)

    useEffect(() => {
        allQuestionsRef.current = allQuestions
    }, [allQuestions])

    // dummy Question -> MergedQuestion 초기화
    const toMerged = (dummy: Question[]): MergedQuestion[] =>
        dummy.map((d) => ({ ...d, file: undefined, fileLink: undefined }))

    // mergeQuestionsWithAnswer 내부 수정
const mergeQuestionsWithAnswer = (
    dummy: Question[],
    apiQuestions: ApiQuestion[],
    responses: ResponseDTO[] | undefined
): MergedQuestion[] => {
    return dummy.map((d, i) => {
        const apiQ = apiQuestions[i]
        const serverId = apiQ?.id || d.id

        let answer = ''
        if (responses) {
            const existing = responses.find((r) => r.questionId === serverId)
            if (existing) answer = existing.responseText || ''
        }

        // 기본 정보 (1~7)
        if (applicationData?.userInfo) {
            const u = applicationData.userInfo
            if (d.id === 1) answer = u.name || ''
            else if (d.id === 2) answer = u.studentId || ''
            else if (d.id === 3) answer = u.major || ''
            else if (d.id === 4) answer = u.doubleMajor || ''
            else if (d.id === 5) answer = u.schoolStatus || ''
            else if (d.id === 6) answer = u.phone || ''
            else if (d.id === 7) answer = u.email || ''
            else if (d.id === 15) answer = u.studentId || ''
            else if (d.id === 16 && applicationData.password) answer = applicationData.password
        }

        // 응답 병합 후, CHECK_QUESTIONS id 15/16만 강제 채움
        if (d.id === 15) {
            answer = applicationData?.userInfo?.studentId || ''
        }
        if (d.id === 16 && applicationData?.password) {
            answer = applicationData.password
        }

        // 포트폴리오 처리 (id 14)
        let fileLink = ''
        if (d.id === 14 && applicationData?.portfolioLink) {
            fileLink = applicationData.portfolioLink
            answer = applicationData.portfolioLink
        }

        return {
            ...d,
            question: apiQ?.questionText || d.question,
            serverId,
            answer,
            file: undefined,
            fileLink,
        }
    })
}


    // 질문 불러오기(useEffect)
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/api/recruit/application/BACK')
                const apiQuestions: ApiQuestion[] =
                    Array.isArray(res?.data?.result) ? res.data.result : []

                const basicApi = apiQuestions.filter((q) => q.questionPart === 'BASIC').sort((a, b) => a.no - b.no)
                const commonApi = apiQuestions.filter((q) => q.questionPart === 'COMMON').sort((a, b) => a.no - b.no)
                const backApi = apiQuestions.filter((q) => q.questionPart === 'BACK').sort((a, b) => a.no - b.no)

                setSets([
                    { title: '필수 기본 정보', questions: mergeQuestionsWithAnswer(BASIC_INFO_QUESTIONS, basicApi, applicationData?.responses) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mergeQuestionsWithAnswer(BASIC_QUESTIONS, commonApi, applicationData?.responses) },
                    { title: '트랙 별 추가 질문', subtitle: '백엔드 트랙 지원자를 위한 필수 답변 항목입니다', questions: mergeQuestionsWithAnswer(BACKEND_QUESTIONS, backApi, applicationData?.responses) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mergeQuestionsWithAnswer(CHECK_QUESTIONS, [], applicationData?.responses) },
                ])
            } catch (err) {
                console.error('질문 불러오기 실패:', err)
                // API 실패 시 기본 dummy
                setSets([
                    { title: '필수 기본 정보', questions: toMerged(BASIC_INFO_QUESTIONS) },
                    { title: '서류 공통 질문', questions: toMerged(BASIC_QUESTIONS) },
                    { title: '트랙 별 추가 질문', questions: toMerged(BACKEND_QUESTIONS) },
                    { title: '지원서 최종 제출을 위한 정보 확인', questions: mergeQuestionsWithAnswer(CHECK_QUESTIONS, [], applicationData?.responses) },
                ])
            }
        }

        fetchQuestions()
    }, [])

    const handleChange = (_setIndex: number, id: number, value: string) => {
        setSets((prev) =>
            prev.map((set) => ({
                ...set,
                questions: set.questions.map((q) => {
                    let newQ = q.id === id ? { ...q, answer: value } : q

                    // 학번 동기화
                    if (id === 2 && q.id === 15) newQ = { ...newQ, answer: value }
                    if (id === 15 && q.id === 2) newQ = { ...newQ, answer: value }

                    return newQ
                }),
            }))
        )
    }

    const handleFileChange = (setIndex: number, id: number, file: File | null) => {
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? {
                        ...set,
                        questions: set.questions.map(q =>
                            q.id === id
                                ? { ...q, file: file ?? undefined, answer: file?.name || '' }
                                : q
                        ),
                    }
                    : set
            )
        )
    }



    const buildPayload = (applicationField2: number) => {
        const checkStudentId = allQuestions.find((q) => q.id === 15)?.answer || ''
        const password = allQuestions.find((q) => q.id === 16)?.answer || ''

        if (!checkStudentId || !password) {
            return null
        }

        const userInfoDTO = {
            name: allQuestions.find((q) => q.id === 1)?.answer || '',
            studentId: allQuestions.find((q) => q.id === 2)?.answer || '',
            password,
            major: allQuestions.find((q) => q.id === 3)?.answer || '',
            doubleMajor: allQuestions.find((q) => q.id === 4)?.answer || '',
            schoolStatus: allQuestions.find((q) => q.id === 5)?.answer || '',
            phone: allQuestions.find((q) => q.id === 6)?.answer || '',
            email: allQuestions.find((q) => q.id === 7)?.answer || '',
        }

        const responses = allQuestions
            .filter((q) => (q.id >= 8 && q.id <= 14) || (q.id >= 17 && q.id <= 19))
            .map((q) => ({
                questionId: q.serverId || q.id,
                responseText: q.answer || '',
            }))

        const portfolioQuestion = allQuestions.find((q) => q.id === 14)
        const portfolioFile = portfolioQuestion?.file
        const portfolioLink = portfolioQuestion?.answer || ''

        const dtoPayload = {
            applicationField2,
            userInfoDTO,
            responses,
            portfolioLink: portfolioFile ? '' : portfolioLink,
        }

        const formData = new FormData()
        formData.append('dto', new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' }))
        if (portfolioFile) formData.append('portfolioFile', portfolioFile)

        return formData
    }

    const handleFinalSubmit = async () => {
        try {
            const formData = buildPayload(1)
            if (!formData) return false
            const res = await api.post('/api/recruit/application/BACK/', formData)
            console.log(res.data)
            return true
        } catch (err) {
            console.error('제출 실패:', err)
            return false
        }
    }

    const handleDraftSave = async () => {
        try {
            const formData = buildPayload(2)
            if (!formData) return false
            const res = await api.post('/api/recruit/application/BACK/', formData)
            console.log(res.data)
            return true
        } catch (err) {
            console.error('임시 저장 실패:', err)
            return false
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles['page-content']}>
                <ApplyHeader />
                <Banner
                    line1="백엔드 개발"
                    line2="서울여대 멋쟁이사자처럼 14기 아기사자 지원서"
                />

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
                        onDirectSubmit={handleFinalSubmit}
                        onDirectDraftSave={handleDraftSave}
                    />
                ))}

                <ApplyFooter />
            </div>
        </div>
    )
}

export default BackPage