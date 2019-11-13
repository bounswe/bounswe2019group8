package com.bounswe.mercatus

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Adapters.CustomAdapter
import com.bounswe.mercatus.Models.SearchShow

class FollowingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_followings)

        val rv = findViewById<RecyclerView>(R.id.recyclerView1)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val users = ArrayList<SearchShow>()

        var adapter = CustomAdapter(this@FollowingsActivity, users)
        rv.adapter = adapter
    }

}
