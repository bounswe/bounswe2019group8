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
import com.bounswe.mercatus.Adapters.ArticlesAdapter
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Fragments.SearchActivity
import com.bounswe.mercatus.Models.ForexDataModel
import com.bounswe.mercatus.Models.ForexShowBody
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class HomeFragment : Fragment() {
    private lateinit var fab: FloatingActionButton
    private lateinit var rv1: RecyclerView
    private lateinit var rv2: RecyclerView

    override fun onCreateView(

        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_home, container, false)

        rv1 = root.findViewById(R.id.recyclerViewHomeForex)
        rv1.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        rv2 = root.findViewById(R.id.recyclerViewHomeArticles)
        rv2.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        fab  = root.findViewById(R.id.fab)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, SearchActivity::class.java)
            startActivity(intent)
        }


        getForexItems(root)
        getArticles(root)

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
                    val respo: List<ForexDataModel>? = response.body()

                    if(respo!!.size < 10){
                        for(i in respo.orEmpty()){
                            forexItems.add(ForexShowBody(i.name, i.sym, i.pk))
                        }
                    }
                    else{
                        for(i in respo.orEmpty().take(10)){
                            forexItems.add(ForexShowBody(i.name, i.sym, i.pk))
                        }
                    }
                    var adapter = ForexAdapter(root.context, forexItems)
                    rv1.adapter = adapter
                }
                else  {
                    Toast.makeText(activity, "Get equipments failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun getArticles(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val articles = ArrayList<GetArticleBody>()

        mer.getArticles("Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetArticleBody>> {
            override fun onFailure(call: Call<List<GetArticleBody>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<GetArticleBody>>, response: Response<List<GetArticleBody>>) {
                if (response.code() == 200) {
                    val res: List<GetArticleBody>? = response.body()

                    if(res!!.size < 3){
                        for(i in res.orEmpty()){
                            articles.add(GetArticleBody(i.author, i.title, i.content, i.rating, i.pk))
                        }
                    }
                    else{
                        for(i in res.orEmpty().take(3)){
                            articles.add(GetArticleBody(i.author, i.title, i.content, i.rating, i.pk))
                        }
                    }
                    var adapter2 = ArticlesAdapter(root.context, articles)
                    rv2.adapter = adapter2
                }
                else  {
                    Toast.makeText(activity, "Get articles failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}