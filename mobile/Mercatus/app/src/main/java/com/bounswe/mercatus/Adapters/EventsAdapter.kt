package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import at.blogc.android.views.ExpandableTextView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.Articles.EditArticleActivity
import com.bounswe.mercatus.Fragments.Articles.ShowArticleActivity
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.article_layout.view.*
import kotlinx.android.synthetic.main.event_layout.view.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

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
        private val expandableTextView = itemView.findViewById(R.id.event_date) as ExpandableTextView

        var currentEvent : GetEventBody? = null
        var currentPosition : Int = 0
        init {
            // Article body, content
            expandableTextView.setAnimationDuration(300L)
            expandableTextView.expandInterpolator = OvershootInterpolator()
            expandableTextView.collapseInterpolator = OvershootInterpolator()

            expandableTextView.setOnClickListener {
                if (expandableTextView.isExpanded){
                    expandableTextView.collapse()
                }
                else{
                    expandableTextView.toggle()
                }

            }



        }


        fun setData(id : String, date : String, time: String, name: String, country: String,importance: Float, value: String, position: Int){
            itemView.event_name.text = name
            itemView.event_date.text = date
            itemView.event_time.text = time
            itemView.event_country.text = country
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