package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.text.method.ScrollingMovementMethod
import android.util.Log
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
import com.bounswe.mercatus.Models.Article.GetArticleBody
import com.bounswe.mercatus.Models.Comments.CommentBody
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.ModelsgetArticles.CommentShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_show_article.*
import kotlinx.android.synthetic.main.dialog_new_category.*
import okhttp3.ResponseBody
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
        content.movementMethod = ScrollingMovementMethod.getInstance()
        val author = findViewById<TextView>(R.id.showAuthor)
        val articleID = intent.getStringExtra("article_header")

        getArticle(title, content, author, articleID!!.toInt())

        val rv = findViewById<RecyclerView>(R.id.recyclerViewComments)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val commentsList = ArrayList<CommentShowBody>()

        var adapter = CommentAdapter(this@ShowArticleActivity, commentsList)
        rv.adapter = adapter

        getComments(articleID.toInt(), commentsList, adapter)


        fab.setOnClickListener {
            val dialogBuilder = AlertDialog.Builder(this)
                .setTitle("Comment")
                .setCancelable(true)
                .create()
            val editView = layoutInflater.inflate(R.layout.dialog_new_category, null)
            dialogBuilder.setView(editView)
            dialogBuilder.setButton(AlertDialog.BUTTON_POSITIVE, "Send",DialogInterface.OnClickListener{
                    dialog, id ->
                val text = dialogBuilder.editCategory.text

                Log.d("view_Text:",""+text)
                if(text.toString().isEmpty()){
                    Toast.makeText(this@ShowArticleActivity, "Comment cannot be empty!", Toast.LENGTH_SHORT).show()
                    dialogBuilder.layCategory.isErrorEnabled = true
                    dialogBuilder.layCategory.error = "Comment cannot be empty!"
                }
                else{
                    dialogBuilder.layCategory.isErrorEnabled = false
                    makeComments(text.toString(), articleID.toInt())
                    val refreshActivity = intent
                    finish()
                    startActivity(refreshActivity)
                    dialog.dismiss()
                }
            })
            dialogBuilder.setButton(AlertDialog.BUTTON_NEGATIVE, "Cancel",DialogInterface.OnClickListener {
                    dialog, id ->
                dialog.dismiss()

            })
            dialogBuilder.show()
        }
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
                    getUser(response.body()!!.author, author)

                }
                else  {
                    Toast.makeText(this@ShowArticleActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    /*
    Gets user based on pk value and a token that was coming from login
    */
    private fun getUser(pk: Long, name: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
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
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name
                    name.text = fullName

                    name.setOnClickListener {
                        val intent = Intent(this@ShowArticleActivity, ShowProfileActivity::class.java)
                        intent.putExtra("pk_val", response.body()!!.pk.toString())
                        startActivity(intent)
                    }
                }
                else  {
                    Toast.makeText(this@ShowArticleActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun getComments(articleID: Int, commentsList: ArrayList<CommentShowBody>, adapter: CommentAdapter){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")


        mer.getComments(articleID,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<CommentBody>> {
            override fun onFailure(call: Call<List<CommentBody>>, t: Throwable) {
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
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<CommentBody>>, response: Response<List<CommentBody>>) {
                if (response.code() == 200) {
                    val res: List<CommentBody>? = response.body()
                    commentsList.clear()
                    for(i in res.orEmpty()){
                        commentsList.add(CommentShowBody(i.author, i.content, i.article , i.pk))
                    }
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(this@ShowArticleActivity, "Get articles failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun makeComments(commentText: String, article_pk: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val comBody = CreateCommentBody(commentText)

        mer.makeComment(comBody,article_pk,"Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
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
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@ShowArticleActivity, "Comment is added!", Toast.LENGTH_SHORT)
                        .show()
                }
                else  {
                    Toast.makeText(this@ShowArticleActivity, "Comment addition is failed.", Toast.LENGTH_SHORT)
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
