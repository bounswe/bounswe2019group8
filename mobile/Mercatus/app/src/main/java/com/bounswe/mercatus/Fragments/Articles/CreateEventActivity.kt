package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.CreateEventBody
import com.bounswe.mercatus.Models.GetEventBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_create_event.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class CreateEventActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_event)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.create_event)
        actionBar.setDisplayHomeAsUpEnabled(true)

        /*
    val name: String,
val date: String,
val time: String,
val country: String,
val importance: Float
 */

        createNewEvent.setOnClickListener {
            val name = editName.text.toString()
            val date = editDate.text.toString()
            val time =  editTime.text.toString()
            val country = editCountry.text.toString()
            val importance1 = editImportance.text.toString()+"f"
            val importance = importance1.toFloat()
            if (isValidForm(name, date,time, country,importance )){
                createEvent(name, date,time, country, importance )
            }
        }
    }
    private fun isValidForm(name: String, date: String, time: String,  country: String,importance: Float):Boolean{

        var isValid = true
        if (name.isEmpty()){
            layName.isErrorEnabled = true
            layName.error = "Name is invalid!"
            isValid = false
        }else{
            layName.isErrorEnabled = false
        }

        if (date.isEmpty()){
            layDate.isErrorEnabled = true
            layDate.error = " Date is invalid!"
            isValid = false
        }else{
            layDate.isErrorEnabled = false
        }

        if (time.isEmpty()){
            layTime.isErrorEnabled = true
            layTime.error = "Time is invalid!"
            isValid = false
        }else{
            layTime.isErrorEnabled = false
        }

        if (country.isEmpty()){
            layCountry.isErrorEnabled = true
            layCountry.error = " Country is invalid!"
            isValid = false
        }else{
            layCountry.isErrorEnabled = false
        }




        return isValid
    }


    private fun createEvent(name: String, date: String,  time: String,  country: String,  importance: Float){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val eventBody = CreateEventBody(name, date,time, country,importance)

        mer.createEvent(eventBody,"Token " + tokenV.toString()).enqueue(object :
            Callback<GetEventBody> {
            override fun onFailure(call: Call<GetEventBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@CreateEventActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@CreateEventActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetEventBody>, response: Response<GetEventBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@CreateEventActivity, "Event created successfully.", Toast.LENGTH_SHORT)
                        .show()
                    onSupportNavigateUp()
                }
                else  {
                    Toast.makeText(this@CreateEventActivity, "Create event failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        finish()
        return true
    }
}
