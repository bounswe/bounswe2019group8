package com.bounswe.mercatus

import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserBody
import kotlinx.android.synthetic.main.activity_basic_user.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class BasicUserActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_basic_user)

        floatingActionButton.setOnClickListener{
            val name = editName.text.toString()
            val surname = editSurname.text.toString()
            val email = editMail.text.toString()
            val password = editPassword.text.toString()

            val date = "1906-05-13"
            if (isValidForm(email, name, surname, password)) {
                signup(date, email, password, surname, password)
            }
        }
    }
    private fun isValidForm(email: String, name: String, surname: String, password: String):Boolean{

        var isValid = true

        if (name.isNullOrEmpty()){
            layPassword.isErrorEnabled = true
            layPassword.error = "Name cannot be empty!"
            isValid = false
        }else{
            layPassword.isErrorEnabled = false
        }
        if (surname.isNullOrEmpty()){
            layPassword.isErrorEnabled = true
            layPassword.error = "Surname cannot be empty!"
            isValid = false
        }else{
            layPassword.isErrorEnabled = false
        }
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

    private fun signup(date: String, email: String, name: String, surname: String, password: String){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val registerInfo = UserBody(date,email,name, surname,password)

        mercatus.registerUser(registerInfo).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(
                    this@BasicUserActivity,
                    t.message,
                    Toast.LENGTH_SHORT
                ).show()
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@BasicUserActivity, "Registration success!", Toast.LENGTH_SHORT)
                        .show()

                } else {
                    Toast.makeText(this@BasicUserActivity, "Registration failed!", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })

    }
}
