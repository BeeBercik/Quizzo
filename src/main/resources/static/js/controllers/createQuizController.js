import initCreateTestView from "../views/createQuizView.js";
import {getQuizForEdit, sendCreatedTest, updateQuiz} from "../services/quizService.js";
import {generateError, generateSuccess} from "../ui/globalMessageBar.js";
import initView from "../router.js";
import {createBadOption, createQuestion} from "../ui/createQuizPanel.js";

export default function initCreateTest() {
    initQuizForm("create");
}

export async function initEditTest(code) {
    const quizData = await getQuizForEdit(code);

    if (quizData == null) {
        generateError("Quiz not found or you cannot edit it");
        initView("dashboard");
        return;
    }

    initQuizForm("edit", quizData);
}

function initQuizForm(mode = "create", quizData = null) {
    initCreateTestView(mode, quizData?.code);

    const questionsArea = document.getElementById("questions");
    questionsArea.addEventListener("click", onQuestionsClick);

    const eliminationOption = document.getElementById("elimination");
    const eliminationQuantity = document.getElementById("quantity");
    const testDuration = document.getElementById("duration");
    const title = document.getElementById("q-title");

    eliminationOption.checked = false;
    eliminationQuantity.disabled = true;
    eliminationQuantity.value = "";

    eliminationOption.addEventListener("change", function() {
        handleOptionEliminationsChange(eliminationOption, eliminationQuantity);
    });

    if (quizData)
        populateQuizForm(quizData, title, testDuration, eliminationOption, eliminationQuantity);
    else {
        generateQuestion();
        bindListenersToBadOptionBtn();
    }

    document.getElementById("new-question-btn").addEventListener("click", function() {
        generateQuestion();
    });

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        submitTest(title, testDuration, eliminationQuantity, mode, quizData?.code);
    });
}

function populateQuizForm(quizData, title, testDuration, eliminationOption, eliminationQuantity) {
    title.value = quizData.title ?? "";
    testDuration.value = quizData.durationTime ?? "";

    const eliminations = quizData.eliminationsCount ?? 0;
    if (eliminations > 0) {
        eliminationOption.checked = true;
        eliminationQuantity.disabled = false;
        eliminationQuantity.value = eliminations;
    } else {
        eliminationOption.checked = false;
        eliminationQuantity.disabled = true;
        eliminationQuantity.value = "";
    }

    populateQuestions(quizData.questions);
}

function populateQuestions(questions = []) {
    if (!questions || questions.length === 0) {
        generateQuestion();
        bindListenersToBadOptionBtn();
        return;
    }

    questions.forEach((question, id) => {
        createQuestion(id + 1);
        const section = document.querySelectorAll('section.question')[id];
        section.dataset.badOptionCount = "0";

        const qInput = section.querySelector(`#q${id + 1}`);
        if (qInput)
            qInput.value = question.value ?? '';

        const correctInput = section.querySelector(`#correct${id + 1}`);
        const correctAnswer = (question.answers || []).find(a => a.correct);
        if (correctInput && correctAnswer)
            correctInput.value = correctAnswer.value ?? '';

        const badOptions = (question.answers || []).filter(a => !a.correct);
        const elContainer = section.querySelector(".elements");
        let badCount = 0;
        badOptions.forEach(a => {
            badCount++;
            createBadOption(elContainer, badCount);
            const input = elContainer.querySelector(`#bad${badCount}`);
            if (input)
                input.value = a.value ?? '';
        });

        section.dataset.badOptionCount = String(badCount);
    });

    bindListenersToBadOptionBtn();
}

function handleOptionEliminationsChange(eliminationOption, eliminationQuantity) {
    if (eliminationOption.checked === true)
        eliminationQuantity.disabled = false;
    else {
        eliminationQuantity.disabled = true;
        eliminationQuantity.value = "";
    }
}

async function submitTest(title, testDuration, eliminationQuantity, mode, quizCode) {
    if (testDuration.value === "" || testDuration.value < 1) {
        generateError("Minimum duration time for test is 1 minute");
        return;
    }

    if (title.value === "") {
        generateError("Title cannot be empty!");
        return;
    }

    const questionsData = [];
    if (!getQuestionsAndAnswers(questionsData)) return null;

    const finalTestData = {
        title: title.value,
        time: testDuration.value ,
        eliminations: eliminationQuantity.value === "" ? 0 : eliminationQuantity.value,
        questionsData: questionsData
    }

    let success = false;
    if (mode === "edit") {
        if (!quizCode) {
            generateError("Missing quiz code to update");
            return;
        }
        success = await updateQuiz(quizCode, finalTestData);
    } else
        success = await sendCreatedTest(finalTestData);

    if (success) {
        initView("dashboard");
        generateSuccess(mode === "edit" ? "Quiz updated" : "Quiz created");
    } else
        generateError(mode === "edit" ? "Cannot update quiz" : "Error during saving to database");
}

function generateQuestion() {
    const questionsCount = document.querySelectorAll('section.question').length + 1;
    createQuestion(questionsCount);
    bindListenersToBadOptionBtn();
}

function generateBadOption(e) {
    const btn = e.currentTarget;
    const question = btn.closest("section.question");
    if (question.dataset.badOptionCount === "8") {
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

    for (const input of allInputs) {
        if (input.value.trim() === "") {
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