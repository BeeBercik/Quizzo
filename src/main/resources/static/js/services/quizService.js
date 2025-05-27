

export function fetchQuizInfo(code) {
    // fetch for qiz info
    return {
        name: "Quiz about the nature of human",
        time: 30,
        questions: 10,
        elimination: true
    };

//     return null;
}

export function getTestDetails(code) {
    //  fetch for test details
    return {
        time: 30,
        eliminations: true,
        eliminationsCount: 3,
        questions: [
            {
                question: "What color is crocodile?",
                answers: {
                    A: "red",
                    B: "blue",
                    C: "green",
                    D: "red"
                },
                correctAnswer: "C"
            },
            {
                question: "What is elephant?",
                answers: {
                    A: "animal",
                    B: "human",
                    C: "fish",
                    D: "insect"
                },
                correctAnswer: "A"
            }
        ]
    };
}