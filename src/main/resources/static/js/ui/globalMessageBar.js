
export function generateError(message) {
    const messageBar = document.getElementsByClassName("global-message-bar")[0];
    messageBar.style.display = "block";
    messageBar.style.backgroundColor = "#ad0205";
    messageBar.textContent = message;

    setTimeout(() => {
        messageBar.style.display = "none";
    }, 2500);
}

export function generateSuccess(message) {
    const messageBar = document.getElementsByClassName("global-message-bar")[0];
    messageBar.style.display = "block";
    messageBar.style.backgroundColor = "#00cc45";
    messageBar.textContent = message;

    setTimeout(() => {
        messageBar.style.display = "none";
    }, 2500);
}