package com.traders.backend.controller;

import com.traders.backend.model.User;
import com.traders.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminOperationController {

    @Autowired
    private UsersRepository usersRepository;

    @RequestMapping(value="/allusers", method = RequestMethod.GET)
    public List<User> getAllUsers(){
        return usersRepository.findAll();
    }
}
