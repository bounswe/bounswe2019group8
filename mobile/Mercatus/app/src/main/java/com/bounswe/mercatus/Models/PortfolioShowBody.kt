package com.bounswe.mercatus.Models

// This body is designed to get portfolio response.
data class PortfolioShowBody(
    val pk: Long,
    val owner: Long,
    val name: String,
    val private: Boolean
)

