
export function generateError(message) {
    const errorBar = document.getElementsByClassName("error-mess-global")[0];
    errorBar.style.display = "block";
    errorBar.textContent = message;

    setTimeout(() => {
        errorBar.style.display = "none";
    }, 2000);
}