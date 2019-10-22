package com.bounswe.mercatus

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.content.Intent
import android.util.Patterns
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserRes
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.activity_modify.*
import kotlinx.serialization.json.JSON


class ModifyActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_modify)

        btnSave.setOnClickListener {
            val email = mailChange.text.toString()
            val birthday = birthChange.text.toString()
            if (email.isValidEmail()){

            }
        }

        

        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val userObj = JSON.parse(UserRes.serializer(), intent.getStringExtra("userJson") ?: "")


    }
}

private fun String.isValidEmail(): Boolean
        = !this.isNullOrEmpty() &&
        Patterns.EMAIL_ADDRESS.matcher(this).matches()