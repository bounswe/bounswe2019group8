package com.traders.backend.service;

import com.traders.backend.model.User;
import com.traders.backend.repository.UsersRepository;
import com.traders.backend.security.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UsersRepository usersRepository;

    public UserDetailsServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = usersRepository.findByUsername(username);
        return UserPrincipal.create(user);
    }

    public UserDetails loadUserById(String id) {
        User user = usersRepository.findBy_id(id);
        return UserPrincipal.create(user);
    }
}
