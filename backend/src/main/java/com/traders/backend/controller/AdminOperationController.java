package com.traders.backend.controller;

import com.fasterxml.jackson.databind.node.TextNode;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.traders.backend.dto.IdWrapper;
import com.traders.backend.dto.LoginCredentials;
import com.traders.backend.model.User;
import com.traders.backend.repository.UsersRepository;
import com.traders.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
public class AdminOperationController {

    private final UserService userService;

    public AdminOperationController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }



}
