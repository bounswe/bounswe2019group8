package com.bounswe.mercatus.Models.Article

data class EditArticleBody(
    val title: String,
    val content: String,
    val rating: Float
)