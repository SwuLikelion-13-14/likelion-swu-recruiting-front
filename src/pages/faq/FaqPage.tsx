import React, { useState, useEffect } from 'react';
import qIcon from '../../assets/icon/q_svg.svg';
import chevronDown from '../../assets/icon/chevron_down.svg';
import chevronUp from '../../assets/icon/chevron_up.svg';
import backgroundImage from '../../assets/img/14th_home_img.png';
import Layout from '../../components/Layout/Layout';
import styles from './FaqPage.module.css';
import axios from 'axios';

interface FaqItem {
  question: string;
  answer: string;
  highlights: string[]; // 하이라이트
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
      highlights: string[]; // 하이라이트
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
        const response = await axios.get<ApiResponse>(apiUrl);
        
        if (response.data.isSuccess) {
          setSection(response.data.result.section);
          setFaqs(
            response.data.result.faqList.map(faq => ({
              ...faq,
              isOpen: false
            }))
          );
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

  // 하이라이트 텍스트 처리 함수
  const getHighlightedText = (text: string, highlights: string[]) => {
  if (!highlights || highlights.length === 0) return text;

  // 특수문자를 이스케이프 처리
  const escapedHighlights = highlights.map(highlight => 
    highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  
  const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => 
    highlights.some(h => part.toLowerCase() === h.toLowerCase()) ? (
      <span key={i} className={styles.highlight}>{part}</span>
    ) : (
      part
    )
  );
};
  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', width: '100%' }} />
      <div className={styles.overlay} />
      <Layout>
        
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1>{section.title}</h1>
            <div className={styles.subtitle}>{section.subtitle}</div>
          </div>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
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
                  <div className={styles.arrowIcon}>
                    <img src={faq.isOpen ? chevronUp : chevronDown} alt="toggle" />
                  </div>
                </div>
                {faq.isOpen && (
                  <div className={styles.faqAnswer}>
                    {faq.answer.split('\n').map((line, i) => (
                      <p key={i} style={{ margin: 0 }}>
                        {getHighlightedText(line.trim(), faq.highlights)}
                      </p>
                    ))}
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