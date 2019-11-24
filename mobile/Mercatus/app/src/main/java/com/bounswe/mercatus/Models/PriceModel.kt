package com.bounswe.mercatus.Models


// This body is designed to get each forex item parity value.
data class PriceModel(
    val observed_at: String,
    val tr_eq: String,
    val bid_price: String,
    val ask_price: String,
    val exchange_rate: String
)