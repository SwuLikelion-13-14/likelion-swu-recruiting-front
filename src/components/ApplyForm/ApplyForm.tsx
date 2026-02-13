import { useEffect, useMemo, useState } from "react";
import styles from "./ApplyForm.module.css";
import type { ApplyFormProps } from "./types";

import checkboxDefault from "@/assets/icon/checkbox_default.svg";
import checkboxChecked from "@/assets/icon/checkbox_checked.svg";
import noticeIcon from "@/assets/icon/alert_octagon.svg";

import type { Question } from "@/components/ApplyForm/types";
import ApplyFormActions from "./ApplyFormActions";
import Modal from "@/components/Modal/Modal";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";

type StudentStatus = "invalid" | "draft-exists" | "submitted-exists" | "valid";

// ✅ 학번/비번 문항 ID (프로젝트에서 고정으로 쓰는 값)
const STUDENT_ID = 15;
const PASSWORD_ID = 16;

const studentMessages: Record<StudentStatus, string> = {
  invalid: "형식이 다릅니다. 숫자 10자리를 입력하세요.",
  "draft-exists":
    "임시저장 된 지원서가 이미 있습니다. 여러 개의 지원서를 임시저장할 수 없습니다.",
  "submitted-exists":
    "이미 지원서를 최종 제출한 기록이 존재합니다. 중복 지원은 불가합니다.",
  valid: "지원 가능한 학번입니다.",
};

const mockCheckStudentId = (id: string): StudentStatus => {
  if (!/^\d{10}$/.test(id)) return "invalid";
  if (id === "1234567890") return "draft-exists";
  if (id === "2026000000") return "submitted-exists";
  return "valid";
};

type ButtonState = "default" | "unactive";

