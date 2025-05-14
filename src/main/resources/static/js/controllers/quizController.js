
import { fetchQuizInfo } from "../services/quizService.js";
import {initView} from "../main.js";
import {codeValidation} from "../validators/codeValidator.js";
import generateAttemptView from "../views/attemptView.js";
import generateWelcomeView from "../views/welcomeView.js";

export function initWelcome() {
    generateWelcomeView();

    document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    });
}

export function initAttempt(code) {
    if(!codeValidation(code.trim())) return -1;

    const quizInfo = fetchQuizInfo();
    generateAttemptView(quizInfo);

    document.getElementsByClassName("cancel-btn")[0].addEventListener("click", () => {
        initView("welcome");
    });

    document.getElementsByClassName("enter-btn")[0].addEventListener("click", () => {
        initView("test");
    });
}

export function initTest() {

}