package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {

    List<User> getUsers();

    User getUserById(Long id);

    void saveUser(User user);

    void deleteUser(User user);

    void updateUser(User user);

    List<String> getUserRolesAsStringList(User user);

}
