package com.bounswe.mercatus.Fragments.Portfolios

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.CheckBox
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.User.FollowersActivity
import com.bounswe.mercatus.Fragments.User.FollowingsActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_create_article.*
import kotlinx.android.synthetic.main.activity_create_portfolio.*
import kotlinx.android.synthetic.main.activity_show_profile.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class CreatePortfolioActivity : AppCompatActivity() {

  //  private lateinit var checkBox: CheckBox

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_portfolio)





    //    val root = inflater.inflate(R.layout.fragment_profile, container, false)


        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.create_portfolio)
        actionBar.setDisplayHomeAsUpEnabled(true)

//       checkBox = root.findViewById(R.id.checkBox)

        var isPrivate = false
        checkBox.setOnCheckedChangeListener { buttonView, isChecked ->
            isPrivate = isChecked
            Log.d("Activity profile,", isChecked.toString())
            Log.d("Activity profile,", "  check box is clicked")


        }
        createNewPortfolio.setOnClickListener {
            val name = editName.text.toString()
            if (isValidForm(name)){
                createPortfolio(name, isPrivate)
            }
        }
    }
    private fun isValidForm(name: String):Boolean{

        var isValid = true
        if (name.isEmpty()){
            layName.isErrorEnabled = true
            layName.error = "Name cannot be empty!"
            isValid = false
        }else{
            layName.isErrorEnabled = false
        }


        return isValid
    }
    private fun createPortfolio(name: String, isPrivate: Boolean){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val portfolioBody = CreatePortfolioBody(name,isPrivate)


        val user_id = res?.getString("user_id", "Data Not Found!")

        Log.d("CREATE_PORTFOLIO", ""+user_id)

        mercatus.createPortfolio(portfolioBody,user_id!!.toLong() ,"Token " + tokenV.toString()).enqueue(object :
            Callback<GetPortfolioBody> {
            override fun onFailure(call: Call<GetPortfolioBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@CreatePortfolioActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@CreatePortfolioActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetPortfolioBody>, response: Response<GetPortfolioBody>) =


                if (response.code() == 201) {
                    Log.d("CreatePortfolio: ",""+response.body())
                    Toast.makeText(this@CreatePortfolioActivity, response.body()?.name, Toast.LENGTH_SHORT)
                        .show()
                    finish()

                }
                else  {
                    Toast.makeText(this@CreatePortfolioActivity, "Following Failed "+response.code(), Toast.LENGTH_SHORT)
                        .show()
                }
        })
    }



    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        finish()
        return true
    }
}


