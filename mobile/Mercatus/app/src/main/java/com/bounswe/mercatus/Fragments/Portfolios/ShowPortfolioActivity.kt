package com.bounswe.mercatus.Fragments.Portfolios

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.EquipmentAdapter
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.GetPortfolioBody
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody
import com.bounswe.mercatus.Models.UpdatePortfolio
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_show_portfolio.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ShowPortfolioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_show_portfolio)

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = "Portfolio"
        actionBar.setDisplayHomeAsUpEnabled(true)

        val name = findViewById<TextView>(R.id.showName)
        val owner = findViewById<TextView>(R.id.showOwner)

        val portfolioID = intent.getStringExtra("portfolio_id")

        getPortfolio(name, portfolioID!!.toLong(),owner)

        val rv = findViewById<RecyclerView>(R.id.recyclerViewEquipments)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val equipmentList = ArrayList<ForexShowBody>()
        val equipmentUpdateList = ArrayList<ForexUpdateBody>()

        var adapter = ForexAdapter(this@ShowPortfolioActivity, equipmentList)
        rv.adapter = adapter

        val addEquipmentText = findViewById<TextView>(R.id.AddEquipmentText)

        add_a_new_trading_equipment.setOnClickListener {
            val equipmentSymbol = addEquipmentText.text.toString()
            if (isValidForm(equipmentSymbol)){
                equipmentUpdateList.add(ForexUpdateBody(equipmentSymbol))

                val updatePortfolioBody = UpdatePortfolio(name.text.toString(),equipmentUpdateList)

                updatePortfolio(portfolioID.toLong(), updatePortfolioBody)
            }
        }

        deletePortfolioButton.setOnClickListener {
            deletePortfolio(portfolioID.toLong())
        }
    }

    private fun getPortfolio(name: TextView, portfolioID: Long,owner: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val userID = res?.getString("user_id", "Data Not Found!")

        val eqpsList = ArrayList<ForexUpdateBody>()

        mercatus.getSpecificPortfolio(userID!!.toLong(), "Token " + tokenV.toString(),portfolioID).enqueue(object :
            Callback<GetPortfolioBody> {
            override fun onFailure(call: Call<GetPortfolioBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetPortfolioBody>, response: Response<GetPortfolioBody>) {
                if (response.code() == 200) {
                    name.text = response.body()?.name
                    val res: List<ForexUpdateBody>? = response.body()!!.equipments

                    for(i in res.orEmpty()){
                        eqpsList.add(ForexUpdateBody(i.sym))
                    }
                    val rv = findViewById<RecyclerView>(R.id.recyclerViewEquipments)
                    rv.layoutManager = LinearLayoutManager(this@ShowPortfolioActivity, RecyclerView.VERTICAL, false)

                    var adapter = EquipmentAdapter(this@ShowPortfolioActivity, eqpsList)
                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                    getUser(response.body()!!.owner, owner)

                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Show Portfolio Activity failed", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun deletePortfolio(portfolioID: Long){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val userID = res?.getString("user_id", "Data Not Found!")


        mercatus.deletePortfolio(userID!!.toLong(), "Token " + tokenV.toString(),portfolioID).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {

                if (response.code() == 204) {
                    Toast.makeText(this@ShowPortfolioActivity, "Portfolio deleted successfully!", Toast.LENGTH_SHORT)
                        .show()
                    finish()
                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Delete Portfolio is failed!", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun updatePortfolio(portfolioID: Long,updatePortfolioBody: UpdatePortfolio){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val tokenV = res.getString("token", "Data Not Found!")
        val userID = res?.getString("user_id", "Data Not Found!")

        mercatus.updatePortfolio(updatePortfolioBody, userID!!.toLong(), "Token " + tokenV.toString(),portfolioID!!.toLong()).enqueue(object :
            Callback<GetPortfolioBody> {
            override fun onFailure(call: Call<GetPortfolioBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<GetPortfolioBody>, response: Response<GetPortfolioBody>) {

                if (response.code() == 200) {
                    Toast.makeText(this@ShowPortfolioActivity, "New equipment is added.", Toast.LENGTH_SHORT)
                        .show()

                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Add new equipment failed!", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun isValidForm(name: String):Boolean{

        var isValid = true
        if (name.isEmpty()){
            layAddEquipment.isErrorEnabled = true
            layAddEquipment.error = "Name cannot be empty!"
            isValid = false
        }else{
            layAddEquipment.isErrorEnabled = false
        }
        return isValid
    }
    private fun getUser(pk: Long,name: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowPortfolioActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name

                    name.text = fullName

                    name.setOnClickListener {
                        val intent = Intent(this@ShowPortfolioActivity, ShowProfileActivity::class.java)
                        intent.putExtra("pk_val", response.body()!!.pk.toString())
                        startActivity(intent)
                    }
                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Show profile failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
