package com.bounswe.mercatus.Fragments

import android.content.Context
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.R
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ShowArticleActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_show_article)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.article)
        actionBar.setDisplayHomeAsUpEnabled(true)

        val title = findViewById<TextView>(R.id.showTitle)
        val content = findViewById<TextView>(R.id.showContent)
        val author = findViewById<TextView>(R.id.showAuthor)
        val articleID = intent.getStringExtra("article_header")

        getArticle(title, content, author, articleID!!.toInt())
    }
    private fun getArticle(title: TextView, content: TextView,author: TextView, articleID: Int){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getOneArticle(articleID, "Token " + tokenV.toString()).enqueue(object :
            Callback<GetArticleBody> {
            override fun onFailure(call: Call<GetArticleBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowArticleActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowArticleActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetArticleBody>, response: Response<GetArticleBody>) {
                if (response.code() == 200) {
                    title.text = response.body()?.title
                    content.text = response.body()?.content
                    author.text = response.body()?.author.toString()

                }
                else  {
                    Toast.makeText(this@ShowArticleActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
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
