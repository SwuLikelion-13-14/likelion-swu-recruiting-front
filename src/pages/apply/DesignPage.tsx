import { useState, useEffect } from 'react'
import { Header } from '@/components/Layout/Header/Header';
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import Banner from '@/components/ActivityContent/Banner'
import styles from './DesignPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS_DESIGN, CHECK_QUESTIONS } from '@/constants/applyQuestions'
import ApplyFooter from '@/components/Layout/Footer/ApplyFooter';
import { api } from '@/api/client'
import type { Question } from '@/components/ApplyForm/types'

const DesignPage = () => {
    const [sets, setSets] = useState<
        { title: string; subtitle?: string; questions: Question[] }[]
    >([
        { title: '필수 기본 정보', questions: [] },
        { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: [] },
        { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: [] },
    ])
    const [consentChecked, setConsentChecked] = useState(false)

    // 페이지 전체 질문(flat)
    const allQuestions = sets.flatMap(set => set.questions)

    // API에서 질문 받아오기
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/recruit/application/PND')

                const apiQuestions: { id: number; questionText: string }[] =
                    Array.isArray(res?.data?.result) ? res.data.result : []

                // 기존 더미 질문과 merge
                const mapDummy = (dummy: Question[], ids: number[]) =>
                    ids.map((id, idx) => {
                        const apiQ = apiQuestions.find(q => q.id === id)
                        if (!apiQ) return dummy[idx] // API에 없으면 기존 더미 그대로
                        return {
                            ...dummy[idx],
                            id: apiQ.id, // DB와 동일하게
                            question: apiQ.questionText,
                        }
                    })

                setSets([
                    { title: '필수 기본 정보', questions: mapDummy(BASIC_INFO_QUESTIONS, [1, 2, 3, 4, 5, 6, 7]) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mapDummy(BASIC_QUESTIONS_DESIGN, [8, 9, 10, 11, 12, 13, 14]) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mapDummy(CHECK_QUESTIONS, [15, 16]) },
                ])
            } catch (err) {
                console.error('질문 불러오기 실패:', err)
                // API 실패 시 기존 더미 질문 유지
                setSets([
                    { title: '필수 기본 정보', questions: BASIC_INFO_QUESTIONS },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: BASIC_QUESTIONS_DESIGN },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: CHECK_QUESTIONS },
                ])
            }
        }

        fetchQuestions()
    }, [])

    const handleChange = (setIndex: number, id: number, value: string) => {
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? {
                        ...set,
                        questions: set.questions.map(q =>
                            q.id === id ? { ...q, answer: value } : q
                        ),
                    }
                    : set
            )
        )
    }

    const handleFileChange = (setIndex: number, id: number, file: File) => {
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? {
                        ...set,
                        questions: set.questions.map(q =>
                            q.id === id ? { ...q, file, answer: file.name } : q
                        ),
                    }
                    : set
            )
        )
    }
    const handleFinalSubmit = async () => {
        try {
            // 1️⃣ 기본정보 (id 2번을 사용!)
            const userInfoDTO = {
                name: allQuestions.find(q => q.id === 1)?.answer || '',
                studentId: allQuestions.find(q => q.id === 2)?.answer || '', // ✅ 15번 아니라 2번!
                password: allQuestions.find(q => q.id === 16)?.answer || '',
                major: allQuestions.find(q => q.id === 3)?.answer || '',
                doubleMajor: allQuestions.find(q => q.id === 4)?.answer || '',
                schoolStatus: allQuestions.find(q => q.id === 5)?.answer || '',
                phone: allQuestions.find(q => q.id === 6)?.answer || '',
                email: allQuestions.find(q => q.id === 7)?.answer || '',
            }

            // 2️⃣ 질문 답변 (8~14번)
            const responses = allQuestions
                .filter(q => q.id >= 8 && q.id <= 13)
                .map(q => ({
                    questionId: q.id,
                    responseText: q.answer || '',
                }))

            // 3️⃣ 포트폴리오 처리
            const portfolioQuestion = allQuestions.find(q => q.id === 14)
            const portfolioFile = portfolioQuestion?.file
            const portfolioLink = portfolioQuestion?.answer || ''

            // 4️⃣ dto 객체
            const dtoPayload = {
                applicationField2: 1, // 1=최종제출
                userInfoDTO,
                responses,
                portfolioLink: portfolioFile ? '' : portfolioLink, // 파일 있으면 링크는 빈값
            }
            console.log('=== 전송 데이터 확인 ===')
            console.log('userInfoDTO:', userInfoDTO)
            console.log('responses:', responses)
            console.log('portfolioFile:', portfolioFile)
            console.log('portfolioLink:', portfolioLink)
            console.log('전체 payload:', dtoPayload)


            // 5️⃣ FormData 생성
            const formData = new FormData()
            formData.append(
                'dto',
                new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' })
            )

            // 6️⃣ 파일 첨부
            if (portfolioFile) {
                formData.append('portfolioFile', portfolioFile)
            }
            console.log('=== FormData 내용 ===')
            for (let [key, value] of formData.entries()) {
                if (value instanceof Blob) {
                    console.log(key, '(Blob):', value.size, 'bytes')
                } else {
                    console.log(key, value)
                }
            }

            // 7️⃣ API 호출
            const res = await api.post('/recruit/application/PND/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('최종 제출 성공:', res.data)
            alert('지원서가 성공적으로 제출되었습니다!')

        } catch (err: any) {
            console.error('❌ 제출 실패:', err)
            console.error('에러 응답:', err.response?.data)
            console.error('상태 코드:', err.response?.status)

            // 백엔드 에러 메시지 표시
            if (err.response?.data?.message) {
                alert(`제출 실패: ${err.response.data.message}`)
            } else if (err.response?.data?.result) {
                const errors = err.response.data.result
                const errorMsg = Object.entries(errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join('\n')
                alert(`필드 오류:\n${errorMsg}`)
            } else {
                alert('제출 중 오류가 발생했습니다.')
            }
        }
    }

    // 임시저장

    const handleDraftSave = async () => {
        try {
            // 🔍 임시저장 시에는 학번, 비밀번호만 검증
            const studentId = allQuestions.find(q => q.id === 15)?.answer || ''
            const password = allQuestions.find(q => q.id === 16)?.answer || ''

            if (!studentId || !password) {
                return
            }

            const userInfoDTO = {
                name: allQuestions.find(q => q.id === 1)?.answer || '',
                studentId: studentId,
                password: password,
                major: allQuestions.find(q => q.id === 3)?.answer || '',
                doubleMajor: allQuestions.find(q => q.id === 4)?.answer || '',
                schoolStatus: allQuestions.find(q => q.id === 5)?.answer || '',
                phone: allQuestions.find(q => q.id === 6)?.answer || '',
                email: allQuestions.find(q => q.id === 7)?.answer || '',
            }

            const responses = allQuestions
                .filter(q => q.id >= 8 && q.id <= 13)
                .map(q => ({
                    questionId: q.id,
                    responseText: q.answer || '',
                }))

            const portfolioQuestion = allQuestions.find(q => q.id === 14)
            const portfolioFile = portfolioQuestion?.file
            const portfolioLink = portfolioQuestion?.answer || ''

            const dtoPayload = {
                applicationField2: 2, // 2 = 임시저장
                userInfoDTO,
                responses,
                portfolioLink: portfolioFile ? '' : portfolioLink,
            }

            console.log('=== 임시저장 데이터 ===')
            console.log('dtoPayload:', dtoPayload)

            const formData = new FormData()
            formData.append(
                'dto',
                new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' })
            )

            if (portfolioFile) {
                formData.append('portfolioFile', portfolioFile)
            }

            const res = await api.post('/recruit/application/PND/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('✅ 임시저장 성공:', res.data)
            alert('지원서가 임시저장되었습니다!')

        } catch (err: any) {
            console.error('❌ 임시저장 실패:', err)
            console.error('에러 응답:', err.response?.data)

            if (err.response?.data?.message) {
                alert(`임시저장 실패: ${err.response.data.message}`)
            } else {
                alert('임시저장 중 오류가 발생했습니다.')
            }
        }
    }

    return (
        <div className={styles.page}>
            <Header />
            <Banner line1="기획 디자인" line2="서울여대 멋쟁이사자처럼 14기 아기사자 지원서" />

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
    )
}

export default DesignPage
