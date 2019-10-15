package com.traders.backend.dto;

import lombok.Getter;

@Getter
public class IdWrapper {
    private long id;
}

/*
 In controllers, we use @RequestBody, which consumes JSON.
 @RequestBody only recognizes Object classes, or JSONObject
 Wrapping id field with an object helps retrieving data from JSON (IdWrapper object is readable as JSON now).
 Other alternative solution would be using a JSON library to retrieve JSON data in controllers.
 We can use this wrapper when we pass id field of any of our classes, since they are all, of type 'long'.
*/