export default function ApplyForm({
  mode,
  variant,
  title,
  subtitle,
  questions,
  onChange,
  onFileChange,
  enableConsent,
  enableNotice,
  enableActions,
  consentChecked,
  onConsentChange,
  allQuestions,
  onSubmit,
  onDraftSave,
}: ApplyFormProps) {
  const isSurvey = variant === "survey";
  const isResult = variant === "result";

  const [errors, setErrors] = useState<Record<number, string>>({});
  const [success, setSuccess] = useState<Record<number, string>>({});
  const [studentStatus, setStudentStatus] = useState<StudentStatus | undefined>(
    undefined
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "submitted" | "draft" | "leave" | null
  >(null);

  const [focusedFields, setFocusedFields] = useState<Record<number, boolean>>(
    {}
  );
  const [forceLeave, setForceLeave] = useState(false);


  const { setDirty, registerValidator } = useNavigationGuard();

  // ✅ 기존 답안/파일 반영을 위한 internal state
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [files, setFiles] = useState<Record<number, File | null>>({});

  // allQuestions 안전 보정
  const safeAllQuestions = useMemo(
    () => (allQuestions && allQuestions.length ? allQuestions : questions),
    [allQuestions, questions]
  );

  const passwordAnswer =
    safeAllQuestions.find((q) => q.id === PASSWORD_ID)?.answer ?? "";

  // ✅ 질문 변경 시 internal state 초기화
  // ✅ 질문 변경 시 internal state 초기화
  useEffect(() => {
    const initAnswers: Record<number, string> = {};
    const initFiles: Record<number, File | null> = {};

    questions.forEach((q) => {
      initAnswers[q.id] = q.answer || ""; // ✅ props의 answer 반영
      initFiles[q.id] = q.file || null;   // ✅ props의 file 반영
    });

    setAnswers(initAnswers);
    setFiles(initFiles);

    // ✅ 학번 검증 상태도 초기화
    const studentQ = questions.find(q => q.id === STUDENT_ID);
    if (studentQ?.answer) {
      setStudentStatus(mockCheckStudentId(studentQ.answer));
    }
  }, [questions]); // ✅ questions가 변경될 때마다 실행

  // ✅ 입력 유무(파일 포함)로 dirty 판단
  const hasAnyInput = useMemo(() => {
    return questions.some((q) =>
      q.type === "file"
        ? !!files[q.id] || answers[q.id]?.trim() !== ""
        : answers[q.id]?.trim() !== ""
    );
  }, [questions, answers, files]);

  // ✅ dirty 설정 + cleanup을 한 번에
  useEffect(() => {
    setDirty(hasAnyInput);

    return () => {
      setDirty(false); // cleanup: 컴포넌트 언마운트 시 초기화
    };
  }, [hasAnyInput, setDirty]);



  // ✅ submitted/draft-exists 상태면 3초 후 모달 오픈
  useEffect(() => {
    if (studentStatus === "submitted-exists") {
      const timer = setTimeout(() => {
        setModalType("submitted");
        setModalOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (studentStatus === "draft-exists") {
      const timer = setTimeout(() => {
        setModalType("draft");
        setModalOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [studentStatus]);

  // ✅ 뒤로가기(leave) 가드: 입력이 있을 때만
  useEffect(() => {
    const handleBack = (e: PopStateEvent) => {
      if (forceLeave || !hasAnyInput) return; // 강제 이동이면 막지 않음

      e.preventDefault();
      window.history.pushState(null, "", window.location.href);

      setModalType("leave");
      setModalOpen(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [hasAnyInput, forceLeave]);


  const handleBlur = (currentId: number, allQ: Question[]) => {
    const newErrors: Record<number, string> = {};
    const newSuccess: Record<number, string> = {};

    const currentIndex = allQ.findIndex((q) => q.id === currentId);
    if (currentIndex === -1) return;

    for (let i = 0; i <= currentIndex; i++) {
      const q = allQ[i];

      const answer = answers[q.id] || "";

      // ✅ 파일 문항 처리: file 존재 or 링크(answer) 존재하면 OK
      if (q.type === "file") {
        const hasFileOrLink = !!files[q.id] || answer.trim() !== "";
        if (q.required && !hasFileOrLink) {
          newErrors[q.id] = "기획디자인 트랙 지원자는 필수 답변 항목입니다.";
        }
        continue;
      }

      // ✅ 필수 체크
      if (q.required && !answer.trim()) {
        newErrors[q.id] = "필수 답변 항목입니다.";
        continue;
      }

      // ✅ 학번 체크
      if (q.id === STUDENT_ID && answer.trim()) {
        const status = mockCheckStudentId(answer.trim());
        setStudentStatus(status);

        if (status !== "valid") {
          newErrors[q.id] = studentMessages[status];
        } else {
          newSuccess[q.id] = studentMessages[status];
        }
        continue;
      }

      // ✅ 비밀번호 체크 (4자리 숫자)
      if (q.id === PASSWORD_ID && answer.trim()) {
        if (!/^\d{4}$/.test(answer.trim())) {
          newErrors[q.id] = "형식이 다릅니다. 숫자 4자리를 입력하세요.";
        } else {
          newSuccess[q.id] = "비밀번호가 설정되었습니다.";
        }
        continue;
      }

      // ✅ 기타 pattern 기반 검증이 있는 경우
      if (q.pattern && answer.trim() && !q.pattern.test(answer)) {
        newErrors[q.id] = q.errorMessage || "형식이 다릅니다.";
      }
    }

    setErrors(newErrors);
    setSuccess(newSuccess);
  };

  const handleFileUpload = (id: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setFiles((prev) => ({ ...prev, [id]: file }));
      setAnswers((prev) => ({ ...prev, [id]: file.name }));
      onFileChange?.(id, file);
      onChange?.(id, file.name);

      setErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      setSuccess((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };
    input.click();
  };

  const validateInfoSection = () => {
    const studentOk = studentStatus === "valid";
    const passwordOk = /^\d{4}$/.test(passwordAnswer);

    if (!studentOk || !passwordOk) {
      const newErrors: Record<number, string> = {};

      if (!studentOk) newErrors[STUDENT_ID] = "필수 답변 항목입니다.";
      if (!passwordOk) newErrors[PASSWORD_ID] = "필수 답변 항목입니다.";

      setErrors((prev) => ({ ...prev, ...newErrors }));

      const firstErrorId = !studentOk ? STUDENT_ID : PASSWORD_ID;

      requestAnimationFrame(() => {
        document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });

      return false;
    }

    return true;
  };

  useEffect(() => {
    registerValidator(validateInfoSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentStatus, passwordAnswer]);

  const requiredQuestions = questions.filter(
  (q) => q.required && q.id !== STUDENT_ID && q.id !== PASSWORD_ID
);

  const requiredFilled =
    requiredQuestions.length > 0 &&
    requiredQuestions.every((q) =>
      q.type === "file"
        ? !!files[q.id] || answers[q.id]?.trim() !== ""
        : answers[q.id]?.trim() !== ""
    );

  const studentValid = studentStatus === "valid";
  const passwordValid = /^\d{4}$/.test(passwordAnswer);
  const consentOk = !!consentChecked;

  const cancelState: ButtonState = "default";
  const draftState: ButtonState =
    hasAnyInput && studentValid && passwordValid && consentOk ? "default" : "unactive";
  const submitState: ButtonState =
    requiredFilled && studentValid && passwordValid && consentOk ? "default" : "unactive";

  return (
    <section
      className={[styles.wrapper, isSurvey ? styles.bgDark : styles.bgResult].join(" ")}
      data-variant={variant}
    >
      <header className={styles.header}>
        <h1
          className={[
            styles.title,
            isSurvey ? styles.titleColored : styles.titleBlack,
          ].join(" ")}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={[styles.subtitle, isResult ? styles.subtitleBlack : ""].join(" ")}>
            {subtitle}
          </p>
        )}
      </header>

      <div id="info-section" className={styles.form}>
        {questions.map((item) => {
          const isStudentField = item.id === STUDENT_ID;
          const isPasswordField = item.id === PASSWORD_ID;

          const inputStateClass = isStudentField
            ? errors[item.id]
              ? styles.inputError
              : studentStatus === "valid"
                ? styles.inputSuccess
                : ""
            : errors[item.id]
              ? styles.inputError
              : success[item.id]
                ? styles.inputSuccess
                : "";

          const placeholderText =
            errors[item.id] || focusedFields[item.id] ? "" : item.placeholder;

          return (
            <div className={styles.item} key={item.id}>
              <p
                className={[
                  styles.question,
                  isSurvey ? styles.questionWhite : styles.questionBlack,
                ].join(" ")}
              >
                {item.question}
              </p>

              {item.type === "file" ? (
                <div className={styles.fileInputWrapper}>
                  <input
                    id={`field-${item.id}`}
                    className={[
                      styles.input,
                      isSurvey ? styles.inputDark : styles.inputLight,
                      errors[item.id]
                        ? styles.inputError
                        : success[item.id]
                          ? styles.inputSuccess
                          : "",
                    ].join(" ")}
                    value={answers[item.id] || ""}
                    placeholder={item.placeholder}
                    readOnly={mode === "view"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAnswers((prev) => ({ ...prev, [item.id]: value }));
                      onChange?.(item.id, value);

                      if (value.trim() !== "") {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next[item.id];
                          return next;
                        });
                      }
                    }}
                    onFocus={() =>
                      setFocusedFields((prev) => ({ ...prev, [item.id]: true }))
                    }
                    onBlur={() => {
                      setFocusedFields((prev) => ({ ...prev, [item.id]: false }));
                      handleBlur(item.id, safeAllQuestions);
                    }}
                  />

                  <div className={styles.fileBottomRow}>
                    <div>
                      {errors[item.id] && (
                        <div className={[styles.errorText, styles.fileErrorText].join(" ")}>
                          {errors[item.id]}
                        </div>
                      )}
                      {success[item.id] && !errors[item.id] && (
                        <div className={[styles.successText, styles.fileErrorText].join(" ")}>
                          {success[item.id]}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.uploadButton}
                      onClick={() =>
                        mode === "view" ? undefined : handleFileUpload(item.id)
                      }
                      disabled={mode === "view"}
                    >
                      {mode === "view"
                        ? "파일 다운로드"
                        : files[item.id]
                          ? "파일 변경하기"
                          : "파일 업로드"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    id={`field-${item.id}`}
                    className={[
                      styles.input,
                      isSurvey ? styles.inputDark : styles.inputLight,
                      inputStateClass,
                    ].join(" ")}
                    value={answers[item.id] || ""}
                    placeholder={placeholderText}
                    readOnly={mode === "view"}
                    rows={1}
                    style={{ resize: "none", overflow: "hidden" }}
                    onFocus={() =>
                      setFocusedFields((prev) => ({ ...prev, [item.id]: true }))
                    }
                    onBlur={() => {
                      setFocusedFields((prev) => ({ ...prev, [item.id]: false }));
                      handleBlur(item.id, safeAllQuestions);
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAnswers((prev) => ({ ...prev, [item.id]: value }));
                      onChange?.(item.id, value);

                      const textarea = e.target;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;

                      if (isStudentField) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next[STUDENT_ID];
                          return next;
                        });

                        const st = mockCheckStudentId(value.trim());
                        setStudentStatus(st);

                        if (st !== "valid") {
                          setErrors((prev) => ({
                            ...prev,
                            [STUDENT_ID]: studentMessages[st],
                          }));
                          setSuccess((prev) => {
                            const next = { ...prev };
                            delete next[STUDENT_ID];
                            return next;
                          });
                        } else {
                          setSuccess((prev) => ({
                            ...prev,
                            [STUDENT_ID]: studentMessages[st],
                          }));
                        }
                        return;
                      }

                      if (isPasswordField) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next[PASSWORD_ID];
                          return next;
                        });

                        if (!/^\d{4}$/.test(value.trim())) {
                          setErrors((prev) => ({
                            ...prev,
                            [PASSWORD_ID]: "형식이 다릅니다. 숫자 4자리를 입력하세요.",
                          }));
                          setSuccess((prev) => {
                            const next = { ...prev };
                            delete next[PASSWORD_ID];
                            return next;
                          });
                        } else {
                          setSuccess((prev) => ({
                            ...prev,
                            [PASSWORD_ID]: "비밀번호가 설정되었습니다.",
                          }));
                        }
                        return;
                      }
                    }}
                  />

                  {isStudentField ? (
                    <div
                      className={
                        errors[item.id]
                          ? styles.errorText
                          : studentStatus === "valid"
                            ? styles.successText
                            : styles.errorText
                      }
                    >
                      {errors[item.id] ||
                        (studentStatus ? studentMessages[studentStatus] : "")}
                    </div>
                  ) : (
                    <>
                      {errors[item.id] && (
                        <div className={styles.errorText}>{errors[item.id]}</div>
                      )}
                      {success[item.id] && !errors[item.id] && (
                        <div className={styles.successText}>{success[item.id]}</div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {enableConsent && (
        <section className={styles.consentSection}>
          <h2
            className={[
              styles.consentTitle,
              isResult ? styles.consentTitleBlack : "",
            ].join(" ")}
          >
            지원서 제출을 위한
            <br />
            개인정보 수집 및 이용 동의서
          </h2>

          <ol
            className={[
              styles.consentList,
              isResult ? styles.consentListBlack : "",
            ].join(" ")}
          >
            <li>
              <p
                className={[
                  styles.listTitle,
                  isResult ? styles.listTitleBlack : "",
                ].join(" ")}
              >
                수집하는 개인정보 항목
              </p>
              <div
                className={[
                  styles.consentBox,
                  isResult ? styles.consentBoxBlack : "",
                ].join(" ")}
              >
                필수 항목 : 이름, 학번, 전화번호, 이메일 주소, 학과(본전공, 복수전공), 본인확인용 비밀번호
              </div>
            </li>

            <li>
              <p
                className={[
                  styles.listTitle,
                  isResult ? styles.listTitleBlack : "",
                ].join(" ")}
              >
                개인정보의 보유 및 이용 기간
              </p>
              <div
                className={[
                  styles.consentBox,
                  isResult ? styles.consentBoxBlack : "",
                ].join(" ")}
              >
                수집된 개인정보는 지원 기간 종료 및 선발 완료 후 6개월간 보관하며, 이후 지체 없이 파기합니다.
              </div>
              <div
                className={[
                  styles.consentBox,
                  isResult ? styles.consentBoxBlack : "",
                ].join(" ")}
              >
                지원자가 개인정보 삭제를 요청할 경우 즉시 파기합니다.
              </div>
            </li>

            <li>
              <p
                className={[
                  styles.listTitle,
                  isResult ? styles.listTitleBlack : "",
                ].join(" ")}
              >
                동의 거부 권리 및 불이익 안내
              </p>
              <div
                className={[
                  styles.consentBox,
                  isResult ? styles.consentBoxBlack : "",
                ].join(" ")}
              >
                귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
              </div>
              <div
                className={[
                  styles.consentBox,
                  isResult ? styles.consentBoxBlack : "",
                ].join(" ")}
              >
                필수 항목에 대한 동의를 거부하실 경우, 지원 및 심사 대상에서 제외될 수 있습니다.
              </div>
            </li>
          </ol>

          <label className={styles.consentCheck}>
            <input
              type="checkbox"
              checked={!!consentChecked}
              disabled={mode === "view"}
              onChange={(e) => onConsentChange?.(e.target.checked)}
            />
            <img
              src={consentChecked ? checkboxChecked : checkboxDefault}
              className={[
                styles.checkboxIcon,
                isResult ? styles.checkboxIconResult : "",
              ].join(" ")}
              alt=""
            />
            <span
              className={[
                styles.checkboxText,
                isResult ? styles.checkboxTextBlack : "",
              ].join(" ")}
            >
              위 내용에 동의합니다.
            </span>
          </label>
        </section>
      )}

      {enableNotice && (
        <section className={styles.noticeSection}>
          <h2
            className={[
              styles.noticeTitle,
              isResult ? styles.noticeTitleBlack : "",
            ].join(" ")}
          >
            지원서 제출 시 유의 사항
          </h2>

          <div className={styles.noticeItems}>
            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p
                  className={[
                    styles.noticeText,
                    isResult ? styles.noticeTextBlack : "",
                  ].join(" ")}
                >
                  지원 트랙을 변경하고 싶어요.
                </p>
                <p
                  className={[
                    styles.noticeTextDetail,
                    isResult ? styles.noticeTextDetailBlack : "",
                  ].join(" ")}
                >
                  현재 작성 중인 지원서 페이지 내에서 트랙을 변경하는 것은{" "}
                  <span className={styles.highlight}>불가능</span> 합니다. <br />
                  작성 중인 지원서의 <span className={styles.highlight}>‘작성 취소’</span>를 누른 후,{" "}
                  <br />
                  변경하고 싶은 트랙을 선택하여 지원서를 다시 작성해 주세요. <br />
                  내용은 <span className={styles.highlight}>자동 저장되지 않으므로</span>{" "}
                  복사/붙여넣기를 권장 드립니다.
                </p>
              </div>
            </div>
          </div>

          {enableActions && (
            <ApplyFormActions
              cancelState={cancelState}
              draftState={draftState}
              submitState={submitState}
              hasInput={hasAnyInput}
              onDraftSave={() => onDraftSave?.()}
              onSubmit={onSubmit}
              onCancelConfirmed={() => (window.location.href = "/")}
            />
          )}
        </section>
      )}

      {modalOpen && modalType === "submitted" && (
        <Modal
          isOpen={modalOpen}
          title="이미 최종 제출한 지원서가 있습니다"
          description={
            <span>
              중복 지원은 불가하므로,
              <br />
              현재 작성 중인 지원서는 <span style={{ color: "#FF7710" }}>‘작성 취소’</span>{" "}
              해주세요.
            </span>
          }
          extraText={
            <span>
              최종 제출한 지원서는 해당 학번으로 로그인하여,
              <br />
              <span style={{ color: "#FF7710" }}>3월 2일 23시 59분까지</span>
              <br />
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
            text: "확인",
            onClick: () => setModalOpen(false),
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {modalOpen && modalType === "draft" && (
        <Modal
          isOpen={modalOpen}
          title="이미 임시저장된 지원서가 있습니다"
          description={
            <span>
              여러 개의 지원서를 임시저장 할 수 없으므로,
              <br />
              현재 작성 중인 지원서는 <span style={{ color: "#FF7710" }}>‘작성 취소’</span>{" "}
              해주세요.
            </span>
          }
          extraText={
            <span>
              해당 학번으로 다시 로그인하여,
              <br />
              기존에 임시 저장한 지원서를 다시 확인해 주세요.
              <br />
              <br />
              현재 작성 된 내용은 <span style={{ color: "#FF7710" }}>저장되지 않으니,</span>
              <br />
              <span style={{ color: "#FF7710" }}>복사/붙여넣기를 권장 드립니다.</span>
            </span>
          }
          primaryButton={{
            text: "확인",
            onClick: () => setModalOpen(false),
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {modalOpen && modalType === "leave" && (
        <Modal
          isOpen={modalOpen}
          title="WARNING"
          description={
            <span>
              페이지를 나가면
              <br />
              작성 중인 지원서는 저장되지 않습니다.
            </span>
          }
          extraText={
            <span>
              지원서 작성을 취소하고, 페이지를 나갈까요?<br />
              작성된 내용은 저장되지 않습니다.
            </span>
          }
          primaryButton={{
            text: "나가기",
            onClick: () => {
              setForceLeave(true); // 강제 이동 플래그 켬
              setModalOpen(false);
              window.history.back(); // 이제 실제로 이동
            },
          }}
          secondaryButton={{
            text: "지원서로 돌아가기",
            onClick: () => setModalOpen(false),
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
