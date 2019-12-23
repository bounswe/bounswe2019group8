package com.bounswe.mercatus.Models.TradingEquipments

// This body is designed to get each forex item.
data class ForexDataModel(
    val type: String,
    val name: String,
    val sym: String,
    val pk: Int,
    val last_updated_daily: String,
    val last_updated_current: String
)