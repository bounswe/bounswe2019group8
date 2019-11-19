package com.bounswe.mercatus.Fragments

import android.app.DatePickerDialog
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import com.bounswe.mercatus.ui.ProfileFragment
import kotlinx.android.synthetic.main.activity_modify.*
import kotlinx.serialization.json.JSON
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

        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val userObj = JSON.parse(UserRes.serializer(), intent.getStringExtra("userJson") ?: "")

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val c = Calendar.getInstance()
        pickDate(c)
        floatingActionButton.setOnClickListener {
            val email = editMail.text.toString()
            val birthday = dateTv.text.toString()
            val password = editPassword.text.toString()
            val token = res.getString("token", "Data Not Found!")
            Log.d("TAG", token)
            val map = mutableMapOf<String, String>()
            if (email.isValidEmail()) {
                map["email"] = email
            }
            if(!birthday.isNullOrEmpty())
                map["date_of_birth"] = birthday
            if(!password.isNullOrEmpty())
                map["password"] = password

            mercatus.updateUser(map, userObj.pk, "Token ${token}").enqueue(
                object : Callback<ResponseBody> {
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
                        val intent = Intent(this@ModifyActivity, ProfileFragment::class.java)
                        intent.putExtra("userJson", JSON.stringify(UserRes.serializer(), userObj))
                        startActivity(intent)
                    }
                }
            )

        }

    }


    private fun String.isValidEmail(): Boolean = !this.isNullOrEmpty() &&
            Patterns.EMAIL_ADDRESS.matcher(this).matches()

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