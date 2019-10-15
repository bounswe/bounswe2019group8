package com.traders.backend.dto;

import com.traders.backend.model.User;
import lombok.Getter;

import java.util.List;

@Getter
public class RegisterCredentials {
    private String username;
    private String password;
    private String email;
    private User.UserRole userRole;
}
