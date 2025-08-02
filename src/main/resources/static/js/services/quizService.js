import initView from "../router.js";

export async function getQuizAttemptDetails(code) {
    const response = await fetch(`/api/quizzes/attempt/${code.toUpperCase()}`);
    if(response.status !== 200) return null;

    const json = await response.json();
    console.log(json)

    return json;
}

export async function getQuiz(code) {
    const response = await fetch(`/api/quizzes/${code.toUpperCase()}`);
    if(response.status !== 200) return null;

    const json = await response.json();
    console.log(json);

    return json;
}

export function sendAnswers(answers) {
//     ..
    console.log(answers);
}

export function sendCreatedTest(test) {
//     saving to the database
}

export async function sendLoginData(data) {
    console.log("LOGIN");
    console.log(data);

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(!response.ok) return null;

    const json = await response.json();
    initView("dashboard", null, json);
}

export async function sendRegisterData(data) {
    console.log("REGISTER");
    console.log(data);

//  ...
}

export async function getLoggedUserData() {
    const response = await fetch('api/auth/login');

    if(!response.ok) {
        return null;
    }

    return await response.json();
}