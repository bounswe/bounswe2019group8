package com.bounswe.mercatus.Models.TradingEquipments

// This body is designed to get each forex item parity value.
data class ForexParityModel(
    val interval_category: String,
    val observed_at: String,
    val tr_eq: String,
    val open: String,
    val close: String,
    val high: String,
    val low: String
)