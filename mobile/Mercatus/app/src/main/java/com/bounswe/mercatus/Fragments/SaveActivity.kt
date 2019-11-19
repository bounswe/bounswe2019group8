package com.bounswe.mercatus

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.ui.ProfileFragment
import kotlinx.android.synthetic.main.activity_modify.*


class SaveActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_modify)

        floatingActionButton.setOnClickListener {
            val intent = Intent(this, ProfileFragment::class.java)
            startActivity(intent)
            finish()
        }

    }


}