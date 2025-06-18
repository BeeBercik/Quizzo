import initView from "../router.js";

export function initGeneralComponentsListening() {
    document.getElementById("dashboard-btn").addEventListener("click", function(e) {
        e.preventDefault();
        initView("dashboard");
    });

    document.getElementById("welcome-btn").addEventListener("click", function(e) {
        e.preventDefault();
        initView("welcome");
    });
}
