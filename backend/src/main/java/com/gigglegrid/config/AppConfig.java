package com.gigglegrid.config;

import java.util.Properties;
import javax.sql.DataSource;
import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.HibernateTransactionManager;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.gigglegrid.dao", "com.gigglegrid.service"})
public class AppConfig {

    @Bean
    public DataSource dataSource() {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setUrl("jdbc:mariadb://localhost:3306/gigglegrid");
        ds.setUsername("root");
        ds.setPassword("");
        ds.setDriverClassName("org.mariadb.jdbc.Driver");
        return ds;
    }

    @Bean
    public LocalSessionFactoryBean sessionFactory(DataSource dataSource) {
        LocalSessionFactoryBean factory = new LocalSessionFactoryBean();
        factory.setDataSource(dataSource);
        factory.setPackagesToScan("com.gigglegrid.model");
        Properties hibernate = new Properties();
        hibernate.put("hibernate.dialect", "org.hibernate.dialect.MariaDBDialect");
        hibernate.put("hibernate.hbm2ddl.auto", "none");
        hibernate.put("hibernate.show_sql", "true");
        hibernate.put("hibernate.format_sql", "true");
        hibernate.put("hibernate.use_sql_comments", "true");
        factory.setHibernateProperties(hibernate);
        return factory;
    }

    @Bean
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
        return new HibernateTransactionManager(sessionFactory);
    }
}