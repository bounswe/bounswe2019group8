package com.bounswe.mercatus.Models

import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody

data class UpdatePortfolio(
    val name: String,
    val tr_eqs: List<ForexUpdateBody>
)