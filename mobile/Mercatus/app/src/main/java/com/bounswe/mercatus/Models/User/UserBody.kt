package com.bounswe.mercatus.Models.User

import com.bounswe.mercatus.Models.User.UserRes
import java.util.*

data class UserBody(val date_of_birth: String,
                    val email: String,
                    val first_name: String,
                    val last_name: String,
                    val password: String,
                    val followings: List<UserRes> = Collections.emptyList(),
                    val followers: List<UserRes> = Collections.emptyList())