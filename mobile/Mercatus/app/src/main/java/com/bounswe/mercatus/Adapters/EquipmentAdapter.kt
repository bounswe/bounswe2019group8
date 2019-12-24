package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody
import com.bounswe.mercatus.R
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
        var currentEqpShow : ForexUpdateBody? = null
        var currentPosition : Int = 0

        fun setData(eqpName: String, position: Int){
            itemView.eqpName.text = eqpName
            itemView.deleteEqp.setOnClickListener {
                delete(position)
            }
            this.currentEqpShow = ForexUpdateBody(eqpName)
            this.currentPosition = position
        }
    }

    private fun delete(position: Int){
        if(position < eqpList.size){
            eqpList.removeAt(position)
            notifyItemRemoved(position)
            notifyItemRangeChanged(position, itemCount)
        }
    }
}