
export function generateError(message) {
    const errorBar = document.getElementsByClassName("error-mess-global")[0];
    errorBar.style.display = "block";
    errorBar.textContent = message;

    setTimeout(() => {
        errorBar.style.display = "none";
    }, 2500);
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

export function eliminateOption(testDetails, optionsContainer, eliminated) {
    if(testDetails.eliminationsCount < 1) {
        generateError("You do not have any eliminations left");
        return;
    }
    const options = optionsContainer.querySelectorAll(".option")

    if(eliminated.length === options.length - 1) {
        generateError("You cannot eliminate all answers");
        return;
    }

    let random;
    do {
        random = Math.floor(Math.random() * options.length);
    } while(eliminated.includes(random));

    eliminated.push(random);
    options[random].classList.remove("selected");
    options[random].classList.add("eliminated-option");
    options[random].disabled = true;

    console.log(random);
    const eliminations = document.getElementById("eliminations");
    testDetails.eliminationsCount--;
    eliminations.textContent = testDetails.eliminationsCount;
}