import initDashboardView from "../views/dashboardView.js";
import {getUserTests} from "../services/quizService.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";

export default function initDashboard() {
    const userid = 69;
    const userTests = getUserTests(userid);
    initDashboardView(userTests);

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        const code = document.querySelector("form .code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    })
}