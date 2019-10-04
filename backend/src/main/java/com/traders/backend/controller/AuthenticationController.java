package com.traders.backend.controller;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.traders.backend.model.User;
import com.traders.backend.repository.UsersRepository;
import com.traders.backend.security.JwtTokenProvider;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {


    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwtToken = jwtTokenProvider.generateJwtToken(authentication);

        return ResponseEntity.ok("Bearer " + jwtToken);
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<?> register(@RequestParam String username,
                                      @RequestParam String password,
                                      @RequestParam String email,
                                      @RequestParam List<String> authorityList) {
        if(usersRepository.findByUsername(username) != null) {
            return new ResponseEntity("Username already in use.", HttpStatus.BAD_REQUEST);
        }
        else if(usersRepository.findByEmail(email) != null) {
            return new ResponseEntity("Email already in use.", HttpStatus.BAD_REQUEST);
        }

        User user = new User(username, passwordEncoder.encode(password), email);
        if(authorityList == null || authorityList.size() == 0) {
            List<String> baseAuthorityList = new ArrayList<>();
            baseAuthorityList.add("basic");
            user.setRoles(baseAuthorityList);
        }
        else {
            user.setRoles(authorityList);
        }
        usersRepository.save(user);
        return new ResponseEntity("User successfully registered.", HttpStatus.OK);
    }


}
