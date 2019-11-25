package com.bounswe.mercatus.Models

// This body is designed to show article in screen.
data class CreateEventBody(
    val name: String,
    val date: String,
    val time: String,
    val country: String,
    val importance: Float
)

/*
class GetEventBody (    val id: String,
                            val date: String,
                        val time: String,
                        val name: String,
                        val country: String,
                        val importance: Float,
                        val value: String
)
 */