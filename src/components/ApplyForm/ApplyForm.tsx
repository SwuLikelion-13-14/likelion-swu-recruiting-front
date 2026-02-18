import { useEffect, useMemo, useState } from "react";
import styles from "./ApplyForm.module.css";
import type { ApplyFormProps, Question } from "./types";

import { api } from "@/api/client";
import checkboxDefault from "@/assets/icon/checkbox_default.svg";
import checkboxChecked from "@/assets/icon/checkbox_checked.svg";
import noticeIcon from "@/assets/icon/alert_octagon.svg";

import ApplyFormActions from "./ApplyFormActions";
import Modal from "@/components/Modal/Modal";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";

type StudentStatus = "invalid" | "draft-exists" | "submitted-exists" | "valid";

const studentMessages: Record<StudentStatus, string> = {
  invalid: "형식이 다릅니다. 숫자 10자리를 입력하세요.",
  "draft-exists":
    "",
  "submitted-exists":
    "",
  valid: "지원 가능한 학번입니다.",
};

const mockCheckStudentId = (id: string): StudentStatus => {
  if (!/^\d{10}$/.test(id)) return "invalid";
  if (id === "1234567890") return "draft-exists";
  if (id === "2026000000") return "submitted-exists";
  return "valid";
};

type ButtonState = "default" | "unactive";

function isHttpUrl(s: string) {
  return /^https?:\/\//i.test(s.trim());
}

