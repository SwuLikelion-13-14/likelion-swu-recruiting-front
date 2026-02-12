import { useState } from 'react';
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

    // 더미 DB
    const mockDB = [
        { studentId: '2025123456', password: '1234' },
        { studentId: '2022123456', password: '0000' }
    ];

    // 검증 함수
    const handleCheck = () => {
        setStudentError('');
        setPasswordError('');

        const record = mockDB.find(d => d.studentId === studentId);

        // 학번 없음
        if (!record) {
            setStudentError('지원한 기록이 없습니다. 새로운 지원서를 작성해주세요.');
            setPassword('');
            return;
        }

        // 비밀번호 틀림
        if (record.password !== password) {
            setPasswordError('비밀번호가 올바르지 않습니다.');
            return;
        }

        // 성공
        navigate('/my-application');
    };


    return (
        <div className={styles.wrapper}>
            {/* 원형 그래디언트 배경 */}
            <div className={styles.gradientCircle1} />
            <div className={styles.gradientCircle2} />

            {/* 콘텐츠 영역 */}
            <div className={styles.content}>
                {/* 상단 로고 아이콘 */}
                <img src={Logo} alt="Logo" className={styles.topIcon} />

                {/* 타이틀 */}
                <h2 className={styles.title}>지원서 작성</h2>

                {/* 타이틀 아래 한 줄 텍스트 */}
                <p className={styles.subText}>작성했던 지원서가 있나요?</p>

                {/* 학번 & 비밀번호 입력 */}
                <div className={styles.inputGroup}>
                    <div className={styles.inputField}>
                        <label>학번</label>
                        <input
                            placeholder={studentFocused ? '' : '학번 10자리를 입력하세요'} // 포커스 시 placeholder 비움
                            value={studentId}
                            onFocus={() => setStudentFocused(true)}  // 포커스 시작
                            onBlur={() => setStudentFocused(false)}
                            onChange={e => {
                                setStudentId(e.target.value);
                                setStudentError('');
                            }}
                            className={studentError ? styles.errorInput : ''}
                        />
                        {studentError && (
                            <div className={styles.errorText}>{studentError}</div>
                        )}
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
                        {passwordError && (
                            <div className={styles.errorText}>{passwordError}</div>
                        )}
                    </div>
                </div>

                {/* 버튼들 */}
                <button className={styles.primaryButton} onClick={handleCheck}>내 지원서 보기</button>

                {/* 버튼 사이 라인 + or 아이콘 */}
                <div className={styles.orWrapper}>
                    <div className={styles.orLine}></div>
                    <img src={OrIcon} alt="or" className={styles.orIcon} />
                    <div className={styles.orLine}></div>
                </div>


                <p className={styles.subText}>지원서를 처음 작성하시나요?</p>

                <button className={styles.secondaryButton} onClick={() => navigate('/recruit-track')}>새 지원서 작성하기</button>
            </div>
        </div>
    );
};

export default ApplyBox;
