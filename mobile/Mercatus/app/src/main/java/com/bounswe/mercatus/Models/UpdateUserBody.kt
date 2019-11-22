package com.bounswe.mercatus.Models

data class UpdateUserBody(
    val email: String,
    val first_name: String,
    val last_name: String,
    val date_of_birth: String
)
