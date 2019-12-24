package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.NotifyShowBody
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.item_notify.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class NotifyAdapter(val context : Context, val notifyList: ArrayList<NotifyShowBody>): RecyclerView.Adapter<NotifyAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(notifyList[position].reason, notifyList[position].source_user,notifyList[position].created_at, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_notify, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return notifyList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentNotifyShowBody : NotifyShowBody? = null
        var currentPosition : Int = 0
        init {
            itemView.eachNotifyItem.setOnClickListener {
                //When click forex of an article item, show forex in detail
                val intent = Intent(context, ShowProfileActivity::class.java)
                intent.putExtra("pk_val", currentNotifyShowBody?.source_user.toString())
                context.startActivity(intent)
            }
        }

        fun setData(reason: String, source_user : Long, created_at : String, position: Int){
            var newReason : String
            if(reason == "comment_create"){
                newReason = "User created new comment on a article."
            }
            else if(reason == "article_create"){
                newReason = "User wrote new article. Check out!"
            }
            else{
                newReason = "User annotate on an article. Check out!"
            }
            itemView.txtReason.text = newReason
            val hour = created_at.substring(11,19)
            itemView.txtDate.text = hour

            getUser(source_user, itemView.txtNotifyName)

            this.currentNotifyShowBody =
                NotifyShowBody(
                    reason,
                    source_user,
                    created_at
                )
            this.currentPosition = position
        }
    }
    private fun getUser(author_id: Long, txtNotifyName: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
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
                    txtNotifyName.text = fullName

                    txtNotifyName.setOnClickListener {
                        txtNotifyName.setOnClickListener {
                            val intent = Intent(context, ShowProfileActivity::class.java)
                            intent.putExtra("pk_val", response.body()!!.pk.toString())
                            context.startActivity(intent)
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

}