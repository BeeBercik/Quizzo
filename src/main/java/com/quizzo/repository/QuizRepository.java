package com.quizzo.repository;

import com.quizzo.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    boolean existsByCode(String code);
    Optional<Quiz> findByCode(String code);
}