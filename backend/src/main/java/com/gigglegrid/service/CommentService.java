package com.gigglegrid.service;

import java.util.List;
import com.gigglegrid.dao.CommentDao;
import com.gigglegrid.dao.MemeDao;
import com.gigglegrid.model.Comment;
import com.gigglegrid.model.Meme;
import com.gigglegrid.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private MemeDao memeDao;

    public Comment addComment(Long memeId, User user, String text) {
        Meme meme = memeDao.findById(memeId);
        if (meme == null) {
            throw new RuntimeException("Meme not found.");
        }
        Comment comment = new Comment();
        comment.setText(text);
        comment.setMeme(meme);
        comment.setUser(user);
        commentDao.save(comment);
        return comment;
    }

    public List<Comment> getComments(Long memeId) {
        return commentDao.findByMemeId(memeId);
    }

    public long countComments(Long memeId) {
        return commentDao.countByMemeId(memeId);
    }
}
