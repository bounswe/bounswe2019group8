package com.bounswe.mercatus.Fragments.TradingEqps

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.R

class SearchEquipmentsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search_equipments)
        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.search_title)
        actionBar.setDisplayHomeAsUpEnabled(true)

        //TODO Implement search for trading equipments
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
