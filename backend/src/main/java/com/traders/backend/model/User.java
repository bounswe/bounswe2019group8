package com.traders.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Size;
import java.util.List;

@Getter
@Setter
@Document(collection = "users")
public class User {
    @Id
    public String _id;
    public String username;
    @Size(max = 100)
    public String password;
    public String email;
    public List<String> roles;
    public User(){

    }

    public User(String username, String password, String email){
        this.username = username;
        this.password = password;
        this.email = email;
    }

}
