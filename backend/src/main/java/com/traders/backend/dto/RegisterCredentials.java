package com.traders.backend.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class RegisterCredentials {
    private String username;
    private String password;
    private String email;
    private String userRole;
}
