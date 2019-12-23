package com.bounswe.mercatus.Models


data class GetAssetsBody(
    val owner: Long,
    val tr_eq: AssetEquipmentModel,
    val amount: Float
)