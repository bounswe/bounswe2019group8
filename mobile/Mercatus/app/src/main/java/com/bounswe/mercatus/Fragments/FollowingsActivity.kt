package com.bounswe.mercatus.Fragments

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.CustomAdapter
import com.bounswe.mercatus.Models.SearchShow
import com.bounswe.mercatus.Models.UserFollower
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class FollowingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_followings)

        val rv = findViewById<RecyclerView>(R.id.recyclerView1)
        rv.layoutManager = LinearLayoutManager(this@FollowingsActivity, RecyclerView.VERTICAL, false)

        val users = ArrayList<SearchShow>()

        var adapter = CustomAdapter(this@FollowingsActivity, users)
        rv.adapter = adapter

        val pkval = intent.getStringExtra("FOLLOWINGS")
        getUser(pkval.toLong(), adapter,  users)
    }
    /*
       Gets user based on pk value and a token that was coming from login
    */
    private fun getUser(pk : Long, adapter: CustomAdapter,  users: ArrayList<SearchShow>){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@FollowingsActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@FollowingsActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val res: List<UserFollower> ?= response.body()?.followings

                    for(i in res.orEmpty()){
                        users.add(SearchShow(i.first_name, i.last_name, i.pk))
                    }
                    //Toast.makeText(this@FollowingsActivity, users.get(0).name, Toast.LENGTH_SHORT).show()
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(this@FollowingsActivity, "Show profile failed.", Toast.LENGTH_SHORT)
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
