package com.bounswe.mercatus.Models

import kotlinx.serialization.Serializable

@Serializable
data class UserFollower(
    val pk: Long,
    val first_name: String,
    val last_name: String
)