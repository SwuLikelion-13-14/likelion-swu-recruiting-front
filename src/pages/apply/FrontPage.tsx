import { useState, useEffect, useRef } from 'react'
import { api } from '@/api/client'
import type { Question } from '@/components/ApplyForm/types'
import { ApplyHeader } from '@/components/Layout/Header/ApplyHeader';
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import Banner from '@/components/ActivityContent/Banner'
import styles from './TrackApplyPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS, CHECK_QUESTIONS } from '@/constants/applyQuestions'
import ApplyFooter from '@/components/Layout/Footer/ApplyFooter';
import { useLocation } from 'react-router-dom';


const FrontPage = () => {
    const location = useLocation();
    const applicationData = location.state?.applicationData;

    // 페이지 전체 상태 관리
    const [sets, setSets] = useState<
        { title: string; subtitle?: string; questions: Question[] }[]
    >([
        { title: '필수 기본 정보', questions: [] },
        { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: [] },
        { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: [] },
    ])



    const [consentChecked, setConsentChecked] = useState(false)
    const allQuestions = sets.flatMap(set => set.questions)
    const allQuestionsRef = useRef(allQuestions)
    useEffect(() => {
        allQuestionsRef.current = allQuestions
    }, [allQuestions])


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get('/api/recruit/application/FRONT')

                const apiQuestions: { id: number; questionText: string }[] =
                    Array.isArray(res?.data?.result) ? res.data.result : []

                const mapDummy = (dummy: Question[], ids: number[]) =>
                    ids.map((id, idx) => {
                        const apiQ = apiQuestions.find(q => q.id === id);

                        // 기본정보에서 답변 가져오기
                        let answerFromState = '';
                        if (applicationData?.userInfo) {
                            const userInfo = applicationData.userInfo;
                            if (id === 1) answerFromState = userInfo.name || '';
                            else if (id === 2) answerFromState = userInfo.studentId || '';
                            else if (id === 3) answerFromState = userInfo.major || '';
                            else if (id === 4) answerFromState = userInfo.doubleMajor || '';
                            else if (id === 5) answerFromState = userInfo.schoolStatus || '';
                            else if (id === 6) answerFromState = userInfo.phone || '';
                            else if (id === 7) answerFromState = userInfo.email || '';
                            else if (id === 15) answerFromState = userInfo.studentId || '';
                            else if (id === 16 && applicationData?.password)
                                answerFromState = applicationData.password;

                        }

                        // 질문 답변에서 가져오기
                        const existingAnswer = (applicationData?.responses as any[] | undefined)
                            ?.find(r => r.questionId === id);

                        if (existingAnswer) {
                            answerFromState = existingAnswer.responseText || '';
                        }

                        // 포트폴리오 처리 (id=14)
                        let fileLink = '';
                        if (id === 14 && applicationData?.portfolioLink) {
                            fileLink = applicationData.portfolioLink;
                            answerFromState = applicationData.portfolioLink;
                        }

                        return {
                            ...dummy[idx],
                            id: apiQ?.id || dummy[idx].id,
                            question: apiQ?.questionText || dummy[idx].question,
                            answer: answerFromState,
                            file: undefined,
                            fileLink: fileLink,
                        };
                    });


                setSets([
                    { title: '필수 기본 정보', questions: mapDummy(BASIC_INFO_QUESTIONS, [1, 2, 3, 4, 5, 6, 7]) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mapDummy(BASIC_QUESTIONS, [8, 9, 10, 11, 12, 13, 14]) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mapDummy(CHECK_QUESTIONS, [15, 16]) },
                ])

            } catch (err) {
                console.error('질문 불러오기 실패:', err)

                const mapDummyWithData = (dummy: Question[], ids: number[]) =>
                    ids.map((id, idx) => {
                        let answerFromState = '';

                        if (applicationData?.userInfo) {
                            const userInfo = applicationData.userInfo;
                            if (id === 1) answerFromState = userInfo.name || '';
                            else if (id === 2) answerFromState = userInfo.studentId || '';
                            else if (id === 3) answerFromState = userInfo.major || '';
                            else if (id === 4) answerFromState = userInfo.doubleMajor || '';
                            else if (id === 5) answerFromState = userInfo.schoolStatus || '';
                            else if (id === 6) answerFromState = userInfo.phone || '';
                            else if (id === 7) answerFromState = userInfo.email || '';
                            else if (id === 16 && applicationData?.password)
                                answerFromState = applicationData.password;
                        }

                        if (id === 16 && applicationData?.password) {
                            answerFromState = applicationData.password;
                        }

                        const existingAnswer = (applicationData?.responses as any[] | undefined)
                            ?.find(r => r.questionId === id);
                        if (existingAnswer) {
                            answerFromState = existingAnswer.responseText || '';
                        }

                        let fileLink = '';
                        if (id === 14 && applicationData?.portfolioLink) {
                            fileLink = applicationData.portfolioLink;
                            answerFromState = applicationData.portfolioLink;
                        }

                        return {
                            ...dummy[idx],
                            answer: answerFromState,
                            file: undefined,
                            fileLink: fileLink,
                        };
                    });

                setSets([
                    { title: '필수 기본 정보', questions: mapDummyWithData(BASIC_INFO_QUESTIONS, [1, 2, 3, 4, 5, 6, 7]) },
                    { title: '서류 공통 질문', subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다', questions: mapDummyWithData(BASIC_QUESTIONS, [8, 9, 10, 11, 12, 13, 14]) },
                    { title: '지원서 최종 제출을 위한 정보 확인', subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다', questions: mapDummyWithData(CHECK_QUESTIONS, [15, 16]) },
                ]);
            }
        };

        fetchQuestions();
    }, [applicationData]);


    const handleChange = (_setIndex: number, id: number, value: string) => {
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



    // ✅ 최종 제출
    const handleFinalSubmit = async (): Promise<boolean> => {
        const currentQuestions = allQuestionsRef.current
        try {
            const userInfoDTO = {
                name: currentQuestions.find(q => q.id === 1)?.answer || '',
                studentId: currentQuestions.find(q => q.id === 2)?.answer || '',
                password: currentQuestions.find(q => q.id === 16)?.answer || '',
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
                applicationField2: 1,
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

            // Content-Type 제거! Axios가 자동 처리
            const res = await api.post('/api/recruit/application/FRONT/', formData)

            console.log(res.data)
            return true

        } catch (err: any) {
            console.error('제출 실패:', err)
            return false
        }
    }

    // ✅ 임시 저장
    const handleDraftSave = async (): Promise<boolean> => {
        const currentQuestions = allQuestionsRef.current
        try {
            const studentId = currentQuestions.find(q => q.id === 15)?.answer || ''
            const password = currentQuestions.find(q => q.id === 16)?.answer || ''

            const userInfoDTO = {
                name: currentQuestions.find(q => q.id === 1)?.answer || '',
                studentId,
                password,
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
                applicationField2: 2, // 임시 저장
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

            const res = await api.post('/api/recruit/application/FRONT/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            console.log(res.data)
            return true

        } catch (err: any) {
            console.error('임시 저장 실패:', err)
            return false
        }
    }




    return (
        <div className={styles.page}>
            <div className={styles['page-content']}>
                <ApplyHeader />
                <Banner
                    line1="프론트엔드 개발"
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
                    >
                    </ApplyForm>
                ))}

                <ApplyFooter />
            </div>
        </div>
    )
}

export default FrontPage