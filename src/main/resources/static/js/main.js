import {initAttempt, initTest, initWelcome} from "./controllers/quizController.js";

let view = document.querySelector("main").dataset.view;
initView(view);

export function initView(view, data = null) {
    switch(view) {
        case "welcome":
            initWelcome();
            console.log("welcome view");
            break;
        case "attempt":
            initAttempt(data);
            console.log("attempt view");
            break;
        case "test":
            initTest();
            console.log("test view");
            break;
        default:
            console.log("Unknown view");
            break;
    }
}