package com.bounswe.mercatus.Models

data class UpdatePortfolio(
    val name: String,
    val equipments: List<ForexUpdateBody>
)