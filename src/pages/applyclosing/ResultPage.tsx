import { useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './RecruitClosingPage.module.css';
import Banner from '../../components/ActivityContent/Banner';

const ResultPage = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div>잘못된 접근입니다.</div>;
  }

  const { stateTitle, content1, content2, image } = data;

  // ✅ content2 JSON 문자열 처리 추가
  let parsedContent2: any = content2;

if (typeof content2 === 'string' && content2.includes('"date"')) {
  const dateMatch = content2.match(/"date":"([^"]*)"/);
  const placeMatch = content2.match(/"place":"([^"]*)"/);
  const timeMatch = content2.match(/"time":"([^"]*)"/);

  parsedContent2 = {
    date: dateMatch?.[1] ?? '',
    place: placeMatch?.[1] ?? '',
    time: timeMatch?.[1] ?? '',
  };
}
  // stateTitle 줄바꿈 처리
  const [line1, line2] = stateTitle.split('\n');

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Layout>
        <div className={styles.centerContent}>

          {/* 🔥 배너 */}
          <Banner
            line1={line1}
            line2={line2}
          />

          {/* 🔥 텍스트 그룹 */}
          <div className={styles.textGroup}>
            {content1 && <p className={styles.text1}>{content1}</p>}

            {/* ✅ parsedContent2 사용 */}
            {typeof parsedContent2 === 'string' && (
              <p className={styles.text2}>
                {parsedContent2.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            )}

            {typeof parsedContent2 === 'object' && parsedContent2 !== null && (
              <div className={styles.text2}>
                {Object.values(parsedContent2).map((value: any, index) => (
                  <p key={index}>{value}</p>
                ))}
              </div>
            )}
          </div>

          {image && (
            <img
              src={image}
              alt="결과 이미지"
              className={styles.resultImage}
            />
          )}

          {/* 🔥 ask는 프론트 고정 */}
          <p className={styles.textinsta}>
            <span className={styles.keyword}>문의</span>
            <span className={styles.middleText}>
              서울여대 멋쟁이사자처럼 인스타그램
            </span>
            <a
              href="https://www.instagram.com/likelion_swu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagram}
            >
              @likelion_swu
            </a>
          </p>

        </div>
      </Layout>
    </div>
  );
};

export default ResultPage;