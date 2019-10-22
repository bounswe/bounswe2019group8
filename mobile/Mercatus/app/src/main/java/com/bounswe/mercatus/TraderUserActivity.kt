package com.bounswe.mercatus

import android.app.DatePickerDialog
import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserBody
import kotlinx.android.synthetic.main.activity_trader_user.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*

class TraderUserActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_trader_user)

        val c = Calendar.getInstance()
        pickDate(c)
        floatingActionButton.setOnClickListener{
            val name = editName.text.toString()
            val surname = editSurname.text.toString()
            val email = editMail.text.toString()
            val password = editPassword.text.toString()
            val iban = editIban.text.toString()
            val id  = editID.text.toString()

            val date = dateTv.text.toString()
            if (isValidForm(email, name, surname, password, iban, id, date)) {
                signup(date, email, password, surname, password)
            }
        }
    }

    private fun isValidForm(email: String, name: String, surname: String,
                            password: String, iban: String, id: String, date:String):Boolean{

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
        if (iban.length > 24 || iban.length < 24){
            layIban.isErrorEnabled = true
            layIban.error = "Iban is not valid!"
            isValid = false
        }else{
            layIban.isErrorEnabled = false
        }
        if (id.length > 11 || id.length < 11){
            layID.isErrorEnabled = true
            layID.error = "TC id is not valid!"
            isValid = false
        }else{
            layID.isErrorEnabled = false
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
                    this@TraderUserActivity,
                    t.message,
                    Toast.LENGTH_SHORT
                ).show()
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@TraderUserActivity, "Registration success!", Toast.LENGTH_SHORT)
                        .show()

                } else {
                    Toast.makeText(this@TraderUserActivity, "Registration failed!", Toast.LENGTH_SHORT)
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
            val dpd = DatePickerDialog(this, DatePickerDialog.OnDateSetListener{ view, mYear, Mmonth, mDayOfMonth ->
                dateTv.setText("" + mYear + "-" + Mmonth + "-" + mDayOfMonth)
            }, year, month, day)
            dpd.show()
        }
    }
}
