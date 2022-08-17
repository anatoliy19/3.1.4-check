package ru.kata.spring.boot_security.demo.dao.user;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Optional;

public interface UserDao {
    User findUserById(Long id);
    List<User> findAllUsers();
    void saveUser(User user);
    void updateUser(User updatedUser);
    void deleteUser(Long id);
    Optional<User> tryGetUserByUsername (String username);
}
