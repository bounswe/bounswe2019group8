package com.bounswe.mercatus

import ListViewAdapter
import android.content.Context
import android.os.Bundle
import android.widget.AdapterView
import android.widget.ListView
import android.widget.SearchView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.UserNames
import com.bounswe.mercatus.Models.UserRes
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class MainActivity : AppCompatActivity(), SearchView.OnQueryTextListener {
    private var list: ListView? = null
    private var adapter: ListViewAdapter? = null
    private var editsearch: SearchView? = null
    private var moviewList: Array<String>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        moviewList = arrayOf(
            "Xmen",
            "Titanic",
            "Captain America",
            "Iron man",
            "Rocky",
            "Transporter",
            "Lord of the rings",
            "The jungle book",
            "Tarzan",
            "Cars",
            "Shreck"
        )

        // Locate the ListView in listview_main.xml
        list = findViewById(R.id.listview) as ListView

        movieNamesArrayList = ArrayList()

        for (i in moviewList!!.indices) {
            val movieNames = UserNames(moviewList!![i])
            // Binds all strings into an array
            movieNamesArrayList.add(movieNames)
        }

        // Pass results to ListViewAdapter Class
        adapter = ListViewAdapter(this)

        // Binds the Adapter to the ListView
        list!!.adapter = adapter

        // Locate the EditText in listview_main.xml
        editsearch = findViewById(R.id.search) as SearchView
        editsearch!!.setOnQueryTextListener(this)

        list!!.onItemClickListener = AdapterView.OnItemClickListener { parent, view, position, id ->
            Toast.makeText(
                this@MainActivity,
                movieNamesArrayList[position].getUserName(),
                Toast.LENGTH_SHORT
            ).show()
        }

    }
    override fun onQueryTextSubmit(query: String): Boolean {

        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val token = res.getString("token", "Data Not Found!")
        mercatus.getUsers("Token " + token.toString()).enqueue(object : Callback<List<UserRes>> {
            override fun onFailure(call: Call<List<UserRes>>, t: Throwable) {
                //Log.i("ApiRequest", "Request failed: " + t.toString())

                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@MainActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@MainActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onResponse(call: Call<List<UserRes>>, response: Response<List<UserRes>>) {
                if (response.code() == 200) {

                    val users: List<UserRes>? = response.body()


                    Toast.makeText(this@MainActivity, users?.get(0)?.first_name , Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@MainActivity, "Login failed.", Toast.LENGTH_SHORT).show()
                }
            }
        })



        return false
    }

    override fun onQueryTextChange(newText: String): Boolean {
        adapter!!.filter(newText)
        return false
    }

    companion object {
        var movieNamesArrayList = ArrayList<UserNames>()
    }
}
