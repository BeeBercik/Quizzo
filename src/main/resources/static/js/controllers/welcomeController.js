import generateWelcomeView from "../views/welcomeView.js";
import {codeValidation} from "../validators/codeValidator.js";
import initView from "../router.js";

export default function initWelcome() {
    generateWelcomeView();

    document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
        e.preventDefault();
        const code = document.getElementById("code").value.trim();
        if(!codeValidation(code)) return -1;
        initView("attempt", code);
    });
}