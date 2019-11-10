package com.bounswe.mercatus.Models

class UserNames{

    private val userName: String

    constructor(movieName: String){
        //code
        this.userName = movieName
    }

    fun getUserName(): String {
        return this.userName
    }

}