import {getAnswerCorrectness} from "../services/quizService.js";

export default async function eliminateOption(testDetails, options, eliminated) {
    let random;
    let answerId;
    do {
        random = Math.floor(Math.random() * options.length);
        answerId = options[random].dataset.value;
    } while(eliminated.includes(random) || await getAnswerCorrectness(answerId));

    eliminated.push(random);
    options[random].classList.remove("selected");
    options[random].classList.add("eliminated-option");
    options[random].disabled = true;

    const eliminations = document.getElementById("eliminations");
    testDetails.eliminationsCount--;
    eliminations.textContent = testDetails.eliminationsCount;
}