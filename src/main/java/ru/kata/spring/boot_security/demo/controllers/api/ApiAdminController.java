package ru.kata.spring.boot_security.demo.controllers.api;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class ApiAdminController {

    private final UserService userService;
    private final RoleService roleService;

    public ApiAdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/currentuser")
    public User currentUser(@AuthenticationPrincipal User testUser) {
        return testUser;
    }

    @GetMapping(value = "/roles")
    public List<Role> allRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping(value = "/users")
    public List<User> allUsers() {
        return userService.getUsers();
    }

    @GetMapping(value = "/users/{id}")
    public User userDetails(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }

    @PostMapping(value = "/users")
    public void createUser(@ModelAttribute ("user") User user, @ModelAttribute("role") Role role) {
        userService.saveUser(user);
    }

    @PatchMapping("/users/{id}")
    public void saveUser(@ModelAttribute ("user") User user, @PathVariable ("id") Long id) {
        userService.updateUser(user);
    }

    @DeleteMapping(value = "/users/{id}")
    public void deleteUser(@PathVariable ("id") Long id) {
        User user = userService.getUserById(id);
        userService.deleteUser(user);
    }

}
