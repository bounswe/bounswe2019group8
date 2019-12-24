package com.bounswe.mercatus.Models

data class NotifyShowBody(
    val reason: String,
    val source_user: Long,
    val created_at: String
)