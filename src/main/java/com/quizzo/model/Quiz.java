package com.quizzo.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String code;
    private LocalDateTime createTime;
    private Float durationTime;
    private Integer eliminationsCount;

    @OneToMany(mappedBy = "quiz",
            orphanRemoval = true,
            cascade = CascadeType.ALL)
    private List<Question> questions = new ArrayList<>();

    public Quiz() {
    }

    public Integer getId() {
        return id;
    }

    public Integer getEliminationsCount() {
        return eliminationsCount;
    }

    public void setEliminationsCount(Integer eliminationsCount) {
        this.eliminationsCount = eliminationsCount;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Float getDurationTime() {
        return durationTime;
    }

    public void setDurationTime(Float durationTime) {
        this.durationTime = durationTime;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
