package com.gigglegrid.service;

import com.gigglegrid.dao.UserDao;
import com.gigglegrid.model.User;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final int MIN_PASSWORD_LENGTH = 8;

    @Autowired
    private UserDao userDao;

    @Transactional
    public User register(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (username.trim().length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters.");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }
        validatePassword(password);
        if (!isUsernameAvailable(username)) {
            throw new IllegalArgumentException("Username already taken.");
        }
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(BCrypt.hashpw(password, BCrypt.gensalt()));
        userDao.save(user);
        return user;
    }

    @Transactional
    public User login(String username, String password) {
        User user = userDao.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Invalid username or password.");
        }
        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password.");
        }
        return user;
    }

    @Transactional
    public User getById(Long id) {
        return userDao.findById(id);
    }

    @Transactional
    public boolean isUsernameAvailable(String username) {
        if (username == null) {
            return false;
        }
        String u = username.trim();
        if (u.isEmpty() || u.length() < 3) {
            return false;
        }
        return userDao.findByUsername(u) == null;
    }

    private static void validatePassword(String password) {
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters.");
        }

        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;

        for (int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            if (Character.isUpperCase(c)) {
                hasUpper = true;
            } else if (Character.isLowerCase(c)) {
                hasLower = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            } else {
                hasSpecial = true;
            }
        }

        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new IllegalArgumentException(
                    "Password must include uppercase, lowercase, number, and special character.");
        }
    }
}
