import React, { useState, useEffect } from 'react';
import qIcon from '../../assets/icon/q_svg.svg';
import chevronDown from '../../assets/icon/chevron_down.svg';
import chevronUp from '../../assets/icon/chevron_up.svg';
import Layout from '../../components/Layout/Layout';
import styles from './FaqPage.module.css';
import axios from 'axios';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface Section {
  title: string;
  subtitle: string;
}

interface ApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    section: Section;
    faqList: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [section, setSection] = useState<Section>({ title: '', subtitle: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/faq`;
        console.log('Fetching FAQs from:', apiUrl);
        
        const response = await axios.get<ApiResponse>(apiUrl, {
          timeout: 5000, // 5초 타임아웃
          validateStatus: (status) => status < 500 // 500 이상 에러만 캐치
        });
        
        console.log('API Response:', response);
        
        if (response.data.isSuccess) {
          setSection(response.data.result.section);
          setFaqs(
            response.data.result.faqList.map(faq => ({
              ...faq,
              isOpen: false
            }))
          );
        } else {
          const errorMessage = response.data.message || 'FAQ를 불러오는 데 실패했습니다.';
          console.error('API Error:', errorMessage);
          setError(errorMessage);
        }
      } catch (error) {
        console.error('API Error:', error);
        setError('FAQ를 불러오는 데 실패했습니다.');
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (question: string) => {
    setFaqs(faqs.map(faq => 
      faq.question === question 
        ? { ...faq, isOpen: !faq.isOpen } 
        : { ...faq, isOpen: false }
    ));
  };

  return (
      <div className={styles.container}>
      <Layout>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1>{section.title}</h1>
            <div className={styles.subtitle}>
              {section.subtitle}
            </div>
          </div>
          
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <div 
                key={faq.question} 
                className={`${styles.faqItem} ${faq.isOpen ? styles.active : ''}`}
              >
                <div 
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(faq.question)}
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
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </div></Layout>
      </div>
    
  );
};

export default FaqPage;