package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class UserController {

    @GetMapping(value = "/user/userinfo")
    public String userPage() {
        return ("user/userdetails_new");
    }
}
