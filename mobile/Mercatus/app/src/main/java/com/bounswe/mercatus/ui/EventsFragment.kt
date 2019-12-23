package com.bounswe.mercatus.ui

import android.content.Context
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.EventsAdapter
import com.bounswe.mercatus.Models.GetEventBody
import com.bounswe.mercatus.R
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException
import java.text.DateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.*
import kotlin.collections.ArrayList







class EventsFragment : Fragment() {
    private lateinit var rv: RecyclerView


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_events, container, false)
        rv = root.findViewById(R.id.recyclerView3)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        getEvents(root)
        return root
    }
    private fun getEvents(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val events = ArrayList<GetEventBody>()


        val calendar = Calendar.getInstance()
        val currentDate = DateFormat.getDateInstance().format(calendar.getTime())

        val df = DateFormat.getTimeInstance()

        df.setTimeZone(TimeZone.getTimeZone("gmt"))
        val cal = df.calendar
        val day = cal.get(Calendar.DAY_OF_MONTH)
        val month = cal.get(Calendar.MONTH)+1 // It shows 11 for dec, so I added 1 to month.
        val year = cal.get(Calendar.YEAR)

        Log.d("Date2:", ""+day)
        Log.d("Date3:", ""+month)
        Log.d("Date4:", ""+year)
        val Date = currentDate.substring(currentDate.length-4)+"-"+month+"-"+day


        Log.d("Date:", ""+Date)

        val tomorrow = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LocalDate.now().plus(1, ChronoUnit.DAYS)
        } else {
            TODO("VERSION.SDK_INT < O")
        }
        val formattedTomorrow = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            tomorrow.format(DateTimeFormatter.ofPattern("EE, MMM d, yyy"))
        } else {
            TODO("VERSION.SDK_INT < O")
        }

        Log.d("TOMORROW",""+tomorrow)

        Log.d("Date:", ""+Date)

        val two_days_later = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LocalDate.now().plus(2, ChronoUnit.DAYS)
        } else {
            TODO("VERSION.SDK_INT < O")
        }
        val two_days_later_format = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            tomorrow.format(DateTimeFormatter.ofPattern("EE, MMM d, yyy"))
        } else {
            TODO("VERSION.SDK_INT < O")
        }

        Log.d("TOMORROW",""+two_days_later)


        mer.getEvents(Date,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetEventBody>> {
            override fun onFailure(call: Call<List<GetEventBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        activity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetEventBody>>, response: Response<List<GetEventBody>>) {
                if (response.code() == 200) {
                    val res: List<GetEventBody>? = response.body()

                    for(i in res.orEmpty()){
                        events.add(GetEventBody(i.id,i.date,i.time,i.name,i.country,i.importance,i.value))
                    }
                    val sortedList = events.sortedWith(compareByDescending(GetEventBody::importance))


                    val events1 = ArrayList<GetEventBody>()

                    for (item: GetEventBody in sortedList) {
                        events1.add(item)
                    }


                    var adapter = EventsAdapter(root.context, events1)

                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get events failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })

        mer.getEvents(""+tomorrow,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetEventBody>> {
            override fun onFailure(call: Call<List<GetEventBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        activity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetEventBody>>, response: Response<List<GetEventBody>>) {
                if (response.code() == 200) {
                    val res: List<GetEventBody>? = response.body()

                    for(i in res.orEmpty()){
                        events.add(GetEventBody(i.id,i.date,i.time,i.name,i.country,i.importance,i.value))
                    }
                    val sortedList = events.sortedWith(compareByDescending(GetEventBody::importance))


                    val events1 = ArrayList<GetEventBody>()

                    for (item: GetEventBody in sortedList) {
                        events1.add(item)
                    }


                    var adapter = EventsAdapter(root.context, events1)

                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get events failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })

        mer.getEvents(""+two_days_later,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetEventBody>> {
            override fun onFailure(call: Call<List<GetEventBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        activity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetEventBody>>, response: Response<List<GetEventBody>>) {
                if (response.code() == 200) {
                    val res: List<GetEventBody>? = response.body()

                    for(i in res.orEmpty()){
                        events.add(GetEventBody(i.id,i.date,i.time,i.name,i.country,i.importance,i.value))
                    }
                    val sortedList = events.sortedWith(compareByDescending(GetEventBody::importance))


                    val events1 = ArrayList<GetEventBody>()

                    for (item: GetEventBody in sortedList) {
                        events1.add(item)
                    }


                    var adapter = EventsAdapter(root.context, events1)

                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get events failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }



    override fun onStart() {
        getEvents(super.getView()!!)
        super.onStart()
    }


}