package com.bounswe.mercatus.Fragments.User

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.User.UpdatePassword
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.change_password.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException


class ModifyPasswordActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.change_password)

        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.edit_profile)
        actionBar.setDisplayHomeAsUpEnabled(true)


        btnSavePassword.setOnClickListener {

            var passwordTxt = editModifyPassword.text.toString()
            var passwordConfirmTxt = editModifyPasswordConfirm.text.toString()

            if(isValidForm(passwordTxt,passwordConfirmTxt) ){


                updateUser(passwordTxt, passwordConfirmTxt)
            }

        }


       // getUser(editModifyPassword, editModifyPasswordConfirm)
    }
    private fun updateUser( password: String,passwordConfirm: String){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val my_pk = res.getString("user_id", "Data Not Found!")
        val tokenV = res.getString("token", "Data Not Found!")

        val newUser = UpdatePassword(password)
        mercatus.updatePassword(newUser , my_pk!!.toLong(), "Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ModifyPasswordActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ModifyPasswordActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    Toast.makeText(this@ModifyPasswordActivity, "Password changed successfully!", Toast.LENGTH_SHORT)
                        .show()
           //         onBackPressed()
                }
                else  {
                    Toast.makeText(this@ModifyPasswordActivity, "Password can't change.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }



    /*
    Gets user based on pk value and a token that was coming from login
     */

    private fun isValidForm(passwordTxt: String, passwordConfirmTxt: String):Boolean{

        var isValid = true

        if ((passwordTxt.isEmpty())){
            layModifyPassword.isErrorEnabled =  true
            layModifyPassword.error = "Password cannot be empty!"
            isValid = false
        }else{
            layModifyPassword.isErrorEnabled = false

        }
        if(passwordTxt.length <6){
            layModifyPassword.isErrorEnabled =  true
            layModifyPassword.error = "Password must longer than 6!"
            isValid = false
        }
        else{
            layModifyPassword.isErrorEnabled = false

        }
        if(passwordTxt!=passwordConfirmTxt ){
            layModifyPasswordConfirmation.isErrorEnabled =  true
            layModifyPasswordConfirmation.error = "Password does not match!"
            isValid = false
        }
        else{
            layModifyPasswordConfirmation.isErrorEnabled = false
        }

        return isValid
    }

/*

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
*/

}