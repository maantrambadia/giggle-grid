package com.gigglegrid.service;

import com.gigglegrid.dao.UserDao;
import com.gigglegrid.model.User;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Transactional
    public User register(String username, String password) {
        if (userDao.findByUsername(username) != null) {
            throw new RuntimeException("Username already taken");
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
            throw new RuntimeException("Invalid username or password");
        }
        if (!BCrypt.checkpw(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }

    @Transactional
    public User getById(Long id) {
        return userDao.findById(id);
    }
}