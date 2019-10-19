package com.traders.backend.controller;

import com.traders.backend.dto.LoginCredentials;
import com.traders.backend.dto.RegisterCredentials;
import com.traders.backend.model.User;
import com.traders.backend.security.JwtTokenProvider;
import com.traders.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;


    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;

    public AuthenticationController(AuthenticationManager authenticationManager, UserService userService, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginCredentials data) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(data.getUsername(), data.getPassword());

        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtTokenProvider.generateJwtToken(authentication);

        return ResponseEntity.ok("Bearer " + jwtToken);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterCredentials data) {
        if (userService.findUserByUsername(data.getUsername()) != null) {
            return new ResponseEntity<>("Username already in use.", HttpStatus.BAD_REQUEST);
        } else if (userService.findUserByEmail(data.getEmail()) != null) {
            return new ResponseEntity<>("Email already in use.", HttpStatus.BAD_REQUEST);
        }

        User user = new User(data.getUsername(), passwordEncoder.encode(data.getPassword()), data.getEmail());
        if (data.getUserRole() == null) {
            user.setUserRole("basic");
        } else {
            user.setUserRole(data.getUserRole());
        }
        userService.saveUser(user);
        return new ResponseEntity<>("User successfully registered.", HttpStatus.OK);
    }
}
