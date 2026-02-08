import { useState } from 'react'
import { Header } from '@/components/Layout/Header/Header';
import ApplyForm from '@/components/ApplyForm/ApplyForm'
import styles from './FrontPage.module.css'
import { BASIC_INFO_QUESTIONS, BASIC_QUESTIONS, CHECK_QUESTIONS } from '@/constants/applyQuestions'


// 각 세트 질문 더미
const questionSets = [
    {
        title: '필수 기본 정보',
        questions: BASIC_INFO_QUESTIONS,
    },
    {
        title: '서류 공통 질문',
        subtitle: '모든 지원자에게 공통으로 적용되는 필수 답변 항목입니다',
        questions: BASIC_QUESTIONS,
    },
    {
        title: '지원서 최종 제출을 위한 정보 확인',
        subtitle: '추후 지원서 열람 및 수정을 위해 필요한 정보를 재확인합니다',
        questions: CHECK_QUESTIONS,
    },

]

const FrontPage = () => {
  // 페이지 전체 상태 관리
  const [sets, setSets] = useState(questionSets)
  const [consentChecked, setConsentChecked] = useState(false)

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


  return (
    <div className={styles.page}>
        <Header/>
      {sets.map((set, idx) => (
        <ApplyForm
          key={idx}
          mode="edit"
          variant="survey"
          title={set.title}
          subtitle={set.subtitle}
          questions={set.questions}
          onChange={(id, value) => handleChange(idx, id, value)}
          enableConsent={idx === sets.length - 1}
          enableNotice={idx === sets.length - 1}
          enableActions={idx === sets.length - 1}
          consentChecked={consentChecked}
          onConsentChange={setConsentChecked}
        >
        </ApplyForm>
      ))}
 
    </div>
  )
}

export default FrontPage
