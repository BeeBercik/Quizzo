import initCreateTestView from "../views/createQuizView.js";
import {sendCreatedTest} from "../services/quizService.js";
import generateError from "../ui/errorBar.js";
import initView from "../router.js";
import {createBadOption, createQuestion} from "../ui/createQuizPanel.js";

export default function initCreateTest() {
    initCreateTestView();

    const questionsArea = document.getElementById("questions");
    questionsArea.addEventListener("click", onQuestionsClick);

    const eliminationOption = document.getElementById("elimination");
    const eliminationQuantity = document.getElementById("quantity");
    const testDuration = document.getElementById("duration");
    const title = document.getElementById("q-title");

    eliminationOption.checked = false;
    eliminationQuantity.disabled = true;

    eliminationOption.addEventListener("change", function() {
        handleOptionEliminationsChange(eliminationOption, eliminationQuantity);
    });

    generateQuestion();
    bindListenersToBadOptionBtn();

    document.getElementById("new-question-btn").addEventListener("click", function() {
        generateQuestion();
    });

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        submitTest(title, testDuration, eliminationQuantity);
    })
}

function handleOptionEliminationsChange(eliminationOption, eliminationQuantity) {
    if(eliminationOption.checked === true)
        eliminationQuantity.disabled = false;
    else {
        eliminationQuantity.disabled = true;
        eliminationQuantity.value = "";
    }
}

function submitTest(title, testDuration,
                    eliminationQuantity) {
    if(testDuration.value === "" || testDuration.value < 1) {
        generateError("Minimum duration time for test is 1 minute");
        return;
    }

    if(title.value === "") {
        generateError("Title cannot be empty!");
        return;
    }

    const questionsData = [];
    if(!getQuestionsAndAnswers(questionsData)) return null;

    const finalTestData = {
        title: title.value,
        time: testDuration.value ,
        eliminations: eliminationQuantity.value === "" ? 0 : eliminationQuantity.value,
        questionsData: questionsData
    }
    console.log(finalTestData);
    sendCreatedTest(finalTestData);
    initView("dashboard");
}

function generateQuestion() {
    const questionsCount = document.querySelectorAll('section.question').length + 1;
    createQuestion(questionsCount);
    bindListenersToBadOptionBtn();
}

function generateBadOption(e) {
    const btn = e.currentTarget;
    const question = btn.closest("section.question");
    if(question.dataset.badOptionCount === "8") {
        generateError("Limit 8 bad options for question");
        return;
    }
    question.dataset.badOptionCount++;
    const elContainer = question.querySelector(".elements");
    createBadOption(elContainer, question.dataset.badOptionCount);
}

function bindListenersToBadOptionBtn() {
    const badOptionBtns = document.querySelectorAll(".bad-option-btn");
    badOptionBtns.forEach(btn => {
        btn.removeEventListener("click", generateBadOption);
        btn.addEventListener("click", generateBadOption);
    });
}

function getQuestionsAndAnswers(questionsData) {
    const questions = document.querySelectorAll(".question");
    const allInputs = document.querySelectorAll(".question input");

    for(const input of allInputs) {
        if(input.value.trim() === "") {
            generateError("Input cannot be empty");
            return false;
        }
    }

    let i = 1;
    questions.forEach(q => {
        const question = q.querySelector(`#q${i}`).value;
        const correctAnswer = q.querySelector(`#correct${i}`).value;
        const badOptionsElements = q.querySelectorAll(".bad-options .elements input");

        let j = 1;
        const badOptions = [];
        badOptionsElements.forEach(b => {
            badOptions.push({
                value: b.value,
                correct: false
            });
            j++;
        });
        const answers = [...badOptions, { value: correctAnswer, correct: true }];

        const questionData = {
            question: question,
            answers: answers
        };

        questionsData.push(questionData);
        i++;
    });
    return true;
}

function onQuestionsClick(e) {
    const trash = e.target.closest(".delete-icon");
    if (!trash) return;

    const badOptionEl = trash.closest(".element");
    if (badOptionEl) {
        const section = trash.closest("section.question");
        badOptionEl.remove();
        renumberBadOptions(section);
        return;
    }

    const questionSection = trash.closest("section.question");
    if (questionSection) {
        questionSection.remove();
        renumberQuestions();
    }
}

function renumberQuestions() {
    const sections = document.querySelectorAll('section.question');
    sections.forEach((sec, idx) => {
        const n = idx + 1;

        const h3 = sec.querySelector('h3');
        if (h3) {
            const icon = h3.querySelector('.delete-icon');
            h3.innerHTML = `Question #${n} ${icon ? icon.outerHTML : ''}`;
        }

        const qLabel = sec.querySelector('label[for^="q"]');
        const qInput = sec.querySelector('input[id^="q"]');
        if (qLabel) qLabel.setAttribute('for', `q${n}`);
        if (qInput) { qInput.id = `q${n}`; qInput.name = `q${n}`; }

        const cLabel = sec.querySelector('label[for^="correct"]');
        const cInput = sec.querySelector('input[id^="correct"]');
        if (cLabel) cLabel.setAttribute('for', `correct${n}`);
        if (cInput) { cInput.id = `correct${n}`; cInput.name = `correct${n}`; }

        renumberBadOptions(sec);
    });
}

function renumberBadOptions(section) {
    const optionEls = section.querySelectorAll('.elements .element');
    section.dataset.badOptionCount = String(optionEls.length);

    optionEls.forEach((el, idx) => {
        const n = idx + 1;
        const label = el.querySelector('label');
        const input = el.querySelector('input');

        if (label) {
            const icon = label.querySelector('.delete-icon');
            label.setAttribute('for', `bad${n}`);
            label.innerHTML = `${n}. ${icon ? icon.outerHTML : ''}`;
        }
        if (input) {
            input.id = `bad${n}`;
            input.name = `bad${n}`;
        }
    });
}