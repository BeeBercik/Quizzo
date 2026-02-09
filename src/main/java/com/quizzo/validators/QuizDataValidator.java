package com.quizzo.validators;

import com.quizzo.dto.AnswerRequest;
import com.quizzo.dto.CreatedQuizRequest;
import com.quizzo.exception.IncorrectQuizDataException;

public class QuizDataValidator {

    private static final Integer MAX_QUESTIONS_COUNT = 100;
    private static final Integer MAX_BAD_OPTIONS_COUNT = 8;
    private static final Integer MAX_QUIZ_TIME = 300;
    private static final Integer MAX_ELIMINATIONS_COUNT = 99;
    private static final Integer MAX_CORRECT_OPTION_COUNT = 1;

    public static void validateQuizData(CreatedQuizRequest updatedQuiz) {
        if (updatedQuiz == null)
            throw new IncorrectQuizDataException("Quiz data cannot be empty");

        if (updatedQuiz.questionsData() == null || updatedQuiz.questionsData().isEmpty())
            throw new IncorrectQuizDataException("Question data cannot be empty");

        if (updatedQuiz.questionsData().size() > MAX_QUESTIONS_COUNT)
            throw new IncorrectQuizDataException("Max question count is " + MAX_QUESTIONS_COUNT);

        validateEliminations(updatedQuiz);
        validateTime(updatedQuiz);
        validateTitle(updatedQuiz);
        validateAnswers(updatedQuiz);
    }

    private static void validateTitle(CreatedQuizRequest updatedQuiz) {
        String title = updatedQuiz.title();
        if (title == null || title.isBlank())
            throw new IncorrectQuizDataException("Quiz title cannot be empty");
        if (title.trim().length() < 3)
            throw new IncorrectQuizDataException("Quiz title must have at least 3 characters");
    }

    private static void validateTime(CreatedQuizRequest updatedQuiz) {
        String time = updatedQuiz.time();
        if (time == null || time.isBlank())
            throw new IncorrectQuizDataException("Quiz time cannot be empty");
        float parsedTime;
        try {
            parsedTime = Float.parseFloat(time.trim());
        } catch (NumberFormatException e) {
            throw new IncorrectQuizDataException("Quiz time must be a number");
        }
        if (parsedTime > MAX_QUIZ_TIME || parsedTime < 0)
            throw new IncorrectQuizDataException("Quiz should be between 0 and " + MAX_QUIZ_TIME + " minutes");
    }

    private static void validateAnswers(CreatedQuizRequest updatedQuiz) {
        updatedQuiz.questionsData().forEach(questionData -> {
            if (questionData == null)
                throw new IncorrectQuizDataException("Question data cannot be empty");
            if (questionData.question() == null || questionData.question().isBlank())
                throw new IncorrectQuizDataException("Question text cannot be empty");
            if (questionData.answers() == null || questionData.answers().isEmpty())
                throw new IncorrectQuizDataException("Question must have answers");

            int badOptions = 0;
            int correctOptions = 0;
            for (AnswerRequest a : questionData.answers()) {
                if (a == null)
                    throw new IncorrectQuizDataException("Answer data cannot be empty");
                if (a.value() == null || a.value().isBlank())
                    throw new IncorrectQuizDataException("Answer text cannot be empty");
                if (!a.correct()) badOptions++;
                else correctOptions++;
            }
            if (badOptions > MAX_BAD_OPTIONS_COUNT)
                throw new IncorrectQuizDataException("Max bad options count per question is " + MAX_BAD_OPTIONS_COUNT);
            if (badOptions == 0)
                throw new IncorrectQuizDataException("Question must have at least 1 bad option");
            if (correctOptions != MAX_CORRECT_OPTION_COUNT)
                throw new IncorrectQuizDataException("Question must have exactly " + MAX_CORRECT_OPTION_COUNT + " correct option");
        });
    }

    private static void validateEliminations(CreatedQuizRequest updatedQuiz) {
        if (updatedQuiz.eliminations() < 0 || updatedQuiz.eliminations() > MAX_ELIMINATIONS_COUNT)
            throw new IncorrectQuizDataException("Elimination count should be between 0 and " + MAX_ELIMINATIONS_COUNT);
    }
}
