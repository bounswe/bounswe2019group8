package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import at.blogc.android.views.ExpandableTextView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.ShowProfileActivity
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.article_layout.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ArticlesAdapter(val context : Context, val articlesList: ArrayList<GetArticleBody>): RecyclerView.Adapter<ArticlesAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(articlesList[position].title,
            articlesList[position].content,
            articlesList[position].author,
            articlesList[position].pk,
            articlesList[position].rating,
            position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.article_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return articlesList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val expandableTextView = itemView.findViewById(R.id.article) as ExpandableTextView

        var currentArticle : GetArticleBody? = null
        var currentPosition : Int = 0
        init {
            // Article body, content
            expandableTextView.setAnimationDuration(300L)
            expandableTextView.expandInterpolator = OvershootInterpolator()
            expandableTextView.collapseInterpolator = OvershootInterpolator()

            expandableTextView.setOnClickListener {
                if (expandableTextView.isExpanded){
                    expandableTextView.collapse()
                }
                else{
                    expandableTextView.toggle()
                }

            }

            itemView.article_heading.setOnClickListener {
                Toast.makeText(context, currentArticle?.title, Toast.LENGTH_SHORT).show()
            }

            itemView.makeComment.setOnClickListener {
                Toast.makeText(context, "Make me a comment!", Toast.LENGTH_SHORT).show()
            }

            itemView.author.setOnClickListener {

                //When click author of an article item, show profile
                val intent = Intent(context, ShowProfileActivity::class.java)
                intent.putExtra("pk_val", currentArticle?.author.toString())
                context.startActivity(intent)
            }

        }
        fun setData(title : String, content : String, author: Long, pk: Int, rating: Float, position: Int){
            itemView.article_heading.text = title
            itemView.article.text = content

            getUser(author, itemView.author)

            this.currentArticle = GetArticleBody(author, title, content,rating, pk)
            this.currentPosition = position
        }
    }

    /*
Gets user based on pk value and a token that was coming from login
 */
    private fun getUser(pk: Long, name: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        context,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        context,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name
                    name.text = fullName
                }
                else  {
                    Toast.makeText(context, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}