
export function generateError(message) {
    const errorBar = document.getElementsByClassName("error-mess-global")[0];
    errorBar.style.display = "block";
    errorBar.textContent = message;

    setTimeout(() => {
        errorBar.style.display = "none";
    }, 2000);
}

export function renderQuestion(q) {
    const question = document.querySelector(".question p");
    question.textContent = q.question;

    const options = document.querySelector(".options");
    options.innerHTML = "";
    for (const key in q.answers) {
        const button = document.createElement("button");
        button.classList.add("option");
        button.dataset.value = key;
        button.textContent = q.answers[key];
        options.appendChild(button);
    }
}

export function eliminateOption() {

}