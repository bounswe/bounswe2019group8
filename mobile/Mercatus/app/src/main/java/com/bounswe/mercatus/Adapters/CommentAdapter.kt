package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.CommentShowBody
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.comment_layout.view.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

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

            getUser(position, comment_id, author_id, itemView.authorName, itemView.editCommentValue,itemView.deleteComment, article_id)
            this.currentSearchShow = CommentShowBody(author_id, comment, article_id, comment_id)
            this.currentPosition = position
        }
    }
    /*
    Gets user based on pk value and a token that was coming from login
    */
    private fun getUser(position: Int,
                        comment_id: Int,
                        author_id: Long,
                        name: TextView,
                        editComment: Button,
                        deleteComment: Button,
                        article_pk: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val user_id = res.getString("user_id", "Data Not Found!")
        val tokenV = res.getString("token", "Data Not Found!")

        mer.getUser(author_id, "Token " + tokenV.toString()).enqueue(object :
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
                        editComment.visibility = View.VISIBLE
                        deleteComment.visibility = View.VISIBLE
                    }

                    deleteComment.setOnClickListener {
                        val dialogBuilder = AlertDialog.Builder(context)
                        dialogBuilder.setMessage(it.toString())
                            // if the dialog is cancelable
                            .setTitle("Delete")
                            .setMessage("Do you want to delete comment?")
                            .setCancelable(true)
                            .setNegativeButton("No", DialogInterface.OnClickListener {
                                    dialog, id ->
                                dialog.dismiss()

                            })
                            .setPositiveButton("Yes", DialogInterface.OnClickListener {
                                    dialog, id ->
                                dialog.dismiss()
                                deleteComment(comment_id, article_pk, position)
                            })

                        val alert = dialogBuilder.create()
                        alert.show()
                    }
                }
                else  {
                    Toast.makeText(context, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun deleteComment(comment_pk: Int, article_pk: Int, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.deleteComment(comment_pk, "Token " + tokenV.toString()).enqueue(object :
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
                    commentList.removeAt(position)
                    notifyItemRemoved(position)
                }
                else  {
                    Toast.makeText(context, "Deletion failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}