package com.bounswe.mercatus.Models

data class NotificationsBody(
    val to: Long,
    val reason: String,
    val source_type: String,
    val source_user: Long,
    val source_comment: Long,
    val source_article: Long,
    val source_annotation: Long,
    val followers: List<Long>,
    val is_read: Boolean,
    val created_at: String
)