package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Fragments.ShowProfileActivity
import com.bounswe.mercatus.Models.SearchShow
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.item_layout.view.*

class CustomAdapter(val context : Context, val userList: ArrayList<SearchShow>): RecyclerView.Adapter<CustomAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(userList[position].name, userList[position].surname, userList[position].pk, position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return userList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentSearchShow : SearchShow? = null
        var currentPosition : Int = 0
        init {
            itemView.eachItem.setOnClickListener {
                //Toast.makeText(context, currentSearchShow?.pk.toString(), Toast.LENGTH_SHORT).show()
                /*
                Pass pk value to show profile activity and start activity
                 */
                val intent = Intent(context, ShowProfileActivity::class.java)
                intent.putExtra("pk_val", currentSearchShow?.pk.toString())
                context.startActivity(intent)
            }
        }
        fun setData(name : String, surname : String, pk_id : Long, position: Int){
            itemView.txtName.text = name
            itemView.txtSurname.text = surname

            this.currentSearchShow = SearchShow(name, surname, pk_id)
            this.currentPosition = position
        }
    }
}