package com.bounswe.mercatus.Models.Comments

import androidx.annotation.Nullable


data class CommentBody(
    val author: Long,
    val content: String,
    val article: Int,
    val trading_eq: Nullable,
    val pk: Int
)