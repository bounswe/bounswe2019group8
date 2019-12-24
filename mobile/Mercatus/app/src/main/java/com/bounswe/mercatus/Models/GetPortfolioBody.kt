package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody

// This body is designed to get articles response.
data class GetPortfolioBody(
    val pk: Long,
    val tr_eqs: List<ForexUpdateBody>,
    val owner: Long,
    val name: String,
 //   val followers: List<Long>,
    val private: Boolean
)

