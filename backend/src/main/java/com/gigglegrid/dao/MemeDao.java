package com.gigglegrid.dao;

import java.util.List;
import com.gigglegrid.model.Meme;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MemeDao {

    @Autowired
    private SessionFactory sessionFactory;

    public void save(Meme meme) {
        sessionFactory.getCurrentSession().save(meme);
    }

    public Meme findById(Long id) {
        return sessionFactory.getCurrentSession().get(Meme.class, id);
    }

    public List<Meme> findAll() {
        Session session = sessionFactory.getCurrentSession();
        Query<Meme> query = session.createQuery("from Meme m order by m.createdAt desc", Meme.class);
        return query.getResultList();
    }

    public List<Meme> searchByCaption(String keyword) {
        Session session = sessionFactory.getCurrentSession();
        Query<Meme> query = session.createQuery("from Meme m where lower(m.caption) like lower(:keyword) order by m.createdAt desc", Meme.class);
        query.setParameter("keyword", "%" + keyword + "%");
        return query.getResultList();
    }

    public List<Meme> findByUserId(Long userId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Meme> query = session.createQuery("from Meme m where m.user.id = :userId order by m.createdAt desc", Meme.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    public void delete(Meme meme) {
        sessionFactory.getCurrentSession().delete(meme);
    }
}