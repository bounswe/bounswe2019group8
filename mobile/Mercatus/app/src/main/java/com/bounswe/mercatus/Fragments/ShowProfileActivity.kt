package com.bounswe.mercatus.Fragments

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.R

class ShowProfileActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_show_profile)
        val pkval = intent.getStringExtra("pk_val")
        //Toast.makeText(this@ShowProfileActivity, pkval.toLong(), Toast.LENGTH_SHORT).show()
    }
}
