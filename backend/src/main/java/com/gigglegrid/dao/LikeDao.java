package com.gigglegrid.dao;

import java.util.List;
import com.gigglegrid.model.Like;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class LikeDao {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Like like) {
        sessionFactory.getCurrentSession().save(like);
    }

    public Like findByMemeAndUser(Long memeId, Long userId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Like> query = session.createQuery("from Like l where l.meme.id = :memeId and l.user.id = :userId", Like.class);
        query.setParameter("memeId", memeId);
        query.setParameter("userId", userId);
        return query.uniqueResult();
    }

    public long countByMemeId(Long memeId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Long> query = session.createQuery("select count(l) from Like l where l.meme.id = :memeId", Long.class);
        query.setParameter("memeId", memeId);
        return query.uniqueResult();
    }

    public void delete(Like like) {
        sessionFactory.getCurrentSession().delete(like);
    }
}