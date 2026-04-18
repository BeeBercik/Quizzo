import {getQuiz, sendAnswers} from "../services/quizService.js";
import {renderQuestion, selectQuestion, updateNextButton} from "../ui/question.js";
import generateTestView from "../views/quizView.js";
import {generateError} from "../ui/globalMessageBar.js";
import startTimer from "../core/timer.js";
import eliminateOption from "../ui/optionEliminator.js";
import initView from "../router.js";

export default async function initTest(code) {
    const testDetails = await getQuiz(code);
    if (!testDetails) {
        generateError("Test with such code doesn't exist");
        return -1;
    }
    generateTestView(testDetails);

    const attempt = {
        quizId: testDetails.id,
        answers: []
    };
    const nextButton = document.getElementById("next-btn");
    const questionCount = testDetails.questions.length;
    const optionsContainer = document.querySelector(".options");
    const eliminated = [];
    let currentQuestion = 0;

    renderQuestion(testDetails.questions[currentQuestion]);
    updateNextButton(nextButton, currentQuestion, questionCount);

    async function timeUp() {
        if (await sendAnswers(attempt))
            initView("dashboard");
        else {
            generateError('Error during submitting quiz');
            return;
        }
        initView("dashboard");
    }
    const timeLabel = document.getElementById("time");
    const stopTimer = startTimer(testDetails.durationTime * 60, timeLabel, timeUp);

    optionsContainer.addEventListener("click", function(e) {
        e.preventDefault();
        const selected = e.target.closest("button.option");
        if (!selected || selected.disabled) return;
        selectQuestion(optionsContainer, e);
    });

    nextButton.addEventListener("click", async function(e) {
        e.preventDefault();
        const savedAnswers = saveAnswer(attempt);
        if (!savedAnswers)
            return currentQuestion;

        if (currentQuestion < questionCount - 1) {
            currentQuestion++;
            eliminated.length = 0;
            renderQuestion(testDetails.questions[currentQuestion]);
            updateNextButton(nextButton, currentQuestion, questionCount);
        } else {
            stopTimer();
            if (await sendAnswers(attempt))
                initView("dashboard");
            else
                generateError('Error during submitting quiz');
        }
    });

    document.getElementById("eliminate-option").addEventListener("click", function() {
        const options = document.querySelectorAll(".options .option");

        if (testDetails.eliminationsCount < 1) {
            generateError("You do not have any eliminations left");
            return;
        }
        const badOptionsCount = testDetails.questions[currentQuestion].answers
            .filter(answer => answer.correct === false).length;
        if (eliminated.length >= badOptionsCount) {
            generateError("Cannot eliminate more bad answers");
            return;
        }
        eliminateOption(testDetails, options, eliminated);
    });
}

function saveAnswer(attempt) {
    const selected = document.querySelectorAll(".options button.selected");
    if (selected.length === 0) {
        generateError("Choose the answer");
        return false;
    }
    const question = document.querySelector(".question p");
    const selectedAnswerIds = [];
    selected.forEach(answer => {
        selectedAnswerIds.push(answer.dataset.value);
    });

    attempt.answers.push({
        questionId: question.dataset.id,
        selectedAnswerIds: selectedAnswerIds
    });
    return true;
}