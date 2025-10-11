import {getAnswerCorrectness} from "../services/quizService.js";
import {generateError} from "./globalMessageBar.js";

export default async function eliminateOption(testDetails, options, eliminated) {
    let random;
    let answerId;

    while(true) {
        do {
            random = Math.floor(Math.random() * options.length);
        } while(eliminated.includes(random));

        answerId = options[random].dataset.value;
        const result = await getAnswerCorrectness(answerId);

        if(result === null)
            generateError('Error during option elimination');

        if(result === false)
            break;
    }

    eliminated.push(random);
    options[random].classList.remove("selected");
    options[random].classList.add("eliminated-option");
    options[random].disabled = true;

    const eliminations = document.getElementById("eliminations");
    testDetails.eliminationsCount--;
    eliminations.textContent = testDetails.eliminationsCount;
}