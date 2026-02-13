import { useState } from 'react';
import { api } from '@/api/client'
import styles from './ApplyBox.module.css';
import Logo from '@/assets/icon/logo_small_orange.svg';
import OrIcon from '@/assets/icon/or_svg.svg';
import { useNavigate } from 'react-router-dom';

const ApplyBox = () => {
    const navigate = useNavigate();

    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [studentError, setStudentError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [studentFocused, setStudentFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    // 검증 함수 (API 호출)
    const handleCheck = async () => {
        setStudentError('');
        setPasswordError('');
        setLoading(true);

        try {
            const res = await api.post('/api/users/me', {
                student_id: studentId,
                password: password
            });

            const data = res.data;

            console.log("🔹 서버 응답:", data); // ✅ 관리자 여부 포함 전체 응답 확인용

            if (data.isSuccess) {
                if (data.result.role === 'ADMIN') {
                    console.log("관리자 계정 확인 완료! /admin 이동 가능");
                    localStorage.setItem('admin-auth', 'true');
                    navigate('/admin');
                } else if (data.result.applicationRsDTO) {
                    const field = data.result.applicationRsDTO.applicationField; // "FRONT" / "DESIGN" / "BACK" 등
                    let path = '/front'; // 기본값

                    if (field === 'FRONT') path = '/front';
                    else if (field === 'PND') path = '/design';
                    else if (field === 'BACK') path = '/back';
                    else path = '/front'; // 그 외는 프론트로 fallback

                    navigate(path, {
                        state: { applicationData: data.result.applicationRsDTO } // 답안 데이터 전달
                    });
                } else {
                    setStudentError('지원서 정보가 없습니다. 관리자에게 문의하세요.');
                }
            }
        } catch (err: any) {
            const errorData = err.response?.data;
            const status = err.response?.status;

            console.log("❌ 요청 실패", errorData, "상태 코드:", status); // ✅ 실패 응답 확인용

            if (status === 400) {
                // 지원서 없는 학번, 관리자 계정 등
                setStudentError(errorData?.message || '지원한 기록이 없습니다. 새로운 지원서를 작성해주세요.');
                setPassword('');
            } else if (status === 401) {
                // 비밀번호 틀림
                setPasswordError(errorData?.message || '비밀번호가 일치하지 않습니다.');
            } else if (!errorData) {
                setStudentError('서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
            } else {
                // 예상치 못한 오류
                setStudentError(errorData.message || '알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.gradientCircle1} />
            <div className={styles.gradientCircle2} />

            <div className={styles.content}>
                <img src={Logo} alt="Logo" className={styles.topIcon} />
                <h2 className={styles.title}>지원서 작성</h2>
                <p className={styles.subText}>작성했던 지원서가 있나요?</p>

                <div className={styles.inputGroup}>
                    <div className={styles.inputField}>
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
                            className={studentError ? styles.errorInput : ''}
                        />
                        {studentError && <div className={styles.errorText}>{studentError}</div>}
                    </div>
                    <div className={styles.inputField}>
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
                            className={passwordError ? styles.errorInput : ''}
                        />
                        {passwordError && <div className={styles.errorText}>{passwordError}</div>}
                    </div>
                </div>

                <button
                    className={styles.primaryButton}
                    onClick={handleCheck}
                    disabled={loading}
                >
                    {loading ? '확인 중...' : '내 지원서 보기'}
                </button>

                <div className={styles.orWrapper}>
                    <div className={styles.orLine}></div>
                    <img src={OrIcon} alt="or" className={styles.orIcon} />
                    <div className={styles.orLine}></div>
                </div>

                <p className={styles.subText}>지원서를 처음 작성하시나요?</p>
                <button
                    className={styles.secondaryButton}
                    onClick={() => navigate('/recruit-track')}
                >
                    새 지원서 작성하기
                </button>
            </div>
        </div>
    );
};

export default ApplyBox;
