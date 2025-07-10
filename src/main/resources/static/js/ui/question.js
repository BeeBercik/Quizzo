
export function renderQuestion(q) {
    const question = document.querySelector(".question p");
    question.textContent = q.question;

    const options = document.querySelector(".options");
    options.innerHTML = "";
    for (let i = 0; i < q.answers.length; i++) {
        const button = document.createElement("button");
        button.classList.add("option");
        button.dataset.value =q.answers[i].id;
        button.textContent = q.answers[i].value;
        options.appendChild(button);
    }
}

export function selectQuestion(options, e) {
    const previousSelected = options.querySelectorAll("button.selected");
    for(const element of previousSelected) {
        element.classList.remove("selected");
    }
    e.target.classList.add("selected");
}

export function updateNextButton(button, current, total) {
    if(current < total - 1) button.textContent = "Next";
    else button.textContent = "Finish";
}