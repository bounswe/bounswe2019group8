package com.bounswe.mercatus

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class FollowersActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_followers)

        Toast.makeText(this, "followers", Toast.LENGTH_SHORT)
            .show()
    }

}
