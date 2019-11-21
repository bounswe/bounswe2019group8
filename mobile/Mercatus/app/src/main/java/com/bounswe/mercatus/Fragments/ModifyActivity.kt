package com.bounswe.mercatus.Fragments

import android.app.DatePickerDialog
import android.content.Context
import android.os.Bundle
import android.util.Patterns
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UpdateUserBody
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import kotlinx.android.synthetic.main.activity_modify.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException
import java.util.*


class ModifyActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_modify)

        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.edit_profile)
        actionBar.setDisplayHomeAsUpEnabled(true)

        getUser(editModifyName, editModifySurname, isTrader, dateModifyTv, editModifyEmail)
    }
    private fun updateUser(email: String, name: String, surname: String, date: String){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val my_pk = res.getString("user_id", "Data Not Found!")
        val tokenV = res.getString("token", "Data Not Found!")

        val newUser = UpdateUserBody(email, name, surname, date)
        mercatus.updateUser(newUser , my_pk!!.toLong(), "Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ModifyActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ModifyActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    Toast.makeText(this@ModifyActivity, "Edit profile success!", Toast.LENGTH_SHORT)
                        .show()
                    onBackPressed()
                }
                else  {
                    Toast.makeText(this@ModifyActivity, "Edit profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    /*
    Gets user based on pk value and a token that was coming from login
     */
    private fun getUser(name: TextInputEditText, surname: TextInputEditText,
                        isTrader: TextView, date: TextView, email: TextInputEditText){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val my_pk = res.getString("user_id", "Data Not Found!")
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getUser(my_pk!!.toLong(), "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ModifyActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ModifyActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    name.setText(response.body()?.first_name)
                    surname.setText(response.body()?.last_name)
                    email.setText(response.body()?.email)
                    date.text = response.body()?.date_of_birth

                    if(response.body()?.groups?.get(0) == 2){
                        isTrader.text = "Trader"
                    }

                    val c = Calendar.getInstance()
                    pickDate(c)

                    btnSave.setOnClickListener {
                        var nameTxt = editModifyName.text.toString()
                        var surnameTxt = editModifySurname.text.toString()
                        var emailTxt = editModifyEmail.text.toString()
                        var dateTxt = dateModifyTv.text.toString()

                        if(response.body()?.first_name == nameTxt
                            && response.body()?.last_name == surnameTxt
                            && response.body()?.email == emailTxt
                            && response.body()?.date_of_birth == dateTxt){
                            Toast.makeText(this@ModifyActivity, "Nothing is changed!" , Toast.LENGTH_SHORT)
                                .show()
                        }
                        else{
                            nameTxt = editModifyName.text.toString()
                            surnameTxt = editModifySurname.text.toString()
                            emailTxt = editModifyEmail.text.toString()
                            dateTxt = dateModifyTv.text.toString()

                            if(isValidForm(emailTxt, nameTxt, surnameTxt, dateTxt)){
                                updateUser(emailTxt, nameTxt, surnameTxt, dateTxt)
                            }
                        }
                    }
                }
                else  {
                    Toast.makeText(this@ModifyActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun pickDate(c : Calendar){
        val year = c.get(Calendar.YEAR)
        val month = c.get(Calendar.MONTH)
        val day = c.get(Calendar.DAY_OF_MONTH)

        dataModifyPick.setOnClickListener{
            val dpd = DatePickerDialog(this, DatePickerDialog.OnDateSetListener{ view, mYear, Mmonth, mDayOfMonth ->
                dateModifyTv.setText("" + mYear + "-" + Mmonth + "-" + mDayOfMonth)
            }, year, month, day)
            dpd.show()
        }
    }
    private fun isValidForm(email: String, name: String, surname: String, date:String):Boolean{

        var isValid = true

        if (name.isEmpty()){
            layModifyName.isErrorEnabled = true
            layModifyName.error = "Name cannot be empty!"
            isValid = false
        }else{
            layModifyName.isErrorEnabled = false
        }
        if (surname.isEmpty()){
            layModifySurname.isErrorEnabled = true
            layModifySurname.error = "Surname cannot be empty!"
            isValid = false
        }else{
            layModifySurname.isErrorEnabled = false
        }
        if (!email.isValidEmail()){
            layModifyEmail.isErrorEnabled = true
            layModifyEmail.error = "Email address is wrong!"
            isValid = false
        }else{
            layModifyEmail.isErrorEnabled = false
        }
        if (date == "Date"){
            dateModifyTv.error = "Date cannot be empty!"
            isValid = false
        }
        return isValid
    }
    private fun String.isValidEmail(): Boolean
            = this.isNotEmpty() &&
            Patterns.EMAIL_ADDRESS.matcher(this).matches()

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}