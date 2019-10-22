package com.bounswe.mercatus

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.SignInBody
import com.bounswe.mercatus.Models.SignInRes
import com.bounswe.mercatus.Models.UserRes
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.serialization.json.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.Serializable

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)



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

        buttonGuest.setOnClickListener {
            val intent = Intent(this, GuestActivity::class.java)
            startActivity(intent)
        }

        buttonRegister.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
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
        val signInInfo = SignInBody(email, password)

        mercatus.signin(signInInfo).enqueue(object : Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                //Log.i("ApiRequest", "Request failed: " + t.toString())
                Toast.makeText(
                    this@LoginActivity,
                    t.message,
                    Toast.LENGTH_SHORT
                ).show()
            }

            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    val signInRes = JSON.parse(SignInRes.serializer(), response.body()?.string() ?: "{\"error\": \"error\"}")
                    mercatus.getUser(signInRes.user_id, "Token ${signInRes.token}").enqueue(object : Callback<ResponseBody> {
                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                            print("hataa")
                        }

                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            print("yass")
                            val userObj = JSON.parse(UserRes.serializer(), response.body()?.string() ?: "{\"error\": \"error\"}")
                            val intent = Intent(this@LoginActivity, ProfileActivity::class.java)


                            editor.putString("token", signInRes.token)
                            editor.apply()

                            intent.putExtra("userJson", JSON.stringify(UserRes.serializer(), userObj))
                            startActivity(intent)
                            finish()
                            print(userObj)
                        }
                    })

                } else {
                    Toast.makeText(this@LoginActivity, "Login failed.", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }
}
