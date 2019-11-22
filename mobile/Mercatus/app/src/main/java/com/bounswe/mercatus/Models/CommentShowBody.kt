package com.bounswe.mercatus.Models

data class CommentShowBody(
    val author: Long,
    val content: String,
    val article: Int,
    val pk: Int
)