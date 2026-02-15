import { useState, useEffect, useRef } from 'react'
import { ApplyHeader } from '@/components/Layout/Header/ApplyHeader';
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import Banner from '@/components/ActivityContent/Banner'
import styles from './TrackApplyPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS_DESIGN, CHECK_QUESTIONS } from '@/constants/applyQuestions'
import ApplyFooter from '@/components/Layout/Footer/ApplyFooter';
import { api } from '@/api/client'
import type { Question } from '@/components/ApplyForm/types'
import { useLocation } from 'react-router-dom'
import { useNavigationGuard } from '@/contexts/NavigationGuardContext'

const DesignPage = () => {
    const location = useLocation();
    const applicationData = location.state?.applicationData;
    const { setDirty } = useNavigationGuard();
    const isInitialLoad = useRef(true);

    type ResponseDTO = {
        questionId: number
        responseText?: string    // 글자나 숫자
        file?: File | string     // 파일 객체 또는 파일 링크
    }

    const [sets, setSets] = useState<
        { title: string; subtitle?: string; questions: Question[] }[]
    >([
        { title: '필수 기본 정보', questions: [] },
        { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: [] },
        { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: [] },
    ])

    useEffect(() => {
        // 페이지 진입 시 dirty를 false로 초기화
        setDirty(false);
    }, []);

    const [consentChecked, setConsentChecked] = useState(false)



    // 페이지 전체 질문(flat)
    const allQuestions = sets.flatMap(set => set.questions)



    // 답안 초기화(useEffect)
    useEffect(() => {
        const fetchQuestions = async () => {
            console.log("applicationData:", applicationData)
            console.log("userInfo:", applicationData?.userInfo)
            console.log("password:", applicationData?.userInfo?.password)

            try {
                const res = await api.get('/api/recruit/application/PND')

                const apiQuestions: { id: number; questionText: string }[] =
                    Array.isArray(res?.data?.result) ? res.data.result : []

                const mapDummy = (dummy: Question[], ids: number[]) =>
                    ids.map((id, idx) => {
                        const apiQ = apiQuestions.find(q => q.id === id)

                        // 기본정보에서 답변 가져오기
                        let answerFromState = ''

                        if (applicationData?.userInfo) {
                            const userInfo = applicationData.userInfo
                            if (id === 1) answerFromState = userInfo.name || ''
                            else if (id === 2) answerFromState = userInfo.studentId || ''
                            else if (id === 3) answerFromState = userInfo.major || ''
                            else if (id === 4) answerFromState = userInfo.doubleMajor || ''
                            else if (id === 5) answerFromState = userInfo.schoolStatus || ''
                            else if (id === 6) answerFromState = userInfo.phone || ''
                            else if (id === 7) answerFromState = userInfo.email || ''
                            else if (id === 15) answerFromState = userInfo.studentId || ''
                            else if (id === 16 && applicationData?.password) {
                                answerFromState = applicationData.password
                            }

                        }

                        // 질문 답변에서 가져오기
                        const existingAnswer = (applicationData?.responses as ResponseDTO[] | undefined)
                            ?.find(r => r.questionId === id)

                        if (existingAnswer) {
                            answerFromState = existingAnswer.responseText || ''
                        }

                        // 포트폴리오 처리
                        let fileLink = ''
                        if (id === 14 && applicationData?.portfolioLink) {
                            fileLink = applicationData.portfolioLink
                            answerFromState = applicationData.portfolioLink
                        }

                        return {
                            ...dummy[idx],
                            id: apiQ?.id || dummy[idx].id,
                            question: apiQ?.questionText || dummy[idx].question,
                            answer: answerFromState,
                            file: undefined,
                            fileLink: fileLink
                        }
                    })

                setSets([
                    { title: '필수 기본 정보', questions: mapDummy(BASIC_INFO_QUESTIONS, [1, 2, 3, 4, 5, 6, 7]) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mapDummy(BASIC_QUESTIONS_DESIGN, [8, 9, 10, 11, 12, 13, 14]) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mapDummy(CHECK_QUESTIONS, [15, 16]) },
                ])
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 100);
            } catch (err) {
                console.error('질문 불러오기 실패:', err)

                // API 실패 시에도 applicationData 반영!
                const mapDummyWithData = (dummy: Question[], ids: number[]) =>
                    ids.map((id, idx) => {
                        let answerFromState = ''

                        // 기본정보
                        if (applicationData?.userInfo) {
                            const userInfo = applicationData.userInfo
                            if (id === 1) answerFromState = userInfo.name || ''
                            else if (id === 2) answerFromState = userInfo.studentId || ''
                            else if (id === 3) answerFromState = userInfo.major || ''
                            else if (id === 4) answerFromState = userInfo.doubleMajor || ''
                            else if (id === 5) answerFromState = userInfo.schoolStatus || ''
                            else if (id === 6) answerFromState = userInfo.phone || ''
                            else if (id === 7) answerFromState = userInfo.email || ''
                        }

                        // 질문 답변
                        const existingAnswer = (applicationData?.responses as ResponseDTO[] | undefined)
                            ?.find(r => r.questionId === id)

                        if (existingAnswer) {
                            answerFromState = existingAnswer.responseText || ''
                        }

                        // 포트폴리오
                        let fileLink = ''
                        if (id === 14 && applicationData?.portfolioLink) {
                            fileLink = applicationData.portfolioLink
                            answerFromState = applicationData.portfolioLink
                        }

                        return {
                            ...dummy[idx],
                            answer: answerFromState,
                            file: undefined,
                            fileLink: fileLink
                        }
                    })

                setSets([
                    { title: '필수 기본 정보', questions: mapDummyWithData(BASIC_INFO_QUESTIONS, [1, 2, 3, 4, 5, 6, 7]) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mapDummyWithData(BASIC_QUESTIONS_DESIGN, [8, 9, 10, 11, 12, 13, 14]) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mapDummyWithData(CHECK_QUESTIONS, [15, 16]) },
                ])
            }
            setTimeout(() => {
                isInitialLoad.current = false;
            }, 100);
        }

        fetchQuestions()
    }, [applicationData])

    const handleChange = (_setIndex: number, id: number, value: string) => {
        if (!isInitialLoad.current) {
            setDirty(true);
        }
        setSets(prev =>
            prev.map((set, _i) => ({
                ...set,
                questions: set.questions.map(q => {
                    let newQ = q.id === id ? { ...q, answer: value } : q

                    // 체크 학번(id === 15) 입력 시 BASIC_INFO_QUESTIONS 학번(id === 2)도 자동 업데이트
                    if (id === 15 && q.id === 2) {
                        newQ = { ...newQ, answer: value }
                    }

                    // BASIC_INFO_QUESTIONS 학번(id === 2) 입력 시 CHECK_QUESTIONS 학번(id === 15)도 자동 업데이트
                    if (id === 2 && q.id === 15) {
                        newQ = { ...newQ, answer: value }
                    }

                    return newQ
                })
            }))
        )
    }


    const handleFileChange = (setIndex: number, id: number, file: File | null) => {
        if (!isInitialLoad.current) {
            setDirty(true);
        }
        setSets(prev =>
            prev.map((set, i) =>
                i === setIndex
                    ? {
                        ...set,
                        questions: set.questions.map(q => {
                            if (q.id === id) {
                                return {
                                    ...q,
                                    file: file ?? undefined,
                                    // 파일이 없으면 기존 fileLink를 그대로 유지
                                    answer: file ? file.name : '',  // null이면 무조건 빈 문자열
                                    fileLink: file ? q.fileLink : '',
                                }
                            }
                            return q
                        }),
                    }
                    : set
            )
        )
    }

    const allQuestionsRef = useRef(allQuestions)
    useEffect(() => {
        allQuestionsRef.current = allQuestions
    }, [allQuestions])


    const handleFinalSubmit = async (): Promise<boolean> => {
        const currentQuestions = allQuestionsRef.current
        try {
            // 기본정보 (id 2번을 사용!)
            const userInfoDTO = {
                name: currentQuestions.find(q => q.id === 1)?.answer || '',
                studentId: currentQuestions.find(q => q.id === 2)?.answer || '', //15번 아니라 2번!
                password: currentQuestions.find(q => q.id === 16)?.answer || '',
                major: currentQuestions.find(q => q.id === 3)?.answer || '',
                doubleMajor: currentQuestions.find(q => q.id === 4)?.answer || '',
                schoolStatus: currentQuestions.find(q => q.id === 5)?.answer || '',
                phone: currentQuestions.find(q => q.id === 6)?.answer || '',
                email: currentQuestions.find(q => q.id === 7)?.answer || '',
            }

            // 질문 답변 (8~14번)
            const responses = currentQuestions
                .filter(q => q.id >= 8 && q.id <= 14)
                .map(q => ({
                    questionId: q.id,
                    responseText: q.answer || '',
                }))

            // 포트폴리오 처리
            const portfolioQuestion = currentQuestions.find(q => q.id === 14)
            const portfolioFile = portfolioQuestion?.file
            const portfolioLink = portfolioFile
                ? '' // 파일이 있으면 링크는 비워서 파일 전송
                : portfolioQuestion?.fileLink || portfolioQuestion?.answer || '' // 파일 없으면 기존 link 또는 answer 사용

            // dto 객체
            const dtoPayload = {
                applicationId: applicationData?.id,
                applicationField2: 1, // 1=최종제출
                userInfoDTO,
                responses,
                portfolioLink: portfolioFile ? '' : portfolioLink, // 파일 있으면 링크는 빈값
            }

            // FormData 생성
            const formData = new FormData()
            formData.append(
                'dto',
                new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' })
            )

            // 파일 첨부
            if (portfolioFile) {
                formData.append('portfolioFile', portfolioFile)
            }

            // API 호출
            const res = await api.post('/api/recruit/application/PND/', formData)
            console.log('최종 제출 성공:', res.data)
            setDirty(false);
            return true
        } catch (err: any) {
            console.error('제출 실패:', err)
            return false
        }
    }

    // 임시저장

    const handleDraftSave = async (): Promise<boolean> => {
        const currentQuestions = allQuestionsRef.current
        try {
            // 🔍 임시저장 시에는 학번, 비밀번호만 검증
            const studentId = currentQuestions.find(q => q.id === 15)?.answer || ''
            const password = currentQuestions.find(q => q.id === 16)?.answer || ''

            if (!studentId || !password) {
                return false
            }

            const userInfoDTO = {
                name: currentQuestions.find(q => q.id === 1)?.answer || '',
                studentId: studentId,
                password: password,
                major: currentQuestions.find(q => q.id === 3)?.answer || '',
                doubleMajor: currentQuestions.find(q => q.id === 4)?.answer || '',
                schoolStatus: currentQuestions.find(q => q.id === 5)?.answer || '',
                phone: currentQuestions.find(q => q.id === 6)?.answer || '',
                email: currentQuestions.find(q => q.id === 7)?.answer || '',
            }

            const responses = currentQuestions
                .filter(q => q.id >= 8 && q.id <= 13)
                .map(q => ({
                    questionId: q.id,
                    responseText: q.answer || '',
                }))

            const portfolioQuestion = currentQuestions.find(q => q.id === 14)
            const portfolioFile = portfolioQuestion?.file
            const portfolioLink = portfolioQuestion?.answer || ''

            const dtoPayload = {
                applicationField2: 2, // 2 = 임시저장
                userInfoDTO,
                responses,
                portfolioLink: portfolioFile ? '' : portfolioLink,
            }


            const formData = new FormData()
            formData.append(
                'dto',
                new Blob([JSON.stringify(dtoPayload)], { type: 'application/json' })
            )

            if (portfolioFile) {
                formData.append('portfolioFile', portfolioFile)
            }

            const res = await api.post('/api/recruit/application/PND/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            console.log('임시저장 성공:', res.data)
            setDirty(false);
            return true

        } catch (err: any) {
            console.error('❌ 임시저장 실패:', err)
            console.error('에러 응답:', err.response?.data)
            return true
        }
    }


    return (
        <div className={styles.page}>
            <div className={styles['page-content']}>
                <ApplyHeader />
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
                        onDirectSubmit={handleFinalSubmit}
                        onDirectDraftSave={handleDraftSave}
                    />
                ))}

                <ApplyFooter />
            </div>
        </div>
    )
}

export default DesignPage
