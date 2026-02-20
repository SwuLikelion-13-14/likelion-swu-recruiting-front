import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/img/14th_recruit_background.png';
import Layout from '../../components/Layout/Layout';
import styles from './RecruitClosingPage.module.css';
import applyStyles from '@/components/ApplyBox/ApplyBox.module.css';
import RecruitInfoButton from '@/components/ActivityContent/RecruitInfoButton';
import Logo from '@/assets/icon/logo_small_orange.svg';

const ResultCheckPage = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [studentFocused, setStudentFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [studentError, setStudentError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async () => {
        setStudentError('');
        setPasswordError('');

        if (!studentId.trim()) {
            setStudentError('학번을 입력해주세요.');
            return;
        }

        if (!password.trim()) {
            setPasswordError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/api/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    password: password,
                }),
            });

            // 비밀번호 틀림 (401)
            if (response.status === 401) {
                const errorData = await response.json();
                setPasswordError(errorData.message);
                return;
            }

            const data = await response.json();

            // 결과 페이지로 이동 + 데이터 전달
            navigate('/result', { state: data });

        } catch (error) {
            console.error(error);
            alert('서버 오류가 발생했습니다.');
        }
    };


    return (
        <div
            className={styles.container}
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <Layout>
                <div className={styles.centerContent}>
                    <div className={styles.centerBox}>
                        <div className={applyStyles.wrapper}>
                            <div className={applyStyles.gradientCircle1} />
                            <div className={applyStyles.gradientCircle2} />

                            <div className={applyStyles.content}>

                                <img src={Logo} alt="Logo" className={applyStyles.topIcon} />

                                <h2 className={applyStyles.title}>결과 조회</h2>

                                <div className={applyStyles.inputGroup}>
                                    <div className={applyStyles.inputField}>
                                        <label>학번</label>
                                        <input
                                            placeholder={studentFocused ? '' : '학번 10자리를 입력하세요'}
                                            value={studentId}
                                            onFocus={() => setStudentFocused(true)}
                                            onBlur={() => setStudentFocused(false)}
                                            onChange={e => {
                                                setStudentId(e.target.value);
                                                setStudentError('');
                                            }}
                                            className={studentError ? applyStyles.errorInput : ''}
                                        />
                                        {studentError && (
                                            <div className={applyStyles.errorText}>
                                                {studentError}
                                            </div>
                                        )}
                                    </div>

                                    <div className={applyStyles.inputField}>
                                        <label>비밀번호</label>
                                        <input
                                            type="password"
                                            placeholder={passwordFocused ? '' : '숫자 4자리를 입력하세요'}
                                            value={password}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                            onChange={e => {
                                                setPassword(e.target.value);
                                                setPasswordError('');
                                            }}
                                            className={passwordError ? applyStyles.errorInput : ''}
                                        />
                                        {passwordError && (
                                            <div className={applyStyles.errorText}>
                                                {passwordError}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className={applyStyles.primaryButton}
                                    onClick={handleSubmit}
                                >
                                    결과 조회
                                </button>

                            </div>
                        </div>
                    </div>

                    <div className={`${styles.infoSpacing} ${styles.infoSpacingLarge}`}>
                        <RecruitInfoButton />
                    </div>
                </div>
            </Layout>
        </div>
    );
};

export default ResultCheckPage;