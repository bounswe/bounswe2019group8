package com.bounswe.mercatus

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_register.*


class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)


        btnBasic.setOnClickListener {
            val intent = Intent(this, BasicUserActivity::class.java)
            startActivity(intent)
        }

        btnTrader.setOnClickListener {
            val intent = Intent(this, TraderUserActivity::class.java)
            startActivity(intent)
        }
    }
}
