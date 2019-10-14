package com.bounswe.mercatus

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_login.*

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Button click listener
        btnLogin.setOnClickListener {
            if (isValidForm()){
                Toast.makeText(this,"Login success",Toast.LENGTH_SHORT).show()
            }
        }

        btnGuest.setOnClickListener {
            val intent = Intent(this, GuestActivity::class.java)
            startActivity(intent)
        }

        btnRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }

    }
    private fun isValidForm():Boolean{
        var isValid = true
        val email = eMail.text.toString().trim()
        val password = ePassword.text.toString().trim()

        if (!email.isValidEmail()){
            lMail.isErrorEnabled = true
            lMail.error = "input your email"
            isValid = false
        }else{
            lMail.isErrorEnabled = false
        }

        if (password.isNullOrEmpty()){
            lPassword.isErrorEnabled = true
            lPassword.error = "Input password"
            isValid = false
        }else{
            lPassword.isErrorEnabled = false
        }

        return isValid

        return isValid
    }
    fun String.isValidEmail(): Boolean
            = !this.isNullOrEmpty() &&
            Patterns.EMAIL_ADDRESS.matcher(this).matches()
}
