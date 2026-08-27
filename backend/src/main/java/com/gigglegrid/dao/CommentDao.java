package com.gigglegrid.dao;

import java.util.List;
import com.gigglegrid.model.Comment;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CommentDao {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Comment comment) {
        sessionFactory.getCurrentSession().save(comment);
    }

    public List<Comment> findByMemeId(Long memeId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Comment> query = session.createQuery(
                "select c from Comment c join fetch c.user where c.meme.id = :memeId order by c.createdAt desc",
                Comment.class
        );
        query.setParameter("memeId", memeId);
        return query.getResultList();
    }

    public long countByMemeId(Long memeId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Long> query = session.createQuery("select count(c) from Comment c where c.meme.id = :memeId", Long.class);
        query.setParameter("memeId", memeId);
        return query.uniqueResult();
    }
}