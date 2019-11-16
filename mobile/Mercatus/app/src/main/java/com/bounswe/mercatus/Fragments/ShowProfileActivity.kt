package com.bounswe.mercatus.Fragments

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.Models.FollowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_show_profile.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ShowProfileActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_show_profile)
        val pkval = intent.getStringExtra("pk_val")
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val user_id = res.getString("user_id", "Data Not Found!")

        val name = findViewById<TextView>(R.id.fullName)
        val isTrader = findViewById<TextView>(R.id.isTrader)
        val followers = findViewById<TextView>(R.id.followers)
        val followings = findViewById<TextView>(R.id.followings)
        val date = findViewById<TextView>(R.id.date)
        val email = findViewById<TextView>(R.id.email)

        getUser(pkval.toLong(),
            name,
            isTrader,
            followers,
            followings,
            date,
            email)

        /*
        When click follow me button, set action here
         */
        follow.setOnClickListener {
            followUser(pkval.toLong(),
                user_id!!.toLong() )
        }
    }

    private fun followUser(pk : Long, user_id : Long){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val fB = FollowBody(pk)

        mercatus.followUser(fB,user_id ,"Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowProfileActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowProfileActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) =


                if (response.code() == 200) {
                    Toast.makeText(this@ShowProfileActivity, response.body()?.first_name, Toast.LENGTH_SHORT)
                        .show()

                }
                else  {
                    Toast.makeText(this@ShowProfileActivity, "Following Failed "+response.code(), Toast.LENGTH_SHORT)
                        .show()
                }

        })
    }

    /*
    Gets user based on pk value and a token that was coming from login
     */
    private fun getUser(pk : Long, name: TextView, isTrader: TextView,
                        followers: TextView, followings: TextView, date: TextView,email: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowProfileActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowProfileActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name
                    name.text = fullName
                    email.text = response.body()?.email
                    date.text = response.body()?.date_of_birth

                    followers.text = response.body()?.followers?.size.toString()
                    followings.text = response.body()?.followings?.size.toString()

                    if(response.body()?.groups?.get(0) == 2){
                        isTrader.text = "Trader"
                    }

                    followerAction.setOnClickListener {
                        val intent = Intent(this@ShowProfileActivity, FollowersActivity::class.java)
                        intent.putExtra("FOLLOWERS", response.body()?.pk.toString())
                        startActivity(intent)
                        overridePendingTransition(
                            R.anim.slide_in_right,
                            R.anim.slide_out_left
                        )
                    }
                    followingAction.setOnClickListener {
                        val intent = Intent(this@ShowProfileActivity, FollowingsActivity::class.java)
                        intent.putExtra("FOLLOWINGS", response.body()?.pk.toString())
                        startActivity(intent)
                        overridePendingTransition(
                            R.anim.slide_in_right,
                            R.anim.slide_out_left
                        )
                    }

                }
                else  {
                    Toast.makeText(this@ShowProfileActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}
