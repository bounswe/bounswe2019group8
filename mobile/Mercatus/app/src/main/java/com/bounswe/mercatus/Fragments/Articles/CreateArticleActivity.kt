package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.CreateArticleBody
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_create_article.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class CreateArticleActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_article)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.create_article)
        actionBar.setDisplayHomeAsUpEnabled(true)

        createNewArticle.setOnClickListener {
            val title = editTitle.text.toString()
            val contentA = editContent.text.toString()
            if (isValidForm(title, contentA)){
                createArticle(title, contentA)
            }
        }
    }
    private fun isValidForm(title: String, contentA: String):Boolean{

        var isValid = true
        if (title.isEmpty()){
            layTitle.isErrorEnabled = true
            layTitle.error = "Title cannot be empty!"
            isValid = false
        }else{
            layTitle.isErrorEnabled = false
        }

        if (contentA.isEmpty()){
            layContent.isErrorEnabled = true
            layContent.error = "Content cannot be empty!"
            isValid = false
        }else{
            layContent.isErrorEnabled = false
        }
        return isValid
    }
    private fun createArticle(title: String, contentA: String){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val aB = CreateArticleBody(title, contentA)

        mer.createArticle(aB,"Token " + tokenV.toString()).enqueue(object :
            Callback<GetArticleBody> {
            override fun onFailure(call: Call<GetArticleBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@CreateArticleActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@CreateArticleActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetArticleBody>, response: Response<GetArticleBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@CreateArticleActivity, "Article created successfully.", Toast.LENGTH_SHORT)
                        .show()
                    onSupportNavigateUp()
                }
                else  {
                    Toast.makeText(this@CreateArticleActivity, "Create article failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        finish()
        return true
    }
}
