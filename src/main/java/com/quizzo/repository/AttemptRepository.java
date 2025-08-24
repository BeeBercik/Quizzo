package com.quizzo.repository;

import com.quizzo.model.Attempt;
import com.quizzo.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Integer> {
    List<Attempt> findAllByQuiz(Quiz quiz);
}
