package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Models.SearchBody
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.comment_layout.view.*
import kotlinx.android.synthetic.main.item_eqp.view.*

class EquipmentAdapter(val context : Context, val eqpList: ArrayList<ForexUpdateBody>): RecyclerView.Adapter<EquipmentAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(eqpList[position].sym, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.item_eqp, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return eqpList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentEqpShow : SearchBody? = null
        var currentPosition : Int = 0
        init {
            itemView.authorName.setOnClickListener {

            }
        }

        fun setData(eqpName: String, position: Int){
            itemView.eqpName.text = eqpName

            this.currentEqpShow = SearchBody(eqpName)
            this.currentPosition = position
        }
    }
}