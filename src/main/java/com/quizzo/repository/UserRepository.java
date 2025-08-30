package com.quizzo.repository;

import com.quizzo.model.Quiz;
import com.quizzo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByLogin(String login);

    @Query("select distinct u from User u join u.attempts a where a.quiz = :quiz")
    List<User> findDistinctByAttemptsOfQuiz(@Param("quiz") Quiz quiz);
}
