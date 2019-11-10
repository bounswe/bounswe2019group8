package com.bounswe.mercatus

import android.app.DatePickerDialog
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
import com.bounswe.mercatus.Models.UserBody
import kotlinx.android.synthetic.main.activity_basic_user.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException
import java.util.*

class BasicUserActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_basic_user)

        val c = Calendar.getInstance()
        pickDate(c)

        floatingActionButton.setOnClickListener{
            val name = editName.text.toString()
            val surname = editSurname.text.toString()
            val email = editMail.text.toString()
            val password = editPassword.text.toString()

            val date = dateTv.text.toString()
            if (isValidForm(email, name, surname, password, date)) {
                signup(date, email, name, surname, password)
            }
        }
    }
    private fun signin(email: String, password: String, editor: SharedPreferences.Editor){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val signInInfo = SignInBody(email, password)

        mercatus.signin(signInInfo).enqueue(object : Callback<SignInRes> {
            override fun onFailure(call: Call<SignInRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@BasicUserActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@BasicUserActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<SignInRes>, response: Response<SignInRes>) {
                if (response.code() == 200) {
                    editor.putString("token", response.body()?.token)
                    editor.apply()

                    Toast.makeText(this@BasicUserActivity, "Login success!.", Toast.LENGTH_SHORT).show()

                    val intent = Intent(this@BasicUserActivity, MainActivity::class.java)
                    startActivity(intent)
                    overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)

                } else {
                    Toast.makeText(this@BasicUserActivity, "Login failed!", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }
    private fun isValidForm(email: String, name: String, surname: String, password: String, date: String):Boolean{

        var isValid = true

        if (name.isNullOrEmpty()){
            layName.isErrorEnabled = true
            layName.error = "Name cannot be empty!"
            isValid = false
        }else{
            layName.isErrorEnabled = false
        }
        if (surname.isNullOrEmpty()){
            laySurname.isErrorEnabled = true
            laySurname.error = "Surname cannot be empty!"
            isValid = false
        }else{
            laySurname.isErrorEnabled = false
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
        if (date == "Date"){
            dateTv.error = "Date cannot be empty!"
            isValid = false
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
                    val sharedPreferences = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
                    val editor = sharedPreferences.edit()
                    signin(email, password, editor)
                }
                else  {
                    Toast.makeText(this@BasicUserActivity, "Registration failed", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun pickDate(c : Calendar){
        val year = c.get(Calendar.YEAR)
        val month = c.get(Calendar.MONTH)
        val day = c.get(Calendar.DAY_OF_MONTH)

        dataPick.setOnClickListener{
            val dpd = DatePickerDialog(this, DatePickerDialog.OnDateSetListener{view, mYear, Mmonth, mDayOfMonth ->
                dateTv.setText("" + mYear + "-" + Mmonth + "-" + mDayOfMonth)
            }, year, month, day)
            dpd.show()
        }
    }
}
