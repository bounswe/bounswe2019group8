package com.bounswe.mercatus

import android.app.DatePickerDialog
import android.content.Context
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import android.util.Patterns
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserRes
import kotlinx.android.synthetic.main.activity_basic_user.*
import kotlinx.android.synthetic.main.activity_modify.*
import kotlinx.android.synthetic.main.activity_modify.dataPick
import kotlinx.android.synthetic.main.activity_modify.dateTv
import kotlinx.android.synthetic.main.activity_modify.editMail
import kotlinx.android.synthetic.main.activity_modify.editPassword
import kotlinx.android.synthetic.main.activity_modify.floatingActionButton
import kotlinx.serialization.internal.MapEntrySerializer
import kotlinx.serialization.internal.MapLikeSerializer
import kotlinx.serialization.json.JSON
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.stringify
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*
import kotlin.collections.HashMap


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
                        print("sadfsdaf")
                    }
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        print("sdffd")
                        val intent = Intent(this@ModifyActivity, ProfileActivity::class.java)
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