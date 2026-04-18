import {
    activateAdminQuiz,
    activateAdminUser,
    deactivateAdminQuiz,
    deactivateAdminUser,
    getAdminQuizzes,
    getLoggedUserData,
    getAdminUsers,
    updateAdminUserRole
} from "../services/quizService.js";
import generateAdminView from "../views/adminView.js";
import {generateError, generateSuccess} from "../ui/globalMessageBar.js";
import initView from "../router.js";

export default async function initAdmin() {
    const currentUser = await getLoggedUserData();
    const users = await getAdminUsers();
    const quizzes = await getAdminQuizzes();

    if (currentUser === null || users === null || quizzes === null) {
        generateError("You cannot access admin panel");
        initView("dashboard");
        return;
    }

    generateAdminView(users, quizzes, currentUser.id);

    document.getElementById("admin-users").addEventListener("change", async function(e) {
        const roleSelect = e.target.closest(".role-select");
        if (!roleSelect) return;

        const row = roleSelect.closest("tr");
        const success = await updateAdminUserRole(row.dataset.userId, roleSelect.value);

        if (success)
            generateSuccess("Role updated");
        else
            generateError("Cannot update role");
    });

    document.getElementById("admin-users").addEventListener("click", async function(e) {
        const toggleButton = e.target.closest(".toggle-user-status-btn");
        if (!toggleButton) return;

        const row = toggleButton.closest("tr");
        const userIsActive = toggleButton.dataset.active === "true";
        let success;

        if (userIsActive)
            success = await deactivateAdminUser(row.dataset.userId);
        else
            success = await activateAdminUser(row.dataset.userId);

        if (success) {
            generateSuccess(userIsActive ? "User deactivated" : "User activated");
            initAdmin();
        } else
            generateError("Cannot update user status");
    });

    document.getElementById("admin-quizzes").addEventListener("click", async function(e) {
        const toggleButton = e.target.closest(".toggle-quiz-status-btn");
        if (!toggleButton) return;

        const row = toggleButton.closest("tr");
        const quizIsActive = toggleButton.dataset.active === "true";
        let success;

        if (quizIsActive)
            success = await deactivateAdminQuiz(row.dataset.code);
        else
            success = await activateAdminQuiz(row.dataset.code);

        if (success) {
            generateSuccess(quizIsActive ? "Quiz deactivated" : "Quiz activated");
            initAdmin();
        } else
            generateError("Cannot update quiz status");
    });
}
