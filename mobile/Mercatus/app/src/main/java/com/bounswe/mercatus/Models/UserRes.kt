package com.bounswe.mercatus.Models

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import java.sql.Time
import java.sql.Timestamp
import java.util.*

@Serializable
data class UserRes(
    val pk: Long,
    val email: String,
    val lat: Float,
    val long: Float,
    val first_name: String,
    val last_name: String,
    val date_of_birth: String,
    val groups: List<Int>,
    val profile_image: String?,
    val followers: List<UserRes>,
    val followings: List<UserRes>
)
