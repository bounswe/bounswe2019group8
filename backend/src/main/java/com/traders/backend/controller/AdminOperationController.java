package com.traders.backend.controller;

import com.traders.backend.model.User;
import com.traders.backend.repository.UsersRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminOperationController {
    private final UsersRepository usersRepository;

    public AdminOperationController(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @RequestMapping(value = "/allusers", method = RequestMethod.GET)
    public List<User> getAllUsers() {
        return usersRepository.findAll();
    }
}
