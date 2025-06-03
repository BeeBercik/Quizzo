import initTest from "./controllers/testController.js";
import initAttempt from "./controllers/attemptController.js";
import initWelcome from "./controllers/welcomeController.js";

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
let view = document.querySelector("main").dataset.view;
initView(view);