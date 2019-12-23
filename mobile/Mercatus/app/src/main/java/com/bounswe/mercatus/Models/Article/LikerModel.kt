package com.bounswe.mercatus.Models.Article

// This body is designed to get likes and dislikes response.
data class LikerModel(
    val liker: Long,
    val choice: Int,
    val article: Int
)