package com.traders.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    public enum UserRole {
        BASIC("basic"),
        TRADER("trader"),
        ADMIN("admin");

        @JsonValue
        public final String value;

        UserRole(final String value) {
            this.value = value;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public long _id;

    public String username;

    @Size(max = 100)
    public String password;

    public String email;

    @Enumerated(EnumType.STRING)
    public UserRole userRole;

    @ManyToMany
    private Set<User> following;

    @ManyToMany(mappedBy = "following")
    private Set<User> followedBy;


    public User() {
    }


    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.following = new HashSet<>();
        this.followedBy = new HashSet<>();
    }
}