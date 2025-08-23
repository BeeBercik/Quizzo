import initDashboardView from "../views/dashboardView.js";
import {deleteQuiz, getLoggedUserData} from "../services/quizService.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";
import generateError from "../ui/errorBar.js";

export default async function initDashboard(userData) {
    userData == null ? userData = await getLoggedUserData() : '';

    if (userData == null) {
        generateError("You are not logged in");
        return 0;
    }

    document.getElementById('dashboard-btn').textContent = `${userData.login}'s panel`;
    initDashboardView(userData);

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        const code = document.querySelector("form .code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    });

    document.getElementById("create-test").addEventListener("click", function(e) {
        e.preventDefault();
        initView("create-test");
    });

    const tbody = document.querySelector('#createdTests tbody');
    tbody.addEventListener('click', async (e) => {
        const tdDelete = e.target.closest('.q-delete');
        if(!tdDelete) return;

        const row = tdDelete.closest('tr');
        const code = row.querySelector('.code-td').textContent.trim().toUpperCase();
        if(!code) return;

        await deleteQuiz(code);
    });
}