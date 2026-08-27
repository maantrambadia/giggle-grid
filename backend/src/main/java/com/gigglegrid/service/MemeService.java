package com.gigglegrid.service;

import java.util.List;
import com.gigglegrid.dao.MemeDao;
import com.gigglegrid.dao.LikeDao;
import com.gigglegrid.model.Meme;
import com.gigglegrid.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MemeService {

    @Autowired
    private MemeDao memeDao;

    @Autowired
    private LikeDao likeDao;

    public void save(Meme meme) {
        memeDao.save(meme);
    }

    public Meme getById(Long id) {
        return memeDao.findById(id);
    }

    public List<Meme> getAll() {
        return memeDao.findAll();
    }

    public List<Meme> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return memeDao.findAll();
        }
        return memeDao.searchByCaption(keyword.trim());
    }

    public List<Meme> getByUserId(Long userId) {
        return memeDao.findByUserId(userId);
    }

    public void delete(Long id, User user) {
        Meme meme = memeDao.findById(id);
        if (meme == null || !meme.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed to delete this meme.");
        }
        memeDao.delete(meme);
    }
}
