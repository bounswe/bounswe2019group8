package com.traders.backend.controller;

import com.traders.backend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping(value = "/health")
    @ResponseBody
    public boolean getHealth() {
        return true;
    }
}
