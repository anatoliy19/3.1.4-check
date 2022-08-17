package ru.kata.spring.boot_security.demo.services;

import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.role.RoleDao;
import ru.kata.spring.boot_security.demo.dao.user.UserDao;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserDao userDao;
    private final RoleDao roleDao;
    private final ApplicationContext applicationContext;

    public UserServiceImpl(UserDao userDao, RoleDao roleDao, ApplicationContext applicationContext) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.applicationContext = applicationContext;
    }

    @Override
    @Transactional (readOnly = true)
    public List<User> getUsers() {
        return userDao.findAllUsers();
    }

    @Override
    @Transactional (readOnly = true)
    public User getUserById(Long id) {
        return userDao.findUserById(id);
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        PasswordEncoder passwordEncoder = applicationContext.getBean("PasswordEncoder", PasswordEncoder.class);
        String proxyPwd = passwordEncoder.encode(user.getPassword());
        user.setPassword(proxyPwd);
        proxyPwd = "";
        userDao.saveUser(user);
    }

    @Override
    @Transactional
    public void deleteUser(User user) {
        userDao.deleteUser(user.getId());
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        PasswordEncoder passwordEncoder = applicationContext.getBean("PasswordEncoder", PasswordEncoder.class);
        String proxyPwd = passwordEncoder.encode(user.getPassword());
        user.setPassword(proxyPwd);
        proxyPwd = "";
        userDao.updateUser(user);
    }

    @Override
    @Transactional (readOnly = true)
    public List<String> getUserRolesAsStringList(User user) {
        List<Role> userRoles = user.getRoles();
        List<String> userRolesAsStringList = new ArrayList<>();
        for (Role role: userRoles) {
            userRolesAsStringList.add(role.getAuthority());
        }
        return userRolesAsStringList;
    }

    @Override
    @Transactional (readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userDao.tryGetUserByUsername(username);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UsernameNotFoundException("not found");
    }
}
