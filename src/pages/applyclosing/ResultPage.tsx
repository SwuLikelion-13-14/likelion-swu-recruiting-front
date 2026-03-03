import { useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './ResultPage.module.css';
import Banner from '../../components/ActivityContent/Banner';

const ResultPage = () => {
    const location = useLocation();
    const data = location.state;


    if (!data) {
        return <div>잘못된 접근입니다.</div>;
    }

    const { stateTitle, content1, content2 } = data;

    // content2 JSON 문자열 처리
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
    const isPass = data.pass; // true면 합격, false면 불합격
    const isFinalPassed = isPass && data.state === 'FINAL_PASSED';
    const content1Class = isPass ? styles.textPassContent1 : styles.textFailContent1;
    const content2Class = isPass ? styles.textPassContent2 : styles.textFailContent2;



    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <Layout>
                <div className={styles.centerContent}>

                    {/* 배너 (stateTitle 전용, 합격/불합격 구분 없음) */}
                    <Banner
                        line1={line1}
                        line2={line2}
                        sameStyle={true}
                    />

                    {/* 텍스트 그룹 (content1 / content2) */}
                    <div className={styles.textGroup}>
                        {content1 && <p className={content1Class}>{content1}</p>}

                        {parsedContent2 && typeof parsedContent2 === 'string' && (
                            <p className={content2Class}>
                                {parsedContent2.split('\n').map((line: string, i: number) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        )}

                        {parsedContent2 && typeof parsedContent2 === 'object' && parsedContent2 !== null && (
                            <div className={isFinalPassed ? styles.textGroupFinalPass : isPass ? styles.textGroupPass : styles.textGroupFail}>

                                {/* 최종 합격일 때 notice 중앙 */}
                                {isFinalPassed && parsedContent2.notice && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            width: '100%',
                                            marginTop: '24px',     // stateTitle과의 간격
                                            marginBottom: '68px',  // 하단 텍스트와의 간격
                                        }}
                                    >
                                        <p className={styles.textPassContent2} style={{ textAlign: 'center' }}>
                                            {parsedContent2.notice.split('\n').map((line: string, i: number) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                )}

                                {/* 최종 합격일 때 순서 재조정: OT / OT 장소 / 새터 일정 / discord / warn */}
                                {isFinalPassed ? (
                                    ['ot', 'ot_place', 'new_time', 'discord', 'warn'].map((key) => {
                                        const value = parsedContent2[key];
                                        if (!value) return null;
                                        const [label, val] = value.split('\t');
                                        if (key === 'discord') {
                                            return (
                                                <div key={key} className={styles.infoRow}>
                                                    <span className={styles.label}>{label}</span>
                                                    <span className={styles.value}>
                                                        {val.split(' ').map((line: string, i: number) => (   // 🔹 line, i 타입 지정
                                                            <span key={i}>
                                                                {line}
                                                                <br />
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={key} className={styles.infoRow}>
                                                <span className={styles.label}>{label}</span>
                                                <span className={styles.value}>{val}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    // 그 외 페이지는 기존 순서 그대로
                                    Object.entries(parsedContent2).map(([key, value]) => {
                                        if (key === 'time') return null; // time은 제외
                                        const [label, val] = (value as string).split('\t');
                                        return (
                                            <div key={key} className={styles.infoRow}>
                                                <span className={styles.label}>{label}</span>
                                                <span className={styles.value}>{val}</span>
                                            </div>
                                        );
                                    })
                                )}

                                {/* time 필드만 프론트에서 고정 라벨 + value 사용 */}
                                {parsedContent2.time && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>면접 시간</span>
                                        <span className={styles.value}>
                                            {parsedContent2.time.split('\n').map((line: string, i: number) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 문의 */}
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
