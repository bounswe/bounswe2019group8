package com.bounswe.mercatus.Models


// This body is designed to get each forex item parity value.
data class NewPriceModel(
    val observe_date: String,
    val observe_time: String,
    val tr_eq: Int,
    val indicative_value: String,
    val ask_value: String,
    val bid_value: String,
    val interval: String
)