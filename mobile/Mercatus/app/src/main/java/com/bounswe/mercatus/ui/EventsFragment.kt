package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
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
import com.bounswe.mercatus.Fragments.Articles.CreateEventActivity
import com.bounswe.mercatus.Models.GetEventBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class EventsFragment : Fragment() {
    private lateinit var rv: RecyclerView

    private lateinit var fab: FloatingActionButton

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_events, container, false)
        rv = root.findViewById(R.id.recyclerView3)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        fab  = root.findViewById(R.id.fabEvents)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, CreateEventActivity::class.java)
            startActivity(intent)
        }
        getEvents(root)
        return root
    }
    private fun getEvents(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val events = ArrayList<GetEventBody>()



        mer.getEvents("2019-11-26","Token " + tokenV.toString()).enqueue(object :
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

                    var adapter = EventsAdapter(root.context, events)
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