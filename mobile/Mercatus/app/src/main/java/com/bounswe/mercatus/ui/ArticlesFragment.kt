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
import com.bounswe.mercatus.Fragments.Articles.CreateArticleActivity
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ArticlesFragment : Fragment() {
    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_articles, container, false)
        rv = root.findViewById(R.id.recyclerView2)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        fab  = root.findViewById(R.id.fabArticles)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, CreateArticleActivity::class.java)
            startActivity(intent)
        }
        getArticles(root)
        return root
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

                    for(i in res.orEmpty()){
                        articles.add(GetArticleBody(i.author, i.title, i.content, i.rating, i.pk))
                    }

                    var adapter = ArticlesAdapter(root.context, articles)
                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get articles failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    override fun onStart() {
        getArticles(super.getView()!!)
        super.onStart()
    }
}