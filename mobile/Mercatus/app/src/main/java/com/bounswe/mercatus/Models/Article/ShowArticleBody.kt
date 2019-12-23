package com.bounswe.mercatus.Models.Article

// This body is designed to get articles response.
data class ShowArticleBody(
    val author: Long,
    val title: String,
    val content: String,
    val rating: Float,
    val likes: Int,
    val dislikes: Int,
    val isLiked: Boolean,
    val isDisliked: Boolean,
    val pk: Int
)