import generateError from "../ui/errorBar.js";

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

export async function sendAnswers(answers) {
    console.log(answers);
    const response = await fetch("/api/quizzes/submit", {
        method: 'POST',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(answers)
    });

    if(response.status !== 200) {
        generateError('Error during submitting quiz');
        return false;
    }

    return true;
}

export async function sendCreatedTest(test) {
    console.log(test);

    const response = await fetch("/api/quizzes/create", {
        method: 'POST',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(test)
    });

    if(response.status !== 200) {
        generateError('Error during saving to database');
        return false;
    }

    return true;
}

export async function sendLoginData(data) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.status !== 200) return null;

    return await response.json();
}

export async function sendRegisterData(data) {
    console.log("REGISTER");
    console.log(data);

//  ...
}

export async function logoutUser() {
    const response = await fetch('api/auth/logout', {
        method: 'POST'
    });

    if(response.status !== 204) {
        generateError("Error while trying to logout");
    }
}

export async function getLoggedUserData() {
    const response = await fetch('api/auth');

    if(response.status !== 200) {
        return null;
    }

    return await response.json();
}

export async function deleteQuiz(code) {
    const response = await fetch(`/api/quizzes/${code}`, {
        method: 'DELETE'
    });

    if(response.status !== 204) {
        generateError('This specific quiz cannot be removed');
        return false;
    }

    return true;
}

export async function getQuizSummary(code) {
    const response = await fetch(`/api/quizzes/summary/${code}`);
    if(response.status !== 200) {
        generateError('Quiz summary cannot be shown');
        return null;
    }

    return await response.json();
}

export async function getAnswerCorrectness(id) {
    const response = await fetch(`/api/quizzes/check/option/${id}`);

    if(response.status !== 200) {
        generateError('Error during option elimination');
        return;
    }

    return (await response.json()).correct;
}