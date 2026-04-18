import initTest from "./controllers/quizController.js";
import initAttempt from "./controllers/attemptController.js";
import initWelcome from "./controllers/welcomeController.js";
import initDashboard from "./controllers/dashboardController.js";
import {initGeneralComponentsListening} from "./controllers/generalLayoutController.js";
import initCreateTest from "./controllers/createQuizController.js";
import initEditTest from "./controllers/editQuizController.js";
import { initAuth } from "./controllers/authController.js";
import initQuizSummary from "./controllers/summaryQuizController.js";
import {refreshAccess} from "./services/quizService.js";
import updateDashboardButton from "./ui/globalDashboardButton.js";
import initAdmin from "./controllers/adminController.js";

export default async function initView(view, code = null, data = null) {
    await updateDashboardButton();
    switch(view) {
        case "welcome":
            initWelcome();
            break;
        case "attempt":
            initAttempt(code);
            break;
        case "test":
            initTest(code);
            break;
        case "dashboard":
            initDashboard(data);
            break;
        case "create-test":
            initCreateTest();
            break;
        case "edit-test":
            await initEditTest(code);
            break;
        case "auth-forms":
            initAuth();
            break;
        case "summary":
            initQuizSummary(code);
            break;
        case "admin":
            initAdmin();
            break;
        default:
            break;
    }
}

async function start() {
    await refreshAccess();
    await initGeneralComponentsListening()
    let view = document.querySelector("main").dataset.view;
    initView(view);
}
await start();
