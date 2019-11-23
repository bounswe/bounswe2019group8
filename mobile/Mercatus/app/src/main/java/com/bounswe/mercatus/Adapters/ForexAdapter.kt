package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Models.ForexShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.forex_item.view.*

class ForexAdapter(val context : Context, val forexList: ArrayList<ForexShowBody>): RecyclerView.Adapter<ForexAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(forexList[position].pk, forexList[position].sym,forexList[position].name, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.forex_item, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return forexList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentForexShowBody : ForexShowBody? = null
        var currentPosition : Int = 0
        init {
            itemView.forexLayout.setOnClickListener {

            }
        }

        fun setData(forex_id: Int, forex_sym : String, forex_name : String, position: Int){
            itemView.forexName.text = forex_name
            itemView.forexSymbol.text = forex_sym

            this.currentForexShowBody = ForexShowBody(forex_name, forex_sym, forex_id)
            this.currentPosition = position
        }
    }
}