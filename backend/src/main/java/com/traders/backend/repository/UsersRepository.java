package com.traders.backend.repository;

import com.traders.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {
    User findBy_id(long id);

    User findByUsername(String username);

    User findByEmail(String email);

}
