package com.bounswe.mercatus.Models


data class BuyAssetsModel(
    val sell_amount: Int,
    val buy_tr_eq_sym: String,
    val sell_tr_eq_sym: String
)

/*
{
	"sell_amount": 10,
	"buy_tr_eq_sym": "MSFT",
	"sell_tr_eq_sym": "USD_USD"
}
 */