import initTest from "./controllers/quizController.js";
import initAttempt from "./controllers/attemptController.js";
import initWelcome from "./controllers/welcomeController.js";
import initDashboard from "./controllers/dashboardController.js";
import {initGeneralComponentsListening} from "./controllers/generalLayoutController.js";
import initCreateTest from "./controllers/createQuizController.js";

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
        case "dashboard":
            initDashboard();
            console.log("dashboard view");
            break;
        case "create-test":
            initCreateTest();
            console.log("create-test view");
            break;
        default:
            console.log("Unknown view");
            break;
    }
}

initGeneralComponentsListening();
let view = document.querySelector("main").dataset.view;
initView(view);

