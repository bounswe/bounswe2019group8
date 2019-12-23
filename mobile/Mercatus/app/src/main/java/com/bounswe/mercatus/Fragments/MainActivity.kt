package com.bounswe.mercatus.Fragments

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
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
import com.bounswe.mercatus.Fragments.Entrance.LoginActivity
import com.bounswe.mercatus.Fragments.User.ModifyPasswordActivity
import com.bounswe.mercatus.R
import com.google.android.material.navigation.NavigationView


class MainActivity : AppCompatActivity(){

    private lateinit var appBarConfiguration: AppBarConfiguration

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        val drawerLayout: DrawerLayout = findViewById(R.id.drawer_layout)
        val navView: NavigationView = findViewById(R.id.nav_view)
        val navController = findNavController(R.id.nav_host_fragment)

        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home,
                R.id.nav_articles,
                R.id.nav_events,
                R.id.nav_portfolios,
                R.id.nav_forex,
                R.id.nav_digital,
                R.id.nav_other,
                R.id.nav_profile,
                R.id.nav_profit,
                R.id.nav_assets
            ), drawerLayout
        )

        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }
    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        R.id.action_logout -> {
            Toast.makeText(this, "Successfully logged out", Toast.LENGTH_LONG).show()
            val intent = Intent(this@MainActivity, LoginActivity::class.java)

            val preferences = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
            val editor = preferences.edit()
            editor.putString("token", " ")
            editor.commit()

            startActivity(intent)
            finish()
            true
        }

        R.id.action_settings -> {
            Toast.makeText(this, "Action setting", Toast.LENGTH_LONG).show()
            Log.d("action settings","setting works")


            val intent = Intent(this@MainActivity, ModifyPasswordActivity::class.java)
            this@MainActivity?.onBackPressed()
            startActivity(intent)
            finish()
            true
        }

        else -> {
            // If we got here, the user's action was not recognized.
            // Invoke the superclass to handle it.
            super.onOptionsItemSelected(item)
        }
    }
    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }
}
