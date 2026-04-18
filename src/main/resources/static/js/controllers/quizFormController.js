import initCreateEditTestView from "../views/createEditQuizView.js";
import { generateError } from "../ui/globalMessageBar.js";
import { createBadOption, createCorrectOption, createQuestion } from "../ui/createQuizPanel.js";
import initView from "../router.js";

const MAX_QUESTIONS = 100;
const MAX_BAD_OPTIONS = 8;
const MAX_CORRECT_OPTIONS = 8;

export function initQuizForm(mode = "create", quizData = null, submitAction = null) {
    initCreateEditTestView(mode, quizData === null ? null : quizData.code);

    const questionsArea = document.getElementById("questions");
    questionsArea.addEventListener("click", onQuestionsClick);

    const eliminationOption = document.getElementById("elimination");
    const eliminationQuantity = document.getElementById("quantity");
    const testDuration = document.getElementById("duration");
    const title = document.getElementById("q-title");
    const cancelBtn = document.getElementById("cancel-quiz-btn");
    const multipleCorrectOption = document.getElementById("multiple-correct");

    resetEliminationInputs(eliminationOption, eliminationQuantity);
    eliminationOption.addEventListener("change", function() {
        handleOptionEliminationsChange(eliminationOption, eliminationQuantity);
    });
    multipleCorrectOption.addEventListener("change", function() {
        handleMultipleCorrectChange(multipleCorrectOption.checked);
    });

    if (quizData)
        populateQuizForm(quizData, title, testDuration, eliminationOption, eliminationQuantity, multipleCorrectOption);
    else {
        generateQuestion();
        updateCorrectOptionControls(false);
    }

    document.getElementById("new-question-btn").addEventListener("click", function() {
        generateQuestion();
        updateCorrectOptionControls(multipleCorrectOption.checked);
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            initView("dashboard");
        });
    }

    document.querySelector("form").addEventListener("submit", async function(e) {
        e.preventDefault();
        const finalTestData = buildQuizPayload(title, testDuration, eliminationQuantity, multipleCorrectOption);
        if (!finalTestData || !submitAction) return;
        await submitAction(finalTestData);
    });
}

function buildQuizPayload(title, testDuration, eliminationQuantity, multipleCorrectOption) {
    if (testDuration.value === "" || testDuration.value < 1) {
        generateError("Minimum duration time for test is 1 minute");
        return null;
    }

    if (title.value === "") {
        generateError("Title cannot be empty!");
        return null;
    }

    const questionsData = [];
    if (!getQuestionsAndAnswers(questionsData)) return null;

    return {
        title: title.value,
        time: testDuration.value,
        eliminations: eliminationQuantity.value === "" ? 0 : eliminationQuantity.value,
        multipleChoice: multipleCorrectOption.checked,
        questionsData: questionsData
    };
}

function populateQuizForm(quizData, title, testDuration, eliminationOption, eliminationQuantity, multipleCorrectOption) {
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

    multipleCorrectOption.checked = quizData.multipleChoice === true;
    populateQuestions(quizData.questions);
    updateCorrectOptionControls(multipleCorrectOption.checked);
}

function populateQuestions(questions = []) {
    if (!questions || questions.length === 0) {
        generateQuestion();
        return;
    }

    questions.forEach((question, id) => {
        createQuestion(id + 1);
        const section = document.querySelectorAll("section.question")[id];
        section.dataset.badOptionCount = "1";
        section.dataset.correctOptionCount = "1";

        const qInput = section.querySelector(`#q${id + 1}`);
        if (qInput)
            qInput.value = question.value ?? "";

        const correctAnswers = (question.answers || []).filter(a => a.correct);
        const correctInput = section.querySelector(`#correct${id + 1}`);
        if (correctInput && correctAnswers.length > 0)
            correctInput.value = correctAnswers[0].value ?? "";

        const correctContainer = section.querySelector(".correct-options .elements");
        for (let i = 1; i < correctAnswers.length; i++) {
            const correctCount = i + 1;
            createCorrectOption(correctContainer, id + 1, correctCount);
            const input = correctContainer.querySelector(`#correct${id + 1}-${correctCount}`);
            if (input)
                input.value = correctAnswers[i].value ?? "";
            section.dataset.correctOptionCount = String(correctCount);
        }

        const badOptions = (question.answers || []).filter(a => !a.correct);
        const elContainer = section.querySelector(".bad-options .elements");
        let badCount = 1;
        if (badOptions.length > 0) {
            const firstBadInput = elContainer.querySelector(`#bad${id + 1}-1`);
            if (firstBadInput)
                firstBadInput.value = badOptions[0].value ?? "";
        }

        badOptions.slice(1).forEach(a => {
            badCount++;
            createBadOption(elContainer, id + 1, badCount);
            const input = elContainer.querySelector(`#bad${id + 1}-${badCount}`);
            if (input)
                input.value = a.value ?? "";
        });

        section.dataset.badOptionCount = String(badCount);
    });

}

