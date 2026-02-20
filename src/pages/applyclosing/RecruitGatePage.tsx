import { getRecruitState } from "@/utils/getRecruitState";

import ApplyPage from "@/pages/apply/ApplyPage";
import BeforeResultPage from "@/pages/applyclosing/BeforeResultPage";
import ResultCheckPage from "@/pages/applyclosing/ResultCheckPage";
import ApplyEndPage from "@/pages/applyclosing/ApplyEndPage";
import RecruitClosingPage from "@/pages/applyclosing/RecruitClosingPage";

const RecruitGatePage = () => {
  const state = getRecruitState();

  switch (state) {
    case "APPLY":
    return <ApplyPage />;
    
    case "DOCUMENT":
      return <ApplyEndPage />;

    case "FIRST_PASSED":
    case "FINAL_PASSED":
      return <ResultCheckPage />;

    case "INTERVIEW":
      return <BeforeResultPage />;

    default:
      return <RecruitClosingPage />;
  }
};

export default RecruitGatePage;