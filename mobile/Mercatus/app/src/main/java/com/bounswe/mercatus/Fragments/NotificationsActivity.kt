package com.bounswe.mercatus.Fragments

import android.content.Context
import android.os.Bundle
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.NotifyAdapter
import com.bounswe.mercatus.Models.NotificationsBody
import com.bounswe.mercatus.Models.NotifyShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_notifications.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class NotificationsActivity : AppCompatActivity() {
    private var hasHeader: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.notifications)
        actionBar.setDisplayHomeAsUpEnabled(true)

        getNotifications()

    }
    private fun getNotifications(){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val user_id = res.getString("user_id", "Data Not Found!")

        mer.getNotifications(user_id!!.toLong(), "Token " + tokenV.toString()).enqueue(object :
            Callback<List<NotificationsBody>> {
            override fun onFailure(call: Call<List<NotificationsBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@NotificationsActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@NotificationsActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<NotificationsBody>>, response: Response<List<NotificationsBody>>) {
                if (response.code() == 200) {
                    Toast.makeText(this@NotificationsActivity, "You have notifications.", Toast.LENGTH_SHORT)
                        .show()

                    val respo: List<NotificationsBody>? = response.body()
                    val notiftyList = ArrayList<NotifyShowBody>()

                    val rv = findViewById<RecyclerView>(R.id.recyclerViewNotify)
                    rv.layoutManager = LinearLayoutManager(this@NotificationsActivity, RecyclerView.VERTICAL, false)

                    for(i in respo.orEmpty()){
                        notiftyList.add(
                            NotifyShowBody(
                                i.reason,
                                i.source_user,
                                i.created_at
                            )
                        )
                    }

                    val adapter = NotifyAdapter(this@NotificationsActivity, notiftyList)

                    rv.adapter = adapter
                    runLayoutAnimation()
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(this@NotificationsActivity, "Notification fetch failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun runLayoutAnimation() = recyclerViewNotify.apply {
        layoutAnimation = AnimationUtils.loadLayoutAnimation(context, R.anim.layout_animation_fall_down)
        adapter?.notifyDataSetChanged()
        scheduleLayoutAnimation()

        if (hasHeader) {
            layoutAnimationListener = object : Animation.AnimationListener {
                override fun onAnimationStart(animation: Animation?) {
                    layoutManager?.findViewByPosition(0)?.clearAnimation()
                }
                override fun onAnimationEnd(animation: Animation?) = Unit
                override fun onAnimationRepeat(animation: Animation?) = Unit
            }
        }
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}
