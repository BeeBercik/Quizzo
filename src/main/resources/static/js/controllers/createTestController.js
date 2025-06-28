import initCreateTestView from "../views/createTestView.js";
import {saveCreatedTest} from "../services/quizService.js";
import generateError from "../ui/errorBar.js";
import initView from "../router.js";
import {createBadOption, createQuestion} from "../ui/createTestPanel.js";

export default function initCreateTest() {
    initCreateTestView();
    const eliminationOption = document.getElementById("elimination");
    const eliminationQuantity = document.getElementById("quantity");
    const testDuration = document.getElementById("duration");
    let questionCount = 0;

    eliminationOption.checked = false;
    eliminationQuantity.disabled = true;

    eliminationOption.addEventListener("change", function() {
        handleOptionEliminationsChange(eliminationOption, eliminationQuantity);
    });

    questionCount = generateQuestion(questionCount);
    bindListenersToBadOptionBtn();

    document.getElementById("new-question-btn").addEventListener("click", function() {
        questionCount = generateQuestion(questionCount);
    });

    document.querySelector("form").addEventListener("submit", function(e) {
        e.preventDefault();
        submitTest(testDuration, eliminationQuantity);
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

function submitTest(testDuration,
                    eliminationQuantity) {
    if(testDuration.value === "" || testDuration.value < 1) {
        generateError("Minimum duration time for test is 1 minute");
        return;
    }

    const questionsData = [];
    getQuestionsAndAnswers(questionsData);

    console.log("questionsData: ", questionsData);
    const finalTestData = {
        time: testDuration.value ,
        eliminations: eliminationQuantity.value === "" ? 0 : eliminationQuantity.value,
        questionsData: questionsData
    }
    console.log(finalTestData);
    saveCreatedTest(finalTestData);
    // initView("dashboard");
}

function generateQuestion(questionCount) {
    questionCount++;
    createQuestion(questionCount);
    bindListenersToBadOptionBtn();
    return questionCount;
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

    allInputs.forEach(input => {
        if(input.value.trim() === "") {
            generateError("Input cannot be empty");
            return;
        }
    });
    let i = 1;
    questions.forEach(q => {
        const question = q.querySelector(`#q${i}`).value;
        const correctAnswer = q.querySelector("#correct").value;
        const badOptionsElements = q.querySelectorAll(".bad-options .elements input");

        let j = 1;
        const badOptions = [];
        badOptionsElements.forEach(b => {
            badOptions.push(b.value);
            j++;
        });

        const questionData = {
            question: question,
            correctAnswer: correctAnswer,
            badOptions: badOptions
        };

        console.log("question data: ", questionData);
        questionsData.push(questionData);
        i++;
    });
}