function resetEliminationInputs(eliminationOption, eliminationQuantity) {
    eliminationOption.checked = false;
    eliminationQuantity.disabled = true;
    eliminationQuantity.value = "";
}

function handleOptionEliminationsChange(eliminationOption, eliminationQuantity) {
    if (eliminationOption.checked === true) {
        eliminationQuantity.disabled = false;
        if (eliminationQuantity.value === "")
            eliminationQuantity.value = "1";
    } else {
        eliminationQuantity.disabled = true;
        eliminationQuantity.value = "";
    }
}

function generateQuestion() {
    const questionsCount = document.querySelectorAll("section.question").length;
    if (questionsCount >= MAX_QUESTIONS) {
        generateError(`Limit ${MAX_QUESTIONS} questions per quiz`);
        return;
    }
    createQuestion(questionsCount + 1);
}

function handleMultipleCorrectChange(multipleCorrect) {
    if (!multipleCorrect)
        removeAdditionalCorrectOptions();

    updateCorrectOptionControls(multipleCorrect);
}

function generateBadOption(btn) {
    const question = btn.closest("section.question");
    const badOptionCount = Number(question.dataset.badOptionCount ?? 0);
    if (badOptionCount >= MAX_BAD_OPTIONS) {
        generateError(`Limit ${MAX_BAD_OPTIONS} bad options for question`);
        return;
    }
    question.dataset.badOptionCount++;
    const questionNumber = getQuestionNumber(question);
    const elContainer = question.querySelector(".bad-options .elements");
    createBadOption(elContainer, questionNumber, question.dataset.badOptionCount);
}

function generateCorrectOption(btn) {
    const question = btn.closest("section.question");
    let correctOptionCount = Number(question.dataset.correctOptionCount ?? 1);
    if (correctOptionCount >= MAX_CORRECT_OPTIONS) {
        generateError(`Limit ${MAX_CORRECT_OPTIONS} correct options for question`);
        return;
    }
    correctOptionCount++;
    question.dataset.correctOptionCount = String(correctOptionCount);
    const questionNumber = getQuestionNumber(question);
    const elContainer = question.querySelector(".correct-options .elements");
    createCorrectOption(elContainer, questionNumber, correctOptionCount);
}

function updateCorrectOptionControls(multipleCorrect) {
    const correctOptionBtns = document.querySelectorAll(".correct-option-btn");
    correctOptionBtns.forEach(btn => {
        btn.hidden = !multipleCorrect;
    });
}

function removeAdditionalCorrectOptions() {
    const questions = document.querySelectorAll("section.question");
    questions.forEach(question => {
        question.querySelectorAll(".correct-options .element:not(:first-child)").forEach(element => element.remove());
        question.dataset.correctOptionCount = "1";
    });
}

function getQuestionsAndAnswers(questionsData) {
    const questions = document.querySelectorAll(".question");
    const allInputs = document.querySelectorAll(".question input");

    if (questions.length > MAX_QUESTIONS) {
        generateError("Limit 100 questions per quiz");
        return false;
    }

    for (const input of allInputs) {
        if (input.value.trim() === "") {
            generateError("Input cannot be empty");
            return false;
        }
    }

    let i = 1;
    for (const q of questions) {
        const question = q.querySelector(`#q${i}`).value;
        const correctOptionsElements = q.querySelectorAll(".correct-options .elements input");
        const badOptionsElements = q.querySelectorAll(".bad-options .elements input");

        if (correctOptionsElements.length < 1) {
            generateError("Question must have at least 1 correct option");
            return false;
        }

        if (badOptionsElements.length < 1) {
            generateError("Question must have at least 1 bad option");
            return false;
        }

        const badOptions = [];
        badOptionsElements.forEach(b => {
            badOptions.push({
                value: b.value,
                correct: false
            });
        });

        const correctOptions = [];
        correctOptionsElements.forEach(c => {
            correctOptions.push({
                value: c.value,
                correct: true
            });
        });
        const answers = [...badOptions, ...correctOptions];

        const questionData = {
            question: question,
            answers: answers
        };

        questionsData.push(questionData);
        i++;
    }
    return true;
}

