package com.bounswe.mercatus.Fragments

import android.app.SearchManager
import android.content.Context
import android.os.Bundle
import android.view.Menu
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.OtherTradingBody
import com.bounswe.mercatus.R
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class SearchForexActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search)
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        val inflater = menuInflater
        inflater.inflate(R.menu.main_menu,menu)

        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.search_title)
        actionBar.setDisplayHomeAsUpEnabled(true)

        val rv = findViewById<RecyclerView>(R.id.recyclerView1)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val forexItems = ArrayList<ForexShowBody>()

        var adapter = ForexAdapter(this@SearchForexActivity, forexItems)
        rv.adapter = adapter

        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val manager = getSystemService(Context.SEARCH_SERVICE) as SearchManager
        val searchItem = menu?.findItem(R.id.search)
        val searchView = searchItem?.actionView as SearchView



        searchView.setSearchableInfo(manager.getSearchableInfo(componentName))



        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener{


            override fun onQueryTextSubmit(query: String?): Boolean {


                forexItems.clear()
                searchView.clearFocus()
                searchView.setQuery("", false)
                searchItem.collapseActionView()

                if(!query.isNullOrBlank()){


                    mer.getOtherEquipments().enqueue(object :
                        Callback<List<OtherTradingBody>> {
                        override fun onFailure(call: Call<List<OtherTradingBody>>, t: Throwable) {
                            if(t.cause is ConnectException){
                                Toast.makeText(
                                    this@SearchForexActivity,
                                    "Check your connection!",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                            else{
                                Toast.makeText(
                                    this@SearchForexActivity,
                                    "Something bad happened!",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        }

                        override fun onResponse(call: Call<List<OtherTradingBody>>, response: Response<List<OtherTradingBody>>) {
                            if (response.code() == 200) {

                                val res: List<OtherTradingBody>? = response.body()

                                for(i in res.orEmpty()){
                                    if (i.name.contains(query, true)) {

                                        forexItems.add(
                                            ForexShowBody(
                                                i.name,
                                                i.sym,
                                                i.pk
                                            )
                                        )
                                    }
                                }
                                if(forexItems.isEmpty()){
                                    Toast.makeText( this@SearchForexActivity,"No Trading Equipment Found!", Toast.LENGTH_SHORT).show()
                                }
                                adapter.notifyDataSetChanged()
                                //val users: List<UserRes>? = response.body()
                                //Toast.makeText(this@SearchActivity, users?.get(0)?.first_name , Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText( this@SearchForexActivity, "Search failed.", Toast.LENGTH_SHORT).show()
                            }
                        }


                    })


                }


                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                return false
            }


        })
        return super.onCreateOptionsMenu(menu)
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
    override fun finish() {
        super.finish()
        overridePendingTransition(android.R.anim.slide_in_left, android.R.anim.slide_out_right)
    }
}
