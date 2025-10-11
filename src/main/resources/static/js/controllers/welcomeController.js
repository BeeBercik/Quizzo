import generateWelcomeView from "../views/welcomeView.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";
import {getLoggedUserData} from "../services/quizService.js";
import {generateError} from "../ui/globalMessageBar.js";

export default async function initWelcome() {
    const isUserLogged = await getLoggedUserData() != null;
    generateWelcomeView(isUserLogged);
    if(!isUserLogged)
        document.getElementById('dashboard-btn').textContent = "User's dashboard";

    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();

        const code = document.querySelector("form .code").value.trim();

        if(!codeValidation(code))
            return 0;
        else if(!isUserLogged) {
            generateError("You are not logged in");
            return 0;
        }

        initView("attempt", code);
    });

    if(!isUserLogged) {
        document.getElementById("auth-forms").addEventListener("click", async function() {
            initView("auth-forms");
        });
    }
}