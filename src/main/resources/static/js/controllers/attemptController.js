import {codeValidation} from "../validators/codeValidator.js";
import {fetchQuizInfo} from "../services/quizService.js";
import generateAttemptView from "../views/attemptView.js";
import initView from "../router.js";
import generateError from "../ui/errorBar.js";

export default async function initAttempt(code) {
    if(!codeValidation(code)) return -1;

    const quizInfo = await fetchQuizInfo(code);
    if(!quizInfo) {
        generateError("Test with such code doesn't exist");
        return -1;
    }
    generateAttemptView(quizInfo);

    document.getElementsByClassName("cancel-btn")[0].addEventListener("click", () => {
        initView("welcome");
    });

    document.getElementsByClassName("enter-btn")[0].addEventListener("click", () => {
        initView("test", code);
    });
}
