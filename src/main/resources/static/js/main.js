import { initAttempt } from "./controllers/quizController.js";

let view = document.querySelector("main").dataset.view;
initView(view);

export function initView(view) {
    switch(view) {
        case "welcome":
            prepareAttempt();
            break;
        case "attempt":
            //...
            console.log("attempt");
            break;
        case "test":
            console.log("test");
            break;
        default:
            console.log("Unknown view");
            break;
    }
}

function prepareAttempt() {
    document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("code").value;
        initAttempt(code);
    });
}