package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import at.blogc.android.views.ExpandableTextView
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.article_layout.view.*

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

        }
        fun setData(title : String, content : String, author: Long, pk: Int, rating: Float, position: Int){
            itemView.article_heading.text = title
            itemView.article.text = content

            this.currentArticle = GetArticleBody(author, title, content,rating, pk)
            this.currentPosition = position
        }
    }
}