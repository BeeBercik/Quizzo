import generateAuthView from "../views/authView.js";
import {sendLoginData, sendRegisterData} from "../services/quizService.js";
import {generateError, generateSuccess} from "../ui/globalMessageBar.js";
import initView from "../router.js";


export function initAuth() {
    generateAuthView();

    const loginFormLogin = document.getElementById("login-login");
    const loginFormPassword = document.getElementById("login-password");

    const registerFormLogin = document.getElementById("register-login");
    const registerFormPassword = document.getElementById("register-password");
    const registerFormEmail = document.getElementById("register-email");

    let authData = {};

    document.getElementById("login-form").addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!loginFormLogin.value ||
            !loginFormPassword.value) {
            generateError("Login data cannot be empty");
            return;
        }

        authData = {
            login: loginFormLogin.value,
            password: loginFormPassword.value
        };

        const userData = await sendLoginData(authData);
        if (userData === null)
            generateError("Incorrect login data");
        else {
            initView("dashboard", null, userData);
            generateSuccess("Logged in");
        }
    });

    document.getElementById("register-form").addEventListener("submit", async function(e) {
        e.preventDefault();

        if (!registerFormLogin.value ||
            !registerFormPassword.value ||
            !registerFormEmail.value) {
            generateError("Register data cannot be empty");
            return;
        }

        authData = {
            login: registerFormLogin.value,
            password: registerFormPassword.value,
            email: registerFormEmail.value
        };

        const result = await sendRegisterData(authData);
        if (result.status === 200) {
            generateSuccess("Success! Now log-in");
            document.getElementById("register-form").reset();
            document.getElementById("login-login").focus();
        }
        else if(result.status === 409)
            generateError("Login or email already taken");
        else
            generateError("Invalid registration data");
    });
}