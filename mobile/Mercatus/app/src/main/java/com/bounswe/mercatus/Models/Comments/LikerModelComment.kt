package com.bounswe.mercatus.Models.Comments

// This body is designed to get likes and dislikes response.
data class LikerModelComment(
    val liker: Long,
    val choice: Int,
    val comment: Int
)