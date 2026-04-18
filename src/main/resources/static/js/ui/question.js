
export function renderQuestion(q) {
    const question = document.querySelector(".question p");
    question.textContent = q.value;
    question.dataset.id = q.id;

    const options = document.querySelector(".options");
    const multipleAnswers = hasMultipleCorrectAnswers(q);
    options.dataset.multiple = String(multipleAnswers);
    options.innerHTML = "";

    const answerMode = document.getElementById("answer-mode");
    if (answerMode)
        answerMode.textContent = multipleAnswers ? "Choose all correct answers" : "Choose one answer";

    for (let i = 0; i < q.answers.length; i++) {
        const button = document.createElement("button");
        button.classList.add("option");
        button.dataset.value = q.answers[i].id;
        button.textContent = q.answers[i].value;
        options.appendChild(button);
    }
}

export function selectQuestion(options, e) {
    const selected = e.target.closest("button.option");
    if (!selected) return;

    if (options.dataset.multiple === "true") {
        selected.classList.toggle("selected");
        return;
    }

    const previousSelected = options.querySelectorAll("button.selected");
    previousSelected.forEach(element => element.classList.remove("selected"));
    selected.classList.add("selected");
}

export function updateNextButton(button, current, total) {
    if (current < total - 1) button.textContent = "Next";
    else button.textContent = "Finish";
}

function hasMultipleCorrectAnswers(question) {
    let correctAnswers = 0;
    question.answers.forEach(answer => {
        if (answer.correct)
            correctAnswers++;
    });

    return correctAnswers > 1;
}