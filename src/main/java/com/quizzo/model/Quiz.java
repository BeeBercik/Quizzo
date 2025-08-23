package com.quizzo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User owner;

    @OneToMany(mappedBy = "quiz")
    private List<Attempt> userAttempts = new ArrayList<>();

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public List<Attempt> getUserAttempts() {
        return userAttempts;
    }

    public void setUserAttempts(List<Attempt> userAttempts) {
        this.userAttempts = userAttempts;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "Quiz{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", code='" + code + '\'' +
                ", createTime=" + createTime +
                ", durationTime=" + durationTime +
                ", eliminationsCount=" + eliminationsCount +
                ", active=" + active +
                ", owner=" + owner.getId()   +
                ", userAttempts=" + userAttempts.size() +
                ", questions=" + questions +
                '}';
    }
}
