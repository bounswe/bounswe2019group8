package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.User.UserFollower

data class SearchRes(
    val pk: Long,
    val email: String,
    val lat: Float,
    val long: Float,
    val first_name: String,
    val last_name: String,
    val date_of_birth: String,
    val groups: List<Int>,
    val profile_image: String?,
    val followers: List<UserFollower>,
    val email_activated : Boolean
)
