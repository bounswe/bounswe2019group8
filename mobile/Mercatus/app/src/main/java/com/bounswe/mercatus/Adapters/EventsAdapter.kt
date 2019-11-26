package com.bounswe.mercatus.Adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Models.GetEventBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.event_layout.view.*

class EventsAdapter(val context : Context, val eventsList: ArrayList<GetEventBody>): RecyclerView.Adapter<EventsAdapter.ViewHolder>() {


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(eventsList[position].id,
            eventsList[position].date,
            eventsList[position].time,
            eventsList[position].name,
            eventsList[position].country,
            eventsList[position].importance,
            eventsList[position].value,
            position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.event_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return eventsList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){

        var currentEvent : GetEventBody? = null
        var currentPosition : Int = 0


        fun setData(id : String, date : String, time: String, name: String, country: String,importance: Float, value: String, position: Int){
            itemView.event_name.text = name
            itemView.event_date.text = date
            itemView.event_time.text = time
            itemView.event_country.text = country.replace('_', ' ')
            if(importance > 2.5f){
                itemView.Importance1.visibility = View.VISIBLE
                itemView.Importance2.visibility = View.VISIBLE
                itemView.Importance3.visibility = View.VISIBLE
            } else if(importance > 1.5f){
                itemView.Importance1.visibility = View.VISIBLE
                itemView.Importance2.visibility = View.VISIBLE
                itemView.Importance3.visibility = View.GONE
            } else if(importance > 0.5f){
                itemView.Importance1.visibility = View.VISIBLE
                itemView.Importance2.visibility = View.GONE
                itemView.Importance3.visibility = View.GONE
            } else {
                itemView.Importance1.visibility = View.GONE
                itemView.Importance2.visibility = View.GONE
                itemView.Importance3.visibility = View.GONE
            }



            // Write author to items

            this.currentEvent = GetEventBody(id , date , time, name, country,importance, value)
            this.currentPosition = position
        }
    }


}