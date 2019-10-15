package com.traders.backend.controller;

import com.traders.backend.dto.IdWrapper;
import com.traders.backend.model.User;
import com.traders.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Set;

@RestController
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value = "/follows")
    public ResponseEntity followUser(Principal principal, @RequestBody IdWrapper id) {
        long otherUserId = id.getId();

        String loggedInUsername = principal.getName();
        User userObject = userService.findUserByUsername(loggedInUsername);
        User userToBeFollowed = userService.findUserById(otherUserId);

        if (userToBeFollowed == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User to be followed does not exist.");
        }

        Set<User> followedUsers = userObject.getFollowing();
        followedUsers.add(userToBeFollowed);

        userService.saveUser(userObject);

        return ResponseEntity.ok().build();
    }
}
