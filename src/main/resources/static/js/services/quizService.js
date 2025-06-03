
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
        time: 0.2,
        eliminations: true,
        eliminationsCount: 4,
        questions: [
            {
                id: 1,
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
                id: 2,
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

export function submitAnswers(answers) {
//     ..
    console.log(answers);
}