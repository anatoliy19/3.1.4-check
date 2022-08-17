package ru.kata.spring.boot_security.demo.models;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role", nullable = false, length = 45)
    private String role;

    @Override
    public String getAuthority() {
        return role;
    }

    @Override
    public String toString() {return this.role;}

    public Role () {}
    public Role(String role) {
        this.role = role;
    }
    public Role (Long id) {
        this.id = id;
    }
    public Role (Long id, String role) {
        this.id = id; this.role = role;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getRole() {
        return role;
    }
}


