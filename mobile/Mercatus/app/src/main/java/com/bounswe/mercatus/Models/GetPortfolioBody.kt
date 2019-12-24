package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody

// This body is designed to get portfolio response.
data class GetPortfolioBody(
    val pk: Long,
    val equipments: List<ForexUpdateBody>,
    val owner: Long,
    val name: String,
    val followers: List<Long>,
    val private: Boolean
)

