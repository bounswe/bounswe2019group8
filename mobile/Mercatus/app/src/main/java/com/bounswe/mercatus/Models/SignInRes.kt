package com.bounswe.mercatus.Models

import kotlinx.serialization.Serializable

@Serializable
data class SignInRes(val token: String, val user_id: Long)