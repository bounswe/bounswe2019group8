package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.graphics.Typeface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.Comments.CommentEditBody
import com.bounswe.mercatus.Models.Comments.LikerModelComment
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.ModelsgetArticles.CommentShowBody
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
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

            getUser(position, comment_id, author_id, itemView.authorName,
                itemView.editCommentValue,itemView.deleteComment,
                itemView.commentSection, itemView.layComment, itemView.editCommentText,
                itemView.buttonEditComment,
                article_id,
                itemView.makeLike, itemView.likeResult,
                itemView.makeDislike, itemView.dislikeResult)
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
                        commentSection: LinearLayout,
                        layComment: TextInputLayout,
                        editCommentText : TextInputEditText,
                        buttonEditComment: ImageView,
                        article_pk: Int,
                        makeLike: TextView,
                        likeResult: TextView,
                        makeDislike: TextView,
                        dislikeResult: TextView){
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

                    getLikes(comment_id, likeResult, makeLike, position)
                    getDislikes(comment_id, dislikeResult, makeDislike, position)
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
        mer.editComment(eB, comment_id, "Token " + tokenV.toString()).enqueue(object :
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
                        val ar = commentList.get(position).article
                        val p = commentList.get(position).pk
                        val newCom = CommentShowBody(a,newComment,ar,p)
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


    private fun likeComment(pk: Int, position: Int, makeLike: TextView, size: Int, likeResult: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.likeComment(pk, "Token " + tokenV.toString()).enqueue(object :
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
                    Toast.makeText(context, "Successfully liked!", Toast.LENGTH_SHORT)
                        .show()

                    if(position < commentList.size){
                        notifyItemChanged(position)
                        notifyItemRangeChanged(position, itemCount)
                        //makeLike.setTypeface(makeLike.typeface, Typeface.BOLD)
                    }
                }
                else if (response.code() == 400) {
                    deleteLike(pk, position, makeLike)
                    likeResult.text = (size-1).toString()
                }
                else  {
                    Toast.makeText(context, "Like comment failed.2", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun deleteLike(pk: Int, position: Int, makeLike: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.deleteLikeComment(pk, "Token " + tokenV.toString()).enqueue(object :
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
                    Toast.makeText(context, "Successfully liked revoked!", Toast.LENGTH_SHORT)
                        .show()

                    if(position < commentList.size){
                        notifyItemChanged(position)
                        notifyItemRangeChanged(position, itemCount)
                        makeLike.setTypeface(makeLike.typeface, Typeface.NORMAL)
                    }
                }
                else  {
                    Toast.makeText(context, "Like comment failed.1", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun getLikes(comment_id: Int, likeResult: TextView, makeLike: TextView, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val user_id = res.getString("user_id", "Data Not Found!")

        mer.getLikesComments(comment_id, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<LikerModelComment>> {
            override fun onFailure(call: Call<List<LikerModelComment>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<LikerModelComment>>, response: Response<List<LikerModelComment>>) {
                if (response.code() == 200) {

                    val res: List<LikerModelComment>? = response.body()

                    for(item in res.orEmpty()){
                        if(user_id!!.toLong() == item.liker){
                            if(item.choice == 1){
                                makeLike.setTypeface(makeLike.typeface, Typeface.BOLD)
                            }
                        }
                    }
                    if(res!!.isNotEmpty()){
                        likeResult.text = res.size.toString()
                    }
                    makeLike.setOnClickListener {
                        likeComment(comment_id, position, makeLike, res.size, likeResult)
                    }
                }
                else  {
                    Toast.makeText(context, "Like list fetch failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }


    /////// Dislike comments

    private fun dislikeComment(pk: Int, position: Int, makeDislike: TextView, listSize: Int, dislikeResult: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.dislikeComment(pk, "Token " + tokenV.toString()).enqueue(object :
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
                    Toast.makeText(context, "Successfully disliked!", Toast.LENGTH_SHORT)
                        .show()

                    if(position < commentList.size){
                        notifyItemChanged(position)
                        notifyItemRangeChanged(position, itemCount)
                        //makeLike.setTypeface(makeLike.typeface, Typeface.BOLD)
                    }
                }
                else if (response.code() == 400) {
                    deleteDislike(pk, position, makeDislike)
                    dislikeResult.text = (listSize-1).toString()
                }
                else  {
                    Toast.makeText(context, "Dislike comment failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun deleteDislike(pk: Int, position: Int, makeDislike: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.deleteDislikeComment(pk, "Token " + tokenV.toString()).enqueue(object :
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
                    Toast.makeText(context, "Successfully disliked revoked!", Toast.LENGTH_SHORT)
                        .show()

                    if(position < commentList.size){
                        notifyItemChanged(position)
                        notifyItemRangeChanged(position, itemCount)
                        makeDislike.setTypeface(makeDislike.typeface, Typeface.NORMAL)
                    }
                }
                else  {
                    Toast.makeText(context, "Dislike comment failed.1", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun getDislikes(comment_id: Int, dislikeResult: TextView, makeDislike: TextView, position: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val user_id = res.getString("user_id", "Data Not Found!")

        mer.getDislikeComments(comment_id, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<LikerModelComment>> {
            override fun onFailure(call: Call<List<LikerModelComment>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<LikerModelComment>>, response: Response<List<LikerModelComment>>) {
                if (response.code() == 200) {

                    val resp: List<LikerModelComment>? = response.body()

                    for(item in resp.orEmpty()){
                        if(user_id!!.toLong() == item.liker){
                            if(item.choice == -1){
                                makeDislike.setTypeface(makeDislike.typeface, Typeface.BOLD)
                            }
                        }
                    }
                    if(resp!!.isNotEmpty()){
                        dislikeResult.text = resp.size.toString()
                    }
                    makeDislike.setOnClickListener {
                        dislikeComment(comment_id, position, makeDislike, resp.size, dislikeResult)
                    }
                }
                else  {
                    Toast.makeText(context, "Dislike list fetch failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}