function onQuestionsClick(e) {
    const badOptionBtn = e.target.closest(".bad-option-btn");
    if (badOptionBtn) {
        generateBadOption(badOptionBtn);
        return;
    }

    const correctOptionBtn = e.target.closest(".correct-option-btn");
    if (correctOptionBtn) {
        generateCorrectOption(correctOptionBtn);
        return;
    }

    const trash = e.target.closest(".delete-icon");
    if (!trash) return;

    const correctOptionEl = trash.closest(".correct-options .element");
    if (correctOptionEl) {
        const section = trash.closest("section.question");
        correctOptionEl.remove();
        renumberCorrectOptions(section);
        return;
    }

    const badOptionEl = trash.closest(".bad-options .element");
    if (badOptionEl) {
        const section = trash.closest("section.question");
        badOptionEl.remove();
        renumberBadOptions(section);
        return;
    }

    const questionSection = trash.closest("section.question");
    if (questionSection) {
        if (getQuestionNumber(questionSection) === 1)
            return;
        questionSection.remove();
        renumberQuestions();
    }
}

function renumberQuestions() {
    const sections = document.querySelectorAll("section.question");
    sections.forEach((sec, idx) => {
        const n = idx + 1;

        const h3 = sec.querySelector("h3");
        if (h3) {
            const icon = h3.querySelector(".delete-icon");
            h3.innerHTML = `Question #${n} ${n === 1 ? "" : icon ? icon.outerHTML : '<i class="fa-solid fa-trash delete-icon"></i>'}`;
        }

        const qLabel = sec.querySelector('label[for^="q"]');
        const qInput = sec.querySelector('input[id^="q"]');
        if (qLabel) qLabel.setAttribute("for", `q${n}`);
        if (qInput) { qInput.id = `q${n}`; qInput.name = `q${n}`; }

        renumberCorrectOptions(sec, n);
        renumberBadOptions(sec);
    });
}

function renumberCorrectOptions(section, questionNumber = getQuestionNumber(section)) {
    const optionEls = section.querySelectorAll(".correct-options .elements .element");
    section.dataset.correctOptionCount = String(optionEls.length);

    optionEls.forEach((el, idx) => {
        const n = idx + 1;
        const label = el.querySelector("label");
        const input = el.querySelector("input");
        const inputId = n === 1 ? `correct${questionNumber}` : `correct${questionNumber}-${n}`;

        if (label) {
            const icon = label.querySelector(".delete-icon");
            label.setAttribute("for", inputId);
            label.innerHTML = `${n}. ${icon ? icon.outerHTML : ""}`;
        }
        if (input) {
            input.id = inputId;
            input.name = inputId;
        }
    });
}

function renumberBadOptions(section) {
    const optionEls = section.querySelectorAll(".bad-options .elements .element");
    section.dataset.badOptionCount = String(optionEls.length);
    const questionNumber = getQuestionNumber(section);

    optionEls.forEach((el, idx) => {
        const n = idx + 1;
        const label = el.querySelector("label");
        const input = el.querySelector("input");
        const inputId = `bad${questionNumber}-${n}`;

        if (label) {
            const icon = label.querySelector(".delete-icon");
            label.setAttribute("for", inputId);
            label.innerHTML = `${n}. ${n === 1 ? "" : icon ? icon.outerHTML : '<i class="fa-solid fa-trash delete-icon"></i>'}`;
        }
        if (input) {
            input.id = inputId;
            input.name = inputId;
        }
    });
}

function getQuestionNumber(question) {
    const sections = document.querySelectorAll("section.question");
    let questionNumber = 1;

    for (const section of sections) {
        if (section === question)
            return questionNumber;

        questionNumber++;
    }

    return 0;
}