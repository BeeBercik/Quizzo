import {initAttempt, initTest, initWelcome} from "./controllers/quizController.js";

let view = document.querySelector("main").dataset.view;
initView(view);

export default function initView(view, code = null) {
    switch(view) {
        case "welcome":
            initWelcome();
            console.log("welcome view");
            break;
        case "attempt":
            initAttempt(code);
            console.log("attempt view");
            break;
        case "test":
            initTest(code);
            console.log("test view");
            break;
        default:
            console.log("Unknown view");
            break;
    }
}