
import { fetchQuizInfo } from "../services/quizService.js";
import {initView} from "../main.js";
import {codeValidation} from "../validators/codeValidator.js";

export function initAttempt(code) {
    if(!codeValidation(code.trim())) return -1;

    const main = document.getElementsByTagName("main")[0];
    main.id = "attempt-main";
    main.dataset.view = "attempt";

    const quizInfo = fetchQuizInfo();
    main.innerHTML =
        `
        <h2>Take a test</h2>
        <div class="info">
            <h3>${quizInfo.name}</h3>

            <div class="details">
                <p>
                    <span>Questions:</span>${quizInfo.questions}
                </p>
                <p>
                    <span>Time:</span>${quizInfo.questions} [min]
                </p>
                <p>
                    <span>Bad options elimination:</span>${quizInfo.elimination ? "Yes" : "No"} </p>
            </div>

            <p class="description">Test / quiz contains single-choice questions. There is no possibility to go back to a previous question. The timer starts as soon as the test begins. Good luck!</p>

            <section class="actions">
                <button class="cancel-btn">Cancel</button>
                <button class="enter-btn">Enter</button>
            </section>
    `;

    initView("attempt");
}