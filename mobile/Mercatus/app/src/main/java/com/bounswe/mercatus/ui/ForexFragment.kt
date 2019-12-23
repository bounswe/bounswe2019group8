package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
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
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Fragments.SearchForexActivity
import com.bounswe.mercatus.Fragments.TradingEqps.SearchEquipmentsActivity
import com.bounswe.mercatus.Models.ForexDataModel
import com.bounswe.mercatus.Models.ForexShowBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ForexFragment : Fragment() {
    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_forex, container, false)

        rv = root.findViewById(R.id.recyclerViewForex)
        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false) as RecyclerView.LayoutManager?

        getForexItems(root)

        fab  = root.findViewById(R.id.fabForex)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, SearchForexActivity::class.java)
            startActivity(intent)
        }
        return root
    }

    private fun getForexItems(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val forexItems = ArrayList<ForexShowBody>()

        mer.getForex("Token " + tokenV.toString()).enqueue(object :
            Callback<List<ForexDataModel>> {
            override fun onFailure(call: Call<List<ForexDataModel>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<ForexDataModel>>, response: Response<List<ForexDataModel>>) {
                if (response.code() == 200) {


                    Log.d("ForexFragment",""+response)
                    val respo: List<ForexDataModel>? = response.body()

                    Log.d("ForexFragment1",""+respo)
                    for(i in respo.orEmpty()){
                        forexItems.add(ForexShowBody(i.name, i.sym, i.pk))
                    }
                    val adapter = ForexAdapter(root.context, forexItems)

                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get equipments failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    override fun onStart() {
        getForexItems(super.getView()!!)
        super.onStart()
    }
}