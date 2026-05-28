TRUNCATE TABLE answers, questions, attempts, quizzes, users RESTART IDENTITY CASCADE;

INSERT INTO users (login, password, email, create_time, active, role)
VALUES (
    'rokaniaa',
    '$2a$12$A2RNRt6pDcJQn.d/5yn6cO3HTsQfdagrEOMm5Kh8YxiXlvuURPZBm',
    'rokaniaa@student.wszib.edu.pl',
    TIMESTAMP '2026-01-01 10:00:00',
    TRUE,
    'ADMIN'
);

INSERT INTO quizzes (title, code, create_time, duration_time, eliminations_count, multiple_choice, active, user_id)
VALUES (
    'Quiz about animals',
    'ANM26',
    TIMESTAMP '2026-01-01 11:00:00',
    20.5,
    3,
    FALSE,
    TRUE,
    1
);

INSERT INTO questions (value, quiz_id)
VALUES ('What color is elephant?', 1);

INSERT INTO answers (value, correct, question_id)
VALUES
    ('red', FALSE, 1),
    ('blue', TRUE, 1);
