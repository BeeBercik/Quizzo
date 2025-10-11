
let accessToken = null;

export function setAccess(t) {
    accessToken = t;
}

export function clearAccess() {
    accessToken = null;
}

export async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});
    const isAuthEndpoint =
        url.startsWith("/api/auth/login") ||
        url.startsWith("/api/auth/refresh") ||
        url.startsWith("/api/auth/logout");

    if (!isAuthEndpoint && accessToken)
        headers.set("Authorization", `Bearer ${accessToken}`);

    let response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status !== 401)
        return response;

    const refreshed = await refreshAccess();
    if (refreshed) {
        headers.set("Authorization", `Bearer ${accessToken}`);
        return fetch(url, { ...options, headers, credentials: "include" });
    }

    return response;
}

export async function refreshAccess() {
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: "include"
    });

    if (response.ok) {
        const {access} = await response.json();
        setAccess(access);
        return true;
    }

    clearAccess();
    return false;
}

export async function sendLoginData(data) {
    const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok)
        return null;

    const { access, profile } = await response.json();
    setAccess(access);

    return profile;
}

export async function sendRegisterData(data) {
    const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
    });

    return response.ok;
}


export async function logoutUser() {
    const response = await apiFetch('/api/auth/logout', { method: 'POST' });

    if (!response.ok)
        return false;

    clearAccess();
    return true;
}

export async function getQuizAttemptDetails(code) {
    const response = await apiFetch(`/api/quizzes/attempt/${code.toUpperCase()}`);
    if (response.status !== 200)
        return null;

    return response.json();
}

export async function getQuiz(code) {
    const response = await apiFetch(`/api/quizzes/${code.toUpperCase()}`);
    if (response.status !== 200)
        return null;

    return response.json();
}

export async function sendAnswers(answers) {
    const response = await apiFetch("/api/quizzes/submit", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(answers)
    });

    return response.status === 200;
}

export async function sendCreatedTest(test) {
    const response = await apiFetch("/api/quizzes/create", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(test)
    });

    return response.status === 200;
}

export async function getLoggedUserData() {
    const response = await apiFetch('/api/auth/logged');

    if (response.status !== 200)
        return null;

    return response.json();
}

export async function deleteQuiz(code) {
    const response = await apiFetch(`/api/quizzes/${code}`, { method: 'DELETE' });

    return response.status === 204;
}

export async function getQuizSummary(code) {
    const response = await apiFetch(`/api/quizzes/summary/${code}`);

    if (response.status !== 200)
        return null;

    return response.json();
}

export async function getAnswerCorrectness(id) {
    const response = await apiFetch(`/api/quizzes/check/option/${id}`);

    if (response.status !== 200)
        return null;

    return (await response.json()).correct;
}