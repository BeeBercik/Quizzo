package com.quizzo.repository;

import com.quizzo.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttemptRepository extends JpaRepository<Attempt, Integer> {
}
