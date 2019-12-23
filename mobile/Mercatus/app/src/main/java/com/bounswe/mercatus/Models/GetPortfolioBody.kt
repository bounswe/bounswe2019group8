package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody

// This body is designed to get articles response.
data class GetPortfolioBody(
    val pk: Long,
    val equipments: List<ForexShowBody>,
    val owner: Long,
    val name: String,
    val followers: List<Long>,
    val private: Boolean
)

