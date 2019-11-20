package com.bounswe.mercatus.Fragments

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.R

class CreateCommentActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_comment)
        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.create_comment)
        actionBar.setDisplayHomeAsUpEnabled(true)
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
