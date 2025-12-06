package com.quizzo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnore
    private Quiz quiz;

    private Integer score;
    private LocalDateTime attemptTime;

    public Attempt(User user, Quiz quiz, Integer score, LocalDateTime attemptTime) {
        this.user = user;
        this.quiz = quiz;
        this.score = score;
        this.attemptTime = attemptTime;
    }

    public Attempt() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDateTime getAttemptTime() {
        return attemptTime;
    }

    public void setAttemptTime(LocalDateTime attemptTime) {
        this.attemptTime = attemptTime;
    }

    @Override
    public String toString() {
        return "Attempt{" +
                "id=" + id +
                ", user=" + user.getId() +
                ", quiz=" + quiz.getId() +
                ", score=" + score +
                ", attemptTime=" + attemptTime +
                '}';
    }
}