package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.text.method.ScrollingMovementMethod
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.CommentAdapter
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.ModelsgetArticles.CommentShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_show_article.*
import kotlinx.android.synthetic.main.dialog_new_category.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ShowEventActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_show_article)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.article)
        actionBar.setDisplayHomeAsUpEnabled(true)

        val title = findViewById<TextView>(R.id.showTitle)
        val content = findViewById<TextView>(R.id.showContent)
        content.movementMethod = ScrollingMovementMethod.getInstance()
        val author = findViewById<TextView>(R.id.showAuthor)
        val articleID = intent.getStringExtra("article_header")

        getArticle(title, content, author, articleID!!.toInt())

        val rv = findViewById<RecyclerView>(R.id.recyclerViewComments)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val commentsList = ArrayList<CommentShowBody>()

        var adapter = CommentAdapter(this@ShowEventActivity, commentsList)
        rv.adapter = adapter



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
                        this@ShowEventActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowEventActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetArticleBody>, response: Response<GetArticleBody>) {
                if (response.code() == 200) {
                    title.text = response.body()?.title
                    content.text = response.body()?.content

                }
                else  {
                    Toast.makeText(this@ShowEventActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }


    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
