package com.quizzo.repository;

import com.quizzo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByLogin(String login);

    @NativeQuery(
        value = """
            select distinct users.id, login, email, password, create_time
            from users
            inner join attempts
            on users.id = attempts.user_id
            where quiz_id = :quizId
            """)
    List<User> findDistinctByAttemptsOfQuiz(@Param("quizId") Integer quizId);

    Boolean existsByLogin(String login);
    Boolean existsByEmail(String email);
}