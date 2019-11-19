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
import com.bounswe.mercatus.Fragments.SearchActivity
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

        fab  = root.findViewById(R.id.fab)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, SearchActivity::class.java)
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

        /*
        var aB = ShowArticleBody("Android Navigation Drawer ", "Hello guys, here is another tutorial for one of the most common things in any android application, navigation drawer. So in this Android Navigation Drawer Example you will learn how you can use the Android Navigation Drawer from the predefined template.\n" +
                "\n" +
                "You may already know what is Android Navigation Drawer but if you are confused in implementing it with multiple fragments then don’t worry, this android navigation drawer example will clear all your doubts. So lets begin our Android Navigation Drawer Example. https://www.simplifiedcoding.net/android-navigation-drawer-example-using-fragments/")
        mer.createArticle(aB,"Token " + tokenV.toString()).enqueue(object :
            Callback<GetArticleBody> {
            override fun onFailure(call: Call<GetArticleBody>, t: Throwable) {
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
            override fun onResponse(call: Call<GetArticleBody>, response: Response<GetArticleBody>) {
                if (response.code() == 201) {

                }
                else  {
                    Toast.makeText(activity, "Create article failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })

         */


    }
}