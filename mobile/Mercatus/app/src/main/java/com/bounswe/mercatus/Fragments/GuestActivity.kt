package com.bounswe.mercatus.Fragments

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.R

class GuestActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_guest)
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}
