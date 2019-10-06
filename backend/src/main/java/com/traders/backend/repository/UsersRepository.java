package com.traders.backend.repository;

import com.traders.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends MongoRepository<User, String> {
    User findBy_id(String id);

    User findByUsername(String username);

    User findByEmail(String email);
}
