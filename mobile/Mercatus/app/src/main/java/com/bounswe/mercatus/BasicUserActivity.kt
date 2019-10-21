package com.bounswe.mercatus

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.User
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

            val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

            val registerInfo = User("1906-05-13","a@b.com","a", "b","s")


            mercatus.registerUser(registerInfo).enqueue(object :
                Callback<ResponseBody> {
                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(
                        this@BasicUserActivity,
                        "Unexpected server error occurred. Please try again.",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.code() == 201) {
                        Toast.makeText(this@BasicUserActivity, "Successfully registered!", Toast.LENGTH_SHORT)
                            .show()
                    } else {
                        Toast.makeText(this@BasicUserActivity, "Registration failed.", Toast.LENGTH_SHORT)
                            .show()
                    }
                }
            })
        }


    }
}
