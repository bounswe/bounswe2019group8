package com.bounswe.mercatus.Fragments.Entrance

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.MainActivity
import com.bounswe.mercatus.Models.User.SignInBody
import com.bounswe.mercatus.Models.User.SignInRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_login.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val sharedPreferences = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()

        if(sharedPreferences.getString("token"," ") !=" "){

            val intent = Intent(this@LoginActivity, MainActivity::class.java)
            startActivity(intent)
            finish()
        }

        // Button click listener
        buttonSigin.setOnClickListener {
            val email = editMail.text.toString()
            val password = editPassword.text.toString()

            val sharedPreferences = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
            val editor = sharedPreferences.edit()

            if (isValidForm(email, password)){
                signin(email, password, editor)
            }
        }

        buttonRegister.setOnClickListener {
            val intent = Intent(this, ChooseActivity::class.java)
            startActivity(intent)
            overridePendingTransition(
                R.anim.slide_in_right,
                R.anim.slide_out_left
            )
        }
    }
    private fun isValidForm(email: String, password: String):Boolean{

        var isValid = true
        if (!email.isValidEmail()){
            layMail.isErrorEnabled = true
            layMail.error = "Email address is wrong!"
            isValid = false
        }else{
            layMail.isErrorEnabled = false
        }

        if (password.isNullOrEmpty()){
            layPassword.isErrorEnabled = true
            layPassword.error = "Password cannot be empty!"
            isValid = false
        }else{
            layPassword.isErrorEnabled = false
        }
        return isValid
    }
    private fun String.isValidEmail(): Boolean
            = !this.isNullOrEmpty() &&
            Patterns.EMAIL_ADDRESS.matcher(this).matches()

    private fun signin(email: String, password: String, editor: SharedPreferences.Editor){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val signInInfo =
            SignInBody(email, password)

        mercatus.signin(signInInfo).enqueue(object : Callback<SignInRes> {
            override fun onFailure(call: Call<SignInRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@LoginActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@LoginActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<SignInRes>, response: Response<SignInRes>) {
                if (response.code() == 200) {
                    val sharedPreferences2 = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
                    editor.putString("token", response.body()?.token)
                    editor.putString("user_id", response.body()?.user_id.toString())
                    editor.commit()

                    Toast.makeText(this@LoginActivity, "Login success! ",Toast.LENGTH_SHORT).show()

                    val intent = Intent(this@LoginActivity, MainActivity::class.java)
                    startActivity(intent)
                    overridePendingTransition(
                        R.anim.slide_in_right,
                        R.anim.slide_out_left
                    )

                    finish()

                }
                else if(response.code() == 401){
                    Toast.makeText(this@LoginActivity, "Password and mail does not match!", Toast.LENGTH_SHORT).show()
                }
                else {
                    Toast.makeText(this@LoginActivity, "Login failed!", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }
}