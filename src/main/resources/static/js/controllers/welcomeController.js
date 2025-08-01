import generateWelcomeView from "../views/welcomeView.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";

export default function initWelcome() {
    generateWelcomeView();

    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.querySelector("form .code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    });

    document.getElementById("auth-forms").addEventListener("click", function() {
        initView("auth-forms");
    });
}