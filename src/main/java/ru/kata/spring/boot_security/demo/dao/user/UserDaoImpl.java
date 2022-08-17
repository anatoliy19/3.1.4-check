package ru.kata.spring.boot_security.demo.dao.user;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.dao.role.RoleDao;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao{

    @PersistenceContext
    private EntityManager entityManager;
    final RoleDao roleDao;

    public UserDaoImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public User findUserById(Long id) {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u join fetch u.roles r where u.id = :id", User.class);
        query.setParameter("id", id);
        return query.getSingleResult();
    }

    @Override
    public List<User> findAllUsers() {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u", User.class);
        List<User> proxyUsers = query.getResultList();
        for (User user: proxyUsers) {
            for (Role role : user.getRoles()) {
                TypedQuery<Role> roleQuery = entityManager.createQuery("SELECT r from Role r where r.id = :id", Role.class);
                roleQuery.setParameter("id", role.getId());
            }
        }
        return proxyUsers;
    }

    @Override
    public void saveUser(User user) {
        List<Role> result = new ArrayList<>();
        for (Role role: user.getRoles()) {
            result.add(roleDao.findRoleByName(role.getAuthority()));
        }
        user.setRoles(result);
        entityManager.persist(user);
    }

    @Override
    public void updateUser(User updatedUser) {
        List<Role> result = new ArrayList<>();
        for (Role role: updatedUser.getRoles()) {
           result.add(roleDao.findRoleByName(role.getAuthority()));
        }
        updatedUser.setRoles(result);
        entityManager.merge(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User proxyUser = entityManager.find(User.class, id);
        entityManager.remove(proxyUser);
    }

    @Override
    public Optional<User> tryGetUserByUsername(String username) {
        TypedQuery<User> query = entityManager.createQuery("SELECT u FROM User u join fetch u.roles r where u.firstName = :username", User.class);
        query.setParameter("username", username);
        try {
            Optional <User> rev = Optional.ofNullable(query.getSingleResult());
            return rev;
        } catch (Exception e){
            return Optional.empty();
        }
    }
}
