package com.bounswe.mercatus.Models.Article

// This body is designed to get articles response.
data class GetArticleBody(
    val author: Long,
    val title: String,
    val content: String,
    val rating: Float,
    val pk: Int
)