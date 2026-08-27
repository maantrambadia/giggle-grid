package com.gigglegrid.service;

import com.gigglegrid.dao.LikeDao;
import com.gigglegrid.dao.MemeDao;
import com.gigglegrid.model.Like;
import com.gigglegrid.model.Meme;
import com.gigglegrid.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService {

    @Autowired
    private LikeDao likeDao;

    @Autowired
    private MemeDao memeDao;

    public long countLikes(Long memeId) {
        return likeDao.countByMemeId(memeId);
    }

    public boolean hasUserLiked(Long memeId, User user) {
        if (user == null) return false;
        return likeDao.findByMemeAndUser(memeId, user.getId()) != null;
    }

    public boolean toggleLike(Long memeId, User user) {
        Like existing = likeDao.findByMemeAndUser(memeId, user.getId());
        if (existing != null) {
            likeDao.delete(existing);
            return false;
        }
        Meme meme = memeDao.findById(memeId);
        if (meme == null) {
            throw new RuntimeException("Meme not found");
        }
        Like like = new Like();
        like.setMeme(meme);
        like.setUser(user);
        likeDao.save(like);
        return true;
    }
}