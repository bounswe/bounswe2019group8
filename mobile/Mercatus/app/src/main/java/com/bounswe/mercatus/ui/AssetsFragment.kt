package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment

import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.AssetsAdapter
import com.bounswe.mercatus.Fragments.Articles.CreateArticleActivity
import com.bounswe.mercatus.Fragments.Articles.CreateAssetsActivity

import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.github.mikephil.charting.charts.PieChart
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_profile.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class AssetsFragment : Fragment() {


    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton


    var cashAmountFloat: Float = 0.0f
    var currentCash: Float = 0.0f


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_asset, container, false)
        rv = root.findViewById(R.id.recyclerView6)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        fab  = root.findViewById(R.id.fabAssets)
        getAmount(root)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, CreateAssetsActivity::class.java)
            startActivity(intent)
        }

        return root
    }


    private fun getAmount(root: View) {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = root.findViewById<TextView>(R.id.CashAmount)


        mer.getAssets(user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetAssetsBody>> {
            override fun onFailure(call: Call<List<GetAssetsBody>>, t: Throwable) {
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
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetAssetsBody>>, response: Response<List<GetAssetsBody>>) {

                val asset = ArrayList<GetAssetsBody>()
                Log.d("ShowPortfolio123",""+response.body())

                if (response.code() == 200) {
                    Log.d("ShowPortfolio",""+response.body())


                    val res: List<GetAssetsBody>? = response.body()

                    for(i in res.orEmpty()){
                        asset.add(GetAssetsBody(i.owner, i.tr_eq,i.amount))
                    }

                    Log.d("asdfsa",""+asset[0].amount)
                    var adapter = AssetsAdapter(root.context, asset)
                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()


                }
                else  {
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        })

    }


    override fun onStart() {
        getAmount(super.getView()!!)
        super.onStart()
    }
}