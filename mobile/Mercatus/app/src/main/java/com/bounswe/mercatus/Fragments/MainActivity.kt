package com.bounswe.mercatus.Fragments

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController

import com.google.android.material.floatingactionbutton.FloatingActionButton
import com.google.android.material.navigation.NavigationView
import android.text.method.TextKeyListener.clear
import android.R.id.edit
import android.content.SharedPreferences
import androidx.core.app.ComponentActivity.ExtraData
import androidx.core.content.ContextCompat.getSystemService
import android.icu.lang.UCharacter.GraphemeClusterBreak.T
import android.R



class MainActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(com.bounswe.mercatus.R.layout.activity_main)
        val toolbar: Toolbar = findViewById(com.bounswe.mercatus.R.id.toolbar)
        setSupportActionBar(toolbar)

        val token = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val fab: FloatingActionButton = findViewById(com.bounswe.mercatus.R.id.fab)
        fab.setOnClickListener { view ->
            val intent = Intent(this@MainActivity, SearchActivity::class.java)
            startActivity(intent)
            /*
            Smooth activity transition
             */
            overridePendingTransition(
                com.bounswe.mercatus.R.anim.slide_in_right,
                com.bounswe.mercatus.R.anim.slide_out_left
            )
        }
        val drawerLayout: DrawerLayout = findViewById(com.bounswe.mercatus.R.id.drawer_layout)
        val navView: NavigationView = findViewById(com.bounswe.mercatus.R.id.nav_view)
        val navController = findNavController(com.bounswe.mercatus.R.id.nav_host_fragment)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                com.bounswe.mercatus.R.id.nav_home, com.bounswe.mercatus.R.id.nav_gallery, com.bounswe.mercatus.R.id.nav_slideshow,
                com.bounswe.mercatus.R.id.nav_tools, com.bounswe.mercatus.R.id.nav_share, com.bounswe.mercatus.R.id.nav_send
            ), drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(com.bounswe.mercatus.R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(com.bounswe.mercatus.R.id.nav_host_fragment)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        com.bounswe.mercatus.R.id.action_logout -> {
            msgShow("Successfully logged out")

            val intent = Intent(this@MainActivity, LoginActivity::class.java)




            val preferences = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
            val editor = preferences.edit()
            editor.putString("token", " ")
            editor.commit()

            startActivity(intent)
            finish()
            true
        }
        com.bounswe.mercatus.R.id.action_settings -> {
            msgShow("action_settings button is clicked")
            true
        }

        else -> {
            // If we got here, the user's action was not recognized.
            // Invoke the superclass to handle it.
            super.onOptionsItemSelected(item)
        }
    }

    fun msgShow(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
    }

}
