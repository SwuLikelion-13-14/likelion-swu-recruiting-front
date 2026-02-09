import React, { useState } from 'react';
import qIcon from '../../assets/icon/q_svg.svg';
import chevronDown from '../../assets/icon/chevron_down.svg';
import chevronUp from '../../assets/icon/chevron_up.svg';
import Layout from '../../components/Layout/Layout';
import styles from './FaqPage.module.css';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  isOpen: boolean;
}

const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 1,
      question: '자주 묻는 질문 1',
      answer: '이곳에 답변이 표시됩니다.',
      isOpen: false
    },
    {
      id: 2,
      question: '자주 묻는 질문 2',
      answer: '이곳에 답변이 표시됩니다.',
      isOpen: false
    },
    // 추가 FAQ 항목들을 여기에 추가
  ]);

  const toggleFaq = (id: number) => {
    setFaqs(faqs.map(faq => 
      faq.id === id 
        ? { ...faq, isOpen: !faq.isOpen } 
        : { ...faq, isOpen: false }
    ));
  };

  return (
      <div className={styles.container}>
      <Layout>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1>FAQ</h1>
            <div className={styles.subtitle}>
              자주 묻는 질문
            </div>
          </div>
          
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`${styles.faqItem} ${faq.isOpen ? styles.active : ''}`}
              >
                <div 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <img src={qIcon} alt="Q" style={{ width: '32px', height: '30px', marginRight: '20px' }} />
                  {faq.question}
                  <img 
                    src={faq.isOpen ? chevronUp : chevronDown} 
                    alt="toggle" 
                    className={styles.arrowIcon}
                    style={{
                      width: '40px',
                      height: '20px'
                    }}
                  />
                </div>
                {faq.isOpen && (
                  <div className={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </Layout>
    </div>
  );
};

export default FaqPage;