package com.bounswe.mercatus.Models

// This body is designed to get each forex item.
data class ForexDataModel(
    val type: String,
    val name: String,
    val sym: String,
    val pk: Int,
    val last_updated: String
)