package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.Article.EditArticleBody
import com.bounswe.mercatus.Models.Article.GetArticleBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_edit_article.*
import kotlinx.android.synthetic.main.article_layout.editArticle
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class EditArticleActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_article)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.edit_article)
        actionBar.setDisplayHomeAsUpEnabled(true)

        val title = findViewById<TextView>(R.id.editTitle)
        val content = findViewById<TextView>(R.id.editContent)
        val articleID = intent.getStringExtra("article_header")
        getArticle(articleID!!.toInt(), title, content)
    }
    private fun isValidForm(title: String, content: String):Boolean{

        var isValid = true

        if (title.isEmpty()){
            layTitle.isErrorEnabled = true
            layTitle.error = "Title cannot be empty!"
            isValid = false
        }else{
            layTitle.isErrorEnabled = false
        }
        if (content.isEmpty()){
            layContent.isErrorEnabled = true
            layContent.error = "Content cannot be empty!"
            isValid = false
        }else{
            layContent.isErrorEnabled = false
        }

        return isValid
    }
    private fun editArticle(title: String, content: String, pk: Int){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val editA = EditArticleBody(
            title,
            content,
            0.0f
        )
        mercatus.editArticle(editA, pk,"Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@EditArticleActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@EditArticleActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    Toast.makeText(this@EditArticleActivity, "Successfully edited!", Toast.LENGTH_SHORT)
                        .show()
                    val intent = Intent(this@EditArticleActivity, ShowArticleActivity::class.java)
                    intent.putExtra("article_header", pk.toString())
                    startActivity(intent)
                    finish()
                }
                else  {
                    Toast.makeText(this@EditArticleActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun getArticle(articleID: Int, title: TextView, content: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getOneArticle(articleID, "Token " + tokenV.toString()).enqueue(object :
            Callback<GetArticleBody> {
            override fun onFailure(call: Call<GetArticleBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@EditArticleActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@EditArticleActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetArticleBody>, response: Response<GetArticleBody>) {
                if (response.code() == 200) {
                    title.text = response.body()?.title
                    content.text = response.body()?.content

                    editArticle.setOnClickListener {
                        val titleText = editTitle.text.toString()
                        val contentText = editContent.text.toString()

                        if(isValidForm(titleText, contentText)){
                            editArticle(titleText, contentText, response.body()!!.pk)
                        }
                    }
                }
                else  {
                    Toast.makeText(this@EditArticleActivity, "Show article failed.", Toast.LENGTH_SHORT)
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
