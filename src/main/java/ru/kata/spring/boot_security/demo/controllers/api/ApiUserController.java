package ru.kata.spring.boot_security.demo.controllers.api;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserServiceImpl;

@RestController
@RequestMapping("/api/user")
public class ApiUserController {
    private final UserServiceImpl userService;
    private final RoleService roleService;

    public ApiUserController(UserServiceImpl userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/currentuser")
    public User currentUser(@AuthenticationPrincipal User testUser) {
        return testUser;
    }

}
