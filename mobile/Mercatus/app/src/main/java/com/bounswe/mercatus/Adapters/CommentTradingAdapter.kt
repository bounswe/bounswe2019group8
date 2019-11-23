package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.CommentEditBody
import com.bounswe.mercatus.Models.CommentShowTradingBody
import com.bounswe.mercatus.Models.UserRes
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.comment_layout.view.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class CommentTradingAdapter(val context : Context, val commentList: ArrayList<CommentShowTradingBody>): RecyclerView.Adapter<CommentTradingAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(commentList[position].tr_eq, commentList[position].author,commentList[position].content , commentList[position].pk, position)
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
        var currentSearchShow : CommentShowTradingBody? = null
        var currentPosition : Int = 0
        init {
            itemView.authorName.setOnClickListener {

            }
        }

        fun setData(eqp_id: Int, author_id : Long, comment : String, comment_id : Int, position: Int){
            itemView.authorName.text = author_id.toString()
            itemView.commentText.text = comment

            itemView.likeResult.visibility = View.GONE
            itemView.makeLike.visibility = View.GONE
            itemView.dislikeResult.visibility = View.GONE
            itemView.makeDislike.visibility = View.GONE

            getUser(position, comment_id, author_id, itemView.authorName,
                itemView.editCommentValue,itemView.deleteComment,
                itemView.commentSection, itemView.layComment, itemView.editCommentText,
                itemView.buttonEditComment)
            this.currentSearchShow = CommentShowTradingBody(author_id, comment, eqp_id, comment_id)
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
                        commentSection: LinearLayout,
                        layComment: TextInputLayout,
                        editCommentText : TextInputEditText,
                        buttonEditComment: ImageView){
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

                    name.setOnClickListener {
                        name.setOnClickListener {
                            val intent = Intent(context, ShowProfileActivity::class.java)
                            intent.putExtra("pk_val", response.body()!!.pk.toString())
                            context.startActivity(intent)
                        }
                    }
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
                                deleteComment(comment_id, position)
                            })

                        val alert = dialogBuilder.create()
                        alert.show()
                    }
                    editComment.setOnClickListener {
                        if(commentSection.visibility ==  View.VISIBLE){
                            commentSection.visibility =View.GONE
                        }
                        else{
                            commentSection.visibility =View.VISIBLE

                            if(position < commentList.size){
                                editCommentText.setText(commentList.get(position).content)
                            }
                            buttonEditComment.setOnClickListener {
                                if(editCommentText.text.toString().length > 1){
                                    layComment.isErrorEnabled = false
                                    editComment(editCommentText.text.toString(), comment_id, position)
                                }
                                else{
                                    layComment.isErrorEnabled = true
                                    layComment.error = "Comment cannot be empty!"
                                }
                            }
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

    private fun deleteComment(comment_pk: Int, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.deleteEqpComment(comment_pk, "Token " + tokenV.toString()).enqueue(object :
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
                    if(position < commentList.size){
                        commentList.removeAt(position)
                        notifyItemRemoved(position)
                        notifyItemRangeChanged(position, itemCount)
                    }
                }
                else  {
                    Toast.makeText(context, "Deletion failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun editComment(newComment: String, comment_id: Int, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val eB = CommentEditBody(newComment)
        mer.editEqpComment(eB, comment_id, "Token " + tokenV.toString()).enqueue(object :
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
                if (response.code() == 200) {
                    Toast.makeText(context, "Successfully edited!", Toast.LENGTH_SHORT)
                        .show()
                    if(position < commentList.size){
                        val a = commentList.get(position).author
                        val p = commentList.get(position).pk
                        val tr = commentList.get(position).tr_eq
                        val newCom = CommentShowTradingBody(a,newComment,p, tr)
                        commentList.set(position, newCom)
                        notifyItemChanged(position)
                        notifyItemRangeChanged(position, itemCount)
                    }
                }
                else  {
                    Toast.makeText(context, "Edit failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}