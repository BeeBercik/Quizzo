import {getAnswerCorrectness} from "../services/quizService.js";
import {generateError} from "./globalMessageBar.js";

export default async function eliminateOption(testDetails, options, eliminated) {
    let random;
    let answerId;
    const checkedOptions = [];

    while (true) {
        do {
            random = Math.floor(Math.random() * options.length);
        } while (eliminated.includes(random) || checkedOptions.includes(random));

        checkedOptions.push(random);

        answerId = options[random].dataset.value;
        const result = await getAnswerCorrectness(answerId);

        if (result === null) {
            generateError('Error during option elimination');
            return;
        }

        if (result === false)
            break;

        if ((checkedOptions.length + eliminated.length) >= options.length) {
            generateError("Cannot eliminate more bad answers");
            return;
        }
    }

    eliminated.push(random);
    options[random].classList.remove("selected");
    options[random].classList.add("eliminated-option");
    options[random].disabled = true;

    const eliminations = document.getElementById("eliminations");
    testDetails.eliminationsCount--;
    eliminations.textContent = testDetails.eliminationsCount;
}