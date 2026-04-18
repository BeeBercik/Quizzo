import initDashboardView from "../views/dashboardView.js";
import {deleteQuiz, getLoggedUserData, logoutUser} from "../services/quizService.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";
import {generateError, generateSuccess} from "../ui/globalMessageBar.js";

export default async function initDashboard(userData) {
    userData == null ? userData = await getLoggedUserData() : '';

    if (userData == null) {
        generateError("You are not logged in");
        return 0;
    }
    initDashboardView(userData);

    document.getElementById("logout-btn").addEventListener("click", async function(e) {
        e.preventDefault();
        if (await logoutUser())
            generateSuccess("Logged out");
        else
            generateError("Error while trying to logout");
        initView("welcome");
    });

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        const code = document.querySelector("form .code").value.trim();
        if (!codeValidation(code)) return -1;
        initView("attempt", code);
    });

    document.getElementById("create-test").addEventListener("click", function(e) {
        e.preventDefault();
        initView("create-test");
    });

    const adminPanelButton = document.getElementById("admin-panel");
    if (adminPanelButton) {
        adminPanelButton.addEventListener("click", function(e) {
            e.preventDefault();
            initView("admin");
        });
    }

    const tbody = document.querySelector('#createdTests tbody');
    tbody.addEventListener('click', async (e) => {
        const tdDelete = e.target.closest('.q-delete');
        if (tdDelete) await initDeleteQuiz(tdDelete)

        const tdEdit = e.target.closest('.q-edit');
        if (tdEdit) {
            const code = getQuizCode(tdEdit);
            initView('edit-test', code);
        }

        const tdSummary = e.target.closest('.q-summary');
        if (tdSummary) {
            const code = getQuizCode(tdSummary);
            initView('summary', code);
        }
    });
}

async function initDeleteQuiz(tdDelete) {
    const row = tdDelete.closest('tr');
    const code = row.querySelector('.code-td').textContent.trim().toUpperCase();
    if (!code) return;

    if (await deleteQuiz(code)) {
        initView('dashboard');
        generateSuccess("Quiz deleted");
    } else
        generateError('This specific quiz cannot be removed');
}

function getQuizCode(tdElement) {
    const row = tdElement.closest('tr');
    const code = row.querySelector('.code-td').textContent.trim().toUpperCase();
    if (!code) return;

    return code;
}
