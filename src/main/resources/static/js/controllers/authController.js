import generateAuthView from "../views/authView.js";
import {sendLoginData, sendRegisterData} from "../services/quizService.js";
import generateError from "../ui/errorBar.js";
import initView from "../router";


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

        authData = {
            login: loginFormLogin.value,
            password: loginFormPassword.value
        };

        const userData = await sendLoginData(authData);
        if(userData === null) generateError("Incorrect login data");
        else initView("dashboard", null, userData);
    });

    document.getElementById("register-form").addEventListener("submit", function(e) {
        e.preventDefault();
        authData = {
            login: registerFormLogin.value,
            password: registerFormPassword.value,
            email: registerFormEmail.value
        };
        sendRegisterData(authData);
    });
}