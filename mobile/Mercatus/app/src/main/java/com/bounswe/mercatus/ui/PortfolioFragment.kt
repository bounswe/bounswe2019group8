
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
import com.bounswe.mercatus.Adapters.PortfoliosAdapter
import com.bounswe.mercatus.Fragments.Portfolios.CreatePortfolioActivity
import com.bounswe.mercatus.Models.GetPortfolioBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class PortfolioFragment : Fragment() {
    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_portfolios, container, false)
        rv = root.findViewById(R.id.recyclerView4)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        fab  = root.findViewById(R.id.fabPortfolios)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, CreatePortfolioActivity::class.java)
            startActivity(intent)
        }
        getPortfolios(root)
        return root
    }
    private fun getPortfolios(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val user_id = res?.getString("user_id", "Data Not Found!")

        val portfolios = ArrayList<GetPortfolioBody>()

        Log.d("GET PORTFOLIOOOO","ASD "+user_id)

        mer.getPortfolios(user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetPortfolioBody>> {
            override fun onFailure(call: Call<List<GetPortfolioBody>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<GetPortfolioBody>>, response: Response<List<GetPortfolioBody>>) {
                if (response.code() == 200) {
                    val res: List<GetPortfolioBody>? = response.body()
                    Log.d("response_portfolio",""+res)


                    for(i in res.orEmpty()){

                        if(i.tr_eqs == null
                            //&& i.followers == null
                            ) {
                            portfolios.add(
                                GetPortfolioBody(
                                    i.pk,
                                    emptyList()
                                    , i.owner
                                    , i.name,
                            //        emptyList(),
                                    i.private
                                )
                            )
                        }
                        else if(i.tr_eqs != null
                        //          && i.followers == null
                        ) {
                            portfolios.add(
                                GetPortfolioBody(
                                    i.pk,
                                    i.tr_eqs
                                    , i.owner
                                    , i.name,
                                    //             emptyList(),
                                    i.private
                                )
                            )
                        }
                        else if(i.tr_eqs == null
                        //       && i.followers != null
                        ) {
                            portfolios.add(
                                GetPortfolioBody(
                                    i.pk,
                                    emptyList()
                                    , i.owner
                                    , i.name,
                                    //              i.followers,
                                    i.private
                                )
                            )
                        }
                        else{   portfolios.add(
                                GetPortfolioBody(
                                    i.pk,
                                    i.tr_eqs
                                    , i.owner
                                    , i.name,
                                    //             i.followers,
                                    i.private
                                )
                            )
                        }

                    }

                    var adapter = PortfoliosAdapter(root.context, portfolios)
                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get portfolio failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }



    override fun onStart() {
        getPortfolios(super.getView()!!)
        super.onStart()
    }
}