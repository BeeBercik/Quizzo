
export function fetchQuizInfo(code) {
    // fetch for qiz info
    return {
        name: "Quiz about the nature of human",
        time: 20,
        questions: 2,
        elimination: true
    };

//     return null;
}

export function getQuizDetails(code) {
    //  fetch for test details
    return {
        id: 1,
        time: 20,
        eliminationsCount: 4,
        questions: [
            {
                id: 10,
                question: "What color is crocodile?",
                answers: [
                    { id: 110, value: "red" },
                    { id: 111, value: "blue" },
                    { id: 112, value: "green" },
                    { id: 113, value: "red" }
                ],
            },
            {
                id: 20,
                question: "What is elephant?",
                answers: [
                    { id: 210, value: "animal" },
                    { id: 211, value: "human" },
                    { id: 212, value: "fish" },
                    { id: 213, value: "insect" }
                ],
            }
        ]
    };
}

export function getUserQuizzes(userId) {
//     fetching
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