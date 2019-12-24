package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody

// This body is designed to get portfolio response.
data class GetSpecificPortfolio(
    val pk: Long,
    val tr_eqs: List<ForexUpdateBody>,
    val owner: Long,
    val name: String,
    val private: Boolean
)

