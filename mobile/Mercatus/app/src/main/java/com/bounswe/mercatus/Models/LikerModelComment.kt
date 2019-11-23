package com.bounswe.mercatus.Models

// This body is designed to get likes and dislikes response.
data class LikerModelComment(
    val liker: Long,
    val choice: Int,
    val comment: Int
)