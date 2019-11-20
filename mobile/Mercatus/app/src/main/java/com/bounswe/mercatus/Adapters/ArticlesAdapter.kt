package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import at.blogc.android.views.ExpandableTextView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.Articles.EditArticleActivity
import com.bounswe.mercatus.Fragments.Articles.ShowArticleActivity
import com.bounswe.mercatus.Fragments.ShowProfileActivity
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.article_layout.view.*
import okhttp3.ResponseBody
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
        private val expandableTextView = itemView.findViewById(R.id.article) as ExpandableTextView

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
                //When click author of an article item, show profile
                val intent = Intent(context, ShowArticleActivity::class.java)
                intent.putExtra("article_header", currentArticle?.pk.toString())
                context.startActivity(intent)
            }

            /*itemView.makeComment.setOnClickListener {

                val intent = Intent(context, CreateCommentActivity::class.java)
                intent.putExtra("articleID", currentArticle?.pk.toString())
                context.startActivity(intent)
            }

             */

            itemView.author.setOnClickListener {

                //When click author of an article item, show profile
                val intent = Intent(context, ShowProfileActivity::class.java)
                intent.putExtra("pk_val", currentArticle?.author.toString())
                context.startActivity(intent)
            }

            itemView.editArticle.setOnClickListener {
                val intent = Intent(context, EditArticleActivity::class.java)
                intent.putExtra("article_header", currentArticle?.pk.toString())
                context.startActivity(intent)
            }
        }
        fun setData(title : String, content : String, author: Long, pk: Int, rating: Float, position: Int){
            itemView.article_heading.text = title
            itemView.article.text = content

            // Write author to items
            getUser(position, author, itemView.author, itemView.editArticle, itemView.deleteArticle, itemView.showComment, itemView.commentSection, pk)

            this.currentArticle = GetArticleBody(author, title, content,rating, pk)
            this.currentPosition = position
        }
    }

    /*
    Gets user based on pk value and a token that was coming from login
    */
    private fun getUser(position: Int,pk: Long, name: TextView,
                        editArticle: Button, deleteArticle: Button,showComment: Button,
                        commentSection: LinearLayout, article_pk: Int){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val user_id = res.getString("user_id", "Data Not Found!")
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

                    if(user_id!!.toLong() == response.body()?.pk){
                        editArticle.visibility = View.VISIBLE
                        deleteArticle.visibility = View.VISIBLE
                    }
                    deleteArticle.setOnClickListener {
                        val dialogBuilder = AlertDialog.Builder(context)
                        dialogBuilder.setMessage(it.toString())
                            // if the dialog is cancelable
                            .setTitle("Delete")
                            .setMessage("Do you want to delete article?")
                            .setCancelable(true)
                            .setNegativeButton("No", DialogInterface.OnClickListener {
                                    dialog, id ->
                                dialog.dismiss()

                            })
                            .setPositiveButton("Yes", DialogInterface.OnClickListener {
                                    dialog, id ->
                                dialog.dismiss()
                                deleteArticle(article_pk, position)
                            })

                        val alert = dialogBuilder.create()
                        alert.show()
                    }

                    showComment.setOnClickListener {
                        if(commentSection.visibility == View.VISIBLE){
                            commentSection.visibility = View.GONE
                        }
                        else{
                            commentSection.visibility = View.VISIBLE
                        }
                    }
                }
                else  {
                    Toast.makeText(context, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun deleteArticle(pk: Int, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.deleteArticle(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
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
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 204) {
                    Toast.makeText(context, "Successfully deleted!", Toast.LENGTH_SHORT)
                        .show()

                    articlesList.removeAt(position)
                    notifyItemRemoved(position)
                }
                else  {
                    Toast.makeText(context, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}