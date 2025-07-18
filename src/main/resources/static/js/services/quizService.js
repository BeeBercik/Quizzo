
export async function getQuizAttemptDetails(code) {
    const response = await fetch(`/api/quizzes/attempt/${code}`);
    if(response.status !== 200) return null;

    const json = await response.json();
    console.log(json)

    return json;
}

export async function getQuiz(code) {
    const response = await fetch(`/api/quizzes/${code}`);
    if(response.status !== 200) return null;

    const json = await response.json();
    console.log(json);

    return json;
}

export function getUserQuizzes(userId) {
    return {
        attended: [
            {
                id: 1,
                title: "Attended test title 1",
                result: 75
            },
            {
                id: 2,
                title: "Attended test title 2",
                result: 55
            }
        ],
        created: [
            {
                id: 10,
                title: "Created test title 1",
                code: "ABCD1"
            },
            {
                id: 20,
                title: "Created test title 2",
                code: "ABCD2"
            }
        ]
    }

}

export function submitAnswers(answers) {
//     ..
    console.log(answers);
}

export function sendCreatedTest(test) {
//     saving to the database
}