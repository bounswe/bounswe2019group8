package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Models.CommentShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.comment_layout.view.*

class CommentAdapter(val context : Context, val commentList: ArrayList<CommentShowBody>): RecyclerView.Adapter<CommentAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(commentList[position].article, commentList[position].author,commentList[position].content , commentList[position].pk, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.comment_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return commentList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentSearchShow : CommentShowBody? = null
        var currentPosition : Int = 0
        init {
            itemView.authorName.setOnClickListener {

            }
        }

        fun setData(article_id: Int, author_id : Long, comment : String, comment_id : Int, position: Int){
            itemView.authorName.text = author_id.toString()
            itemView.commentText.text = comment

            this.currentSearchShow = CommentShowBody(author_id, comment, article_id, comment_id)
            this.currentPosition = position
        }
    }
}