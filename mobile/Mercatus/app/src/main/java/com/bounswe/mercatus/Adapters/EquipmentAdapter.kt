package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.TradingEqps.ShowForexActivity
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.equipment_item_layout.view.*
import kotlinx.android.synthetic.main.forex_item.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class EquipmentAdapter(val context : Context, val forexList: ArrayList<ForexUpdateBody>): RecyclerView.Adapter<EquipmentAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData( forexList[position].sym, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.equipment_item_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return forexList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentForexShowBody : ForexUpdateBody? = null
        var currentPosition : Int = 0
        init {

        }

        fun setData( forex_sym : String,  position: Int){
            itemView.equipment_text.text = forex_sym


            this.currentForexShowBody = ForexUpdateBody(forex_sym)
            this.currentPosition = position
        }
    }



}