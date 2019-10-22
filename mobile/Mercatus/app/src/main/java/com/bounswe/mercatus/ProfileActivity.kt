package com.bounswe.mercatus

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.content.Intent
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserRes
import kotlinx.android.synthetic.main.activity_profile.*
import kotlinx.serialization.json.JSON


class ProfileActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val userObj = JSON.parse(UserRes.serializer(), intent.getStringExtra("userJson") ?: "")

        btnModify.setOnClickListener {
            val intent = Intent(this, ModifyActivity::class.java)
            intent.putExtra("userJson", JSON.stringify(UserRes.serializer(), userObj))
            startActivity(intent)
        }

        btnSearch.setOnClickListener {
            val intent = Intent(this, SearchActivity::class.java)
            intent.putExtra("userJson", JSON.stringify(UserRes.serializer(), userObj))
            startActivity(intent)
        }


        profileName.text = "Name: "+ userObj.first_name +" "+userObj.last_name;
        profileMail.text = "Email: "+ userObj.email;
        profileBirthday.text = "Birthday: "+ userObj.date_of_birth;


    }


}