function openInNewTab(url: string) {
  const u = url.trim();
  if (!u) return;
  window.open(u, "_blank", "noopener,noreferrer");
}

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
  studentIdField,
  passwordField,
  onDirectSubmit,
  onDirectDraftSave,
  isLoaded,
  onFileDownload, 
}: ApplyFormProps) {
  const isSurvey = variant === "survey";
  const isResult = variant === "result";

  const [errors, setErrors] = useState<Record<number, string>>({});
  const [success, setSuccess] = useState<Record<number, string>>({});
  const [studentStatus, setStudentStatus] = useState<StudentStatus | undefined>(
    undefined
  );
  const STUDENT_ID = studentIdField ?? 15;
  const PASSWORD_ID = passwordField ?? 16;

  type ModalType =
    | "draft"
    | "submitted"
    | "draft-overwrite"
    | "draft-overwrite-submitted"
    | "submit-overwrite-draft"
    | "submit-overwrite-submitted"
    | "leave"
    | null;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, _setModalType] = useState<ModalType>(null);

  const [isDraftOverwriteOpen, setIsDraftOverwriteOpen] = useState(false);
  const [isSubmitFromDraftOpen, setIsSubmitFromDraftOpen] = useState(false);
  const [isDraftFromSubmittedOpen, setIsDraftFromSubmittedOpen] =
    useState(false);
  const [isSubmitOverwriteOpen, setIsSubmitOverwriteOpen] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);

  const [_isDrafting, setIsDrafting] = useState(false);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [_cancelTargetModal, setCancelTargetModal] = useState<
    "draft" | "submit" | null
  >(null);
  const [_isCancelFlow, setIsCancelFlow] = useState(false);

  const [focusedFields, setFocusedFields] = useState<Record<number, boolean>>(
    {}
  );

  const { allowNavigation } = useNavigationGuard();
  const { setDirty, registerValidator } = useNavigationGuard();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [files, setFiles] = useState<Record<number, File | null>>({});

  const [initialAnswers, setInitialAnswers] = useState<Record<number, string>>(
    {}
  );
  const [initialFiles, setInitialFiles] = useState<Record<number, File | null>>(
    {}
  );
  const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);
  const [isDraftSuccessOpen, setIsDraftSuccessOpen] = useState(false);


  const safeAllQuestions = useMemo(
    () => (allQuestions && allQuestions.length ? allQuestions : questions),
    [allQuestions, questions]
  );

  const passwordAnswer = answers[PASSWORD_ID] ?? "";

  useEffect(() => {
    const initAnswers: Record<number, string> = {};
    const initFiles: Record<number, File | null> = {};

    questions.forEach((q) => {
      initAnswers[q.id] = q.answer || "";
      initFiles[q.id] = q.file || null;
    });

    setAnswers(initAnswers);
    setFiles(initFiles);

    setInitialAnswers(initAnswers);
    setInitialFiles(initFiles);

    const studentQ = questions.find((q) => q.id === STUDENT_ID);
    if (studentQ?.answer) {
      if (isLoaded) {
        setStudentStatus("valid"); 
      } else {
        setStudentStatus(mockCheckStudentId(studentQ.answer));
      }
    }
  }, [questions, STUDENT_ID, mode]);

  useEffect(() => {
    if (mode !== "view") return;

    const raf = requestAnimationFrame(() => {
      const nodes = document.querySelectorAll(
        'textarea[data-autosize="1"]'
      ) as NodeListOf<HTMLTextAreaElement>;

      nodes.forEach((ta) => {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [mode, answers, questions]);

  const executeDraftOverwrite = async () => {
    setIsDraftOverwriteOpen(false);
    setIsDraftFromSubmittedOpen(false);
    setIsLoadingOpen(true);
    setIsDrafting(true);
    try {
      const success = await onDirectDraftSave?.(); 
      setIsLoadingOpen(false); 
      if (success) setIsDraftSuccessOpen(true);
    } catch (error) {
      setIsLoadingOpen(false);
      console.error("임시저장 실패:", error);
    } finally {
      setIsDrafting(false);
    }
  };

  const executeSubmitOverwrite = async () => {
    setIsSubmitFromDraftOpen(false);
    setIsSubmitOverwriteOpen(false);
    setIsLoadingOpen(true);
    setIsSubmitting(true);
    try {
      const success = await onDirectSubmit?.(); 
      setIsLoadingOpen(false); 
      if (success) setIsSubmitSuccessOpen(true); 
    } catch (error) {
      setIsLoadingOpen(false);
      console.error("최종제출 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyChange = useMemo(() => {
    return questions.some((q) => {
      const currentAnswer = answers[q.id] || "";
      const initialAnswer = initialAnswers[q.id] || "";
      const currentFile = files[q.id];
      const initialFile = initialFiles[q.id];

      if (q.type === "file") {
        return currentFile !== initialFile || currentAnswer !== initialAnswer;
      }
      return currentAnswer !== initialAnswer;
    });
  }, [questions, answers, files, initialAnswers, initialFiles]);

  useEffect(() => {
    if (mode === "view") {
      setDirty(false);
      return;
    }
    setDirty(hasAnyChange);
  }, [mode, hasAnyChange, setDirty]);

  const checkStudentIdAPI = async (studentId: string): Promise<StudentStatus> => {
    try {
      const response = await api.post("/api/users/existence", { studentId });
      const data = response.data;

      if (!data.isSuccess) return "invalid";

      if (data.result.exist) {
        return data.result.applicationField2 === 1
          ? "submitted-exists"
          : "draft-exists";
      }

      return "valid";
    } catch (err) {
      console.error("학번 체크 실패:", err);
      return "invalid";
    }
  };

  const handleBlur = (currentId: number, allQ: Question[]) => {
    if (mode === "view") return;

    const newErrors: Record<number, string> = {};
    const newSuccess: Record<number, string> = {};

    const currentIndex = allQ.findIndex((q) => q.id === currentId);
    if (currentIndex === -1) return;

    for (let i = 0; i <= currentIndex; i++) {
      const q = allQ[i];
      const answer = answers[q.id] || "";

      if (q.type === "file") {
        const hasFileOrLink = !!files[q.id] || answer.trim() !== "";
        if (q.required && !hasFileOrLink) {
          newErrors[q.id] = "필수 답변 항목입니다.";
        }
        continue;
      }

      if (q.required && !answer.trim()) {
        newErrors[q.id] = "필수 답변 항목입니다.";
        continue;
      }

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

      if (q.id === PASSWORD_ID && answer.trim()) {
        if (!/^\d{4}$/.test(answer.trim())) {
          newErrors[q.id] = "형식이 다릅니다. 숫자 4자리를 입력하세요.";
        } else {
          newSuccess[q.id] = "비밀번호가 설정되었습니다.";
        }
        continue;
      }

      if (q.pattern && answer.trim() && !q.pattern.test(answer)) {
        newErrors[q.id] = q.errorMessage || "형식이 다릅니다.";
      }
    }

    setErrors(newErrors);
    setSuccess((prev) => ({ ...prev, ...newSuccess }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    const studentId = answers[STUDENT_ID] || "";
    if (!studentId) return false;

    const status = await checkStudentIdAPI(studentId);
    setStudentStatus(status);

    if (status === "valid") {
      setIsLoadingOpen(true);
      try {
        const success = await onSubmit?.();

        setIsLoadingOpen(false);

        if (!success) return false; // ❗ 실패면 성공모달 금지

        setIsSubmitSuccessOpen(true);
        return true;
      } catch (error) {
        setIsLoadingOpen(false);
        console.error('제출 실패:', error);
        return false;
      }
    } else if (status === "draft-exists") {
      setIsSubmitFromDraftOpen(true);
      return false;
    } else if (status === "submitted-exists") {
      setIsSubmitOverwriteOpen(true);
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [STUDENT_ID]: studentMessages[status] }));
      return false;
    }
  };

  const handleDraftSave = async (): Promise<boolean> => {
    const studentId = answers[STUDENT_ID] || "";
    if (!studentId) return false;

    const status = await checkStudentIdAPI(studentId);
    setStudentStatus(status);

    if (status === "valid") {
      setIsLoadingOpen(true);
      try {
        const success = await onDraftSave?.();

        setIsLoadingOpen(false);

        if (!success) return false;

        setIsDraftSuccessOpen(true);
        return true;
      } catch (error) {
        setIsLoadingOpen(false);
        console.error("임시저장 실패:", error);
        return false;
      }
    } else if (status === "draft-exists") {
      setIsDraftOverwriteOpen(true);
      return false;
    } else if (status === "submitted-exists") {
      setIsDraftFromSubmittedOpen(true);
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [STUDENT_ID]: studentMessages[status] }));
      return false;
    }
  };

  const handleFileUpload = (id: number) => {
    if (typeof window === "undefined") return;
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

  const handleFileDelete = (id: number) => {
    setFiles((prev) => ({ ...prev, [id]: null }));
    setAnswers((prev) => ({ ...prev, [id]: "" }));

    onFileChange?.(id, null);
    onChange?.(id, "");

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

  const validateInfoSection = () => {
    if (mode === "view") return true;

    const studentOk = studentStatus === "valid";
    const passwordOk = /^\d{4}$/.test(passwordAnswer);

    if (!studentOk || !passwordOk) {
      const newErrors: Record<number, string> = {};

      if (!studentOk) newErrors[STUDENT_ID] = "필수 답변 항목입니다.";
      if (!passwordOk) newErrors[PASSWORD_ID] = "필수 답변 항목입니다.";

      setErrors((prev) => ({ ...prev, ...newErrors }));

      const firstErrorId = !studentOk ? STUDENT_ID : PASSWORD_ID;

      requestAnimationFrame(() => {
        if (typeof document !== "undefined") {
          document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (mode === "view") return;
    registerValidator(validateInfoSection);
  }, [mode, studentStatus, passwordAnswer, registerValidator]);
  

  const requiredQuestions = safeAllQuestions.filter(
    (q) => q.required && q.id !== STUDENT_ID && q.id !== PASSWORD_ID
  );

  const requiredFilled =
    requiredQuestions.length > 0 &&
    requiredQuestions.every((q) => {
      const question = safeAllQuestions.find((item) => item.id === q.id);
      if (!question) return false;

      return q.type === "file"
        ? !!question.file || (question.answer?.trim() ?? "") !== ""
        : (question.answer?.trim() ?? "") !== "";
    });

  const studentValid = studentStatus === "valid";
  const passwordValid = /^\d{4}$/.test(passwordAnswer);
  const consentOk = !!consentChecked;

  const cancelState: ButtonState = "default";
  const draftState: ButtonState =
    studentValid && passwordValid && consentOk ? "default" : "unactive";
  const submitState: ButtonState =
    requiredFilled && studentValid && passwordValid && consentOk
      ? "default"
      : "unactive";

  return (
    <section
      className={[
        styles.wrapper,
        isSurvey ? styles.bgDark : styles.bgResult,
      ].join(" ")}
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
          <p
            className={[
              styles.subtitle,
              isResult ? styles.subtitleBlack : "",
            ].join(" ")}
          >
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
              : studentStatus === "valid" && !isLoaded 
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
                      if (mode === "view") return;

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
                      setFocusedFields((prev) => ({
                        ...prev,
                        [item.id]: false,
                      }));
                      handleBlur(item.id, safeAllQuestions);
                    }}
                  />

                  <div className={styles.fileBottomRow}>
                    <div>
                      {errors[item.id] && (
                        <div
                          className={[
                            styles.errorText,
                            styles.fileErrorText,
                          ].join(" ")}
                        >
                          {errors[item.id]}
                        </div>
                      )}
                      {success[item.id] && !errors[item.id] && (
                        <div
                          className={[
                            styles.successText,
                            styles.fileErrorText,
                          ].join(" ")}
                        >
                          {success[item.id]}
                        </div>
                      )}
                    </div>

                    <div className={styles.fileButtons}>
                      {files[item.id] && (
                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() => handleFileDelete(item.id)}
                          disabled={mode === "view"}
                        >
                          파일 삭제하기
                        </button>
                      )}

                      {(() => {
                        const url = (item.fileLink || answers[item.id] || "").trim();
                        const canOpen = mode === "view" && !!url;
                        const label =
                          mode === "view"
                            ? isHttpUrl(url)
                              ? "링크 열기"
                              : "파일 열기"
                            : files[item.id]
                            ? "파일 변경하기"
                            : "파일 업로드";

                        return (
                          <button
                            type="button"
                            className={styles.uploadButton}
                            onClick={() => {
                              if (mode === "view") {
                                if (!url) return;
                                if (onFileDownload) {
                                  onFileDownload(url, item.question);
                                  return;
                                }
                                openInNewTab(url);
                                return;
                              }
                              handleFileUpload(item.id);
                            }}
                            disabled={mode === "view" ? !canOpen : false}
                          >
                            {label}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    data-autosize="1"
                    id={`field-${item.id}`}
                    className={[
                      styles.input,
                      isSurvey ? styles.inputDark : styles.inputLight,
                      inputStateClass,
                    ].join(" ")}
                    value={answers[item.id] || ""}
                    placeholder={placeholderText}
                    readOnly={mode === "view" || (isLoaded && (isStudentField || isPasswordField))}
                    rows={1}
                    style={{ resize: "none", overflow: "hidden" }}
                    onFocus={() =>
                      setFocusedFields((prev) => ({ ...prev, [item.id]: true }))
                    }
                    onBlur={() => {
                      setFocusedFields((prev) => ({
                        ...prev,
                        [item.id]: false,
                      }));
                      handleBlur(item.id, safeAllQuestions);
                    }}
                    onChange={(e) => {
                      if (mode === "view") return;

                      const value = e.target.value;
                      setAnswers((prev) => ({ ...prev, [item.id]: value }));
                      onChange?.(item.id, value);

                      const textarea = e.target;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;

                      if (!isStudentField && !isPasswordField && value.trim() !== "") {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next[item.id];
                          return next;
                        });
                      }

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
                            [PASSWORD_ID]:
                              "형식이 다릅니다. 숫자 4자리를 입력하세요.",
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

                  {mode !== "view" && isStudentField ? (
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
                        (!isLoaded && studentStatus ? studentMessages[studentStatus] : "")}
                    </div>
                  ) : mode !== "view" ? (
                    <>
                      {errors[item.id] && (
                        <div className={styles.errorText}>{errors[item.id]}</div>
                      )}
                      {success[item.id] && !errors[item.id] && (
                        <div className={styles.successText}>
                          {success[item.id]}
                        </div>
                      )}
                    </>
                  ) : null}
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
                필수 항목 : 이름, 학번, 전화번호, 이메일 주소, 학과(본전공, 복수전공),
                본인확인용 비밀번호
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
                수집된 개인정보는 지원 기간 종료 및 선발 완료 후 6개월간 보관하며, 이후
                지체 없이 파기합니다.
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
                필수 항목에 대한 동의를 거부하실 경우, 지원 및 심사 대상에서 제외될 수
                있습니다.
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
                  작성 중인 지원서의 <span className={styles.highlight}>‘작성 취소’</span>를
                  누른 후, <br />
                  변경하고 싶은 트랙을 선택하여 지원서를 다시 작성해 주세요. <br />
                  내용은 <span className={styles.highlight}>자동 저장되지 않으므로</span>{" "}
                  복사/붙여넣기를 권장 드립니다.
                </p>
              </div>
            </div>

            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>제출한 지원서를 수정할 수 있나요?</p>
                <p className={styles.noticeTextDetail}>
                  1차 서류 모집 기간 내에 한하여{" "}
                  <span className={styles.highlight}>수정 가능</span> 합니다.{" "}
                  <span className={styles.highlight}>학번과 본인 확인용 비밀번호</span>를
                  입력 후, <br />
                  최종 제출 또는 임시 저장한 지원서를 다시 수정할 수 있습니다.
                  <br />
                  <br />
                  1차 서류 모집 기간이 끝나면, 지원서 수정 및 열람은{" "}
                  <span className={styles.highlight}>불가능</span> 합니다.
                </p>
              </div>
            </div>

            <div className={styles.noticeItem}>
              <img src={noticeIcon} alt="" className={styles.noticeIcon} />
              <div className={styles.noticeTextGroup}>
                <p className={styles.noticeText}>여러 트랙의 지원서를 제출 할 수 있나요?</p>
                <p className={styles.noticeTextDetail}>
                  본 모집은 <span className={styles.highlight}>1인당 1개의 트랙에 한하여</span>{" "}
                  1회만 지원 가능합니다.
                </p>
              </div>
            </div>
          </div>

          {enableActions && (
            <ApplyFormActions
              cancelState={cancelState}
              draftState={_isDrafting ? "unactive" : draftState}
              submitState={_isSubmitting ? "unactive" : submitState}
              hasInput={hasAnyChange}
              onDraftSave={handleDraftSave}
              onSubmit={handleSubmit}
              onCancelConfirmed={() => (window.location.href = "/")}
              dbStatus={
                studentStatus === "draft-exists" || studentStatus === "submitted-exists"
                  ? studentStatus
                  : "none"
              }
            />
          )}
        </section>
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
              지원서 작성을 취소하고, 페이지를 나갈까요?
              <br />
              작성된 내용은 저장되지 않습니다.
            </span>
          }
          primaryButton={{
            text: "나가기",
            onClick: () => {
              allowNavigation();
              setModalOpen(false);
              window.history.back();
            },
          }}
          secondaryButton={{
            text: "지원서로 돌아가기",
            onClick: () => setModalOpen(false),
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {isDraftOverwriteOpen && (
        <Modal
          isOpen={isDraftOverwriteOpen}
          title="이미 작성한 지원서가 있습니다."
          description={
            <span>
              임시저장 했던 다른 지원서가 있습니다.
              <br />
              이전 지원서는 삭제하고,
              <br />
              <span style={{ color: "#FF7710" }}>현재 지원서로 덮어쓸까요?</span>{" "}
            </span>
          }
          extraText={
            <span>
              현재 작성한 지원서는 <span style={{ color: "#FF7710" }}>임시저장 </span>
              상태로 저장됩니다.
            </span>
          }
          primaryButton={{ text: "덮어쓰기", onClick: executeDraftOverwrite }}
          secondaryButton={{
            text: "취소",
            onClick: () => {
              setIsDraftOverwriteOpen(false);
              setIsCancelConfirmOpen(true);
            },
          }}
          onClose={() => setIsDraftOverwriteOpen(false)}
        />
      )}

      {isSubmitFromDraftOpen && (
        <Modal
          isOpen={isSubmitFromDraftOpen}
          title="이미 작성한 지원서가 있습니다."
          description={
            <span>
              임시저장 했던 다른 지원서가 있습니다.
              <br />
              이전 지원서는 삭제하고,
              <br />
              <span style={{ color: "#FF7710" }}>현재 지원서로 덮어쓸까요?</span>{" "}
            </span>
          }
          extraText={
            <span>
              현재 작성한 지원서는 <span style={{ color: "#FF7710" }}>최종제출 </span>
              상태로 저장됩니다.
            </span>
          }
          primaryButton={{ text: "덮어쓰기", onClick: executeSubmitOverwrite }}
          secondaryButton={{
            text: "취소",
            onClick: () => {
              setIsSubmitFromDraftOpen(false);
              setIsCancelConfirmOpen(true);
            },
          }}
          onClose={() => setIsSubmitFromDraftOpen(false)}
        />
      )}

      {isDraftFromSubmittedOpen && (
        <Modal
          isOpen={isDraftFromSubmittedOpen}
          title="이미 작성한 지원서가 있습니다."
          description={
            <span>
              최종제출 했던 다른 지원서가 있습니다.
              <br />
              이전 지원서는 삭제하고,
              <br />
              <span style={{ color: "#FF7710" }}>현재 지원서로 덮어쓸까요?</span>{" "}
            </span>
          }
          extraText={
            <span>
              현재 작성한 지원서는 <span style={{ color: "#FF7710" }}>임시저장 </span>
              상태로 저장됩니다.
            </span>
          }
          primaryButton={{ text: "덮어쓰기", onClick: executeDraftOverwrite }}
          secondaryButton={{
            text: "취소",
            onClick: () => {
              setIsDraftFromSubmittedOpen(false);
              setIsCancelConfirmOpen(true);
            },
          }}
          onClose={() => setIsDraftFromSubmittedOpen(false)}
        />
      )}

      {isSubmitOverwriteOpen && (
        <Modal
          isOpen={isSubmitOverwriteOpen}
          title="이미 작성한 지원서가 있습니다."
          description={
            <span>
              최종제출 했던 다른 지원서가 있습니다.
              <br />
              이전 지원서는 삭제하고,
              <br />
              <span style={{ color: "#FF7710" }}>현재 지원서로 덮어쓸까요?</span>{" "}
            </span>
          }
          extraText={
            <span>
              현재 작성한 지원서는 <span style={{ color: "#FF7710" }}>최종제출 </span>
              상태로 저장됩니다.
            </span>
          }
          primaryButton={{ text: "덮어쓰기", onClick: executeSubmitOverwrite }}
          secondaryButton={{
            text: "취소",
            onClick: () => {
              setIsSubmitOverwriteOpen(false);
              setIsCancelConfirmOpen(true);
            },
          }}
          onClose={() => setIsSubmitOverwriteOpen(false)}
        />
      )}

      {isCancelConfirmOpen && (
        <Modal
          isOpen={isCancelConfirmOpen}
          title="덮어쓰기가 취소되었습니다."
          description="작성하고 있던 지원폼으로 돌아갑니다."
          primaryButton={{
            text: "확인",
            onClick: () => {
              setIsCancelConfirmOpen(false);
              setCancelTargetModal(null);
              setIsCancelFlow(false);
            },
          }}
        />
      )}

      {isSubmitSuccessOpen && (
        <Modal
          isOpen={isSubmitSuccessOpen}
          title="지원해주셔서 감사합니다!"
          extraText="지원서가 정상적으로 접수되었습니다."
          primaryButton={{
            text: "확인",
            onClick: () => {
              setIsSubmitSuccessOpen(false);
              window.location.href = "/";
            },
          }}
          onClose={() => setIsSubmitSuccessOpen(false)}
        />
      )}

      {isDraftSuccessOpen && (
        <Modal
          isOpen={isDraftSuccessOpen}
          title="지원서가 임시 저장되었습니다"
          extraText={
            <span>
              저장된 지원서는
              <br />
              3월 2일 23시 59분 까지
              <br />
              열람 및 수정이 가능합니다.
            </span>
          }
          primaryButton={{
            text: "확인",
            onClick: () => {
              setIsDraftSuccessOpen(false);
              window.location.href = "/";
            },
          }}
          onClose={() => setIsDraftSuccessOpen(false)}
        />
      )}
      {/* 로딩 모달 추가 */}
      {isLoadingOpen && (
        <Modal
          isOpen={isLoadingOpen}
          title="처리 중입니다..."
          description={
            <span>
              잠시만 기다려 주세요.
              <br />
              지원서를 제출하고 있습니다.
            </span>
          }
          onClose={() => {}}
        />
      )}
    </section>
  );
}
