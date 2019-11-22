package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.User.FollowersActivity
import com.bounswe.mercatus.Fragments.User.FollowingsActivity
import com.bounswe.mercatus.Fragments.ModifyActivity
import com.bounswe.mercatus.Fragments.ModifyPasswordActivity
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException


class ProfileFragment : Fragment() {
    // initialization
    private lateinit var btnModify: Button
    private lateinit var btnModifyPassword: Button
    private lateinit var followingAction: LinearLayout
    private lateinit var followerAction: LinearLayout

    private lateinit var isTrader: TextView
    private lateinit var followers: TextView
    private lateinit var followings: TextView
    private lateinit var name: TextView
    private lateinit var email: TextView
    private lateinit var date: TextView


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_profile, container, false)

        // define here
        btnModify = root.findViewById(R.id.btnModify)
        btnModifyPassword = root.findViewById(R.id.btnModifyPassword)

        followingAction = root.findViewById(R.id.followingAction)
        followerAction = root.findViewById(R.id.followerAction)

        isTrader = root.findViewById(R.id.isTrader)
        followers = root.findViewById(R.id.followers)
        followings = root.findViewById(R.id.followings)
        name = root.findViewById(R.id.name)
        email = root.findViewById(R.id.email)
        date = root.findViewById(R.id.date)

        btnModify.setOnClickListener {
            val intent = Intent(activity, ModifyActivity::class.java)
            activity?.onBackPressed()
            startActivity(intent)
        }

        btnModifyPassword.setOnClickListener {
            val intent = Intent(activity, ModifyPasswordActivity::class.java)
            activity?.onBackPressed()
            startActivity(intent)
        }

        getUser(name, isTrader, followers, followings, date, email)

        return root
    }

    private fun getUser(name: TextView,
                        isTrader: TextView,
                        followers: TextView,
                        followings: TextView,
                        date: TextView,
                        email: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val my_pk = res?.getString("user_id", "Data Not Found!")

        mer.getUser(my_pk!!.toLong(), "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        activity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name
                    name.text = fullName
                    email.text = response.body()?.email
                    date.text = response.body()?.date_of_birth

                    followers.text = response.body()?.followers?.size.toString()
                    followings.text = response.body()?.followings?.size.toString()

                    if(response.body()?.groups?.get(0) == 2){
                        isTrader.text = "Trader"
                    }

                    followerAction.setOnClickListener {
                        val intent = Intent(activity, FollowersActivity::class.java)
                        intent.putExtra("FOLLOWERS", response.body()?.pk.toString())
                        startActivity(intent)
                    }
                    followingAction.setOnClickListener {
                        val intent = Intent(activity, FollowingsActivity::class.java)
                        intent.putExtra("FOLLOWINGS", response.body()?.pk.toString())
                        startActivity(intent)
                    }

                }
                else  {
                    Toast.makeText(activity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}