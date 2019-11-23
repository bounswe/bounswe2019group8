package com.bounswe.mercatus.Fragments.TradingEqps

import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Models.ForexParityModel
import com.bounswe.mercatus.R
import com.github.mikephil.charting.animation.Easing
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import kotlinx.android.synthetic.main.activity_forex_show.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ForexShowActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forex_show)

        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.forex)
        actionBar.setDisplayHomeAsUpEnabled(true)


        val forexID = intent.getStringExtra("forex_id")
        val forexName = intent.getStringExtra("forex_name")
        getForexParity(forexID!!.toInt(), forexName!!)
    }
    private fun getForexParity(forex_id: Int, forexName: String){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexParity(forex_id, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<ForexParityModel>> {
            override fun onFailure(call: Call<List<ForexParityModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ForexShowActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ForexShowActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<ForexParityModel>>, response: Response<List<ForexParityModel>>) {
                if (response.code() == 200) {
                    val forexPar: List<ForexParityModel>? = response.body()
                    val entries = ArrayList<Entry>()
                    var j = 0f
                    for(i in forexPar.orEmpty()){
                        entries.add(Entry(j, i.close.toFloat()))
                        j++
                    }

                    if(forexPar!!.isNotEmpty()){
                        val vl = LineDataSet(entries, forexName)

                        //vl.color = R.color.red
                        //vl.circleHoleColor = R.color.gray
                        vl.setDrawValues(false)
                        lineChart.xAxis.labelRotationAngle = 0f
                        lineChart.data = LineData(vl)
                        lineChart.axisRight.isEnabled = false
                        lineChart.xAxis.axisMaximum = j+0.1f
                        lineChart.setTouchEnabled(true)
                        lineChart.description.text = "Days"
                        lineChart.setNoDataText("No forex yet!")
                        lineChart.setPinchZoom(true)
                        lineChart.animateX(1000, Easing.EaseInExpo)
                        //lineChart.animateXY(3600,3600, Easing.EaseInOutBounce, Easing.EaseInExpo)
                    }
                }
                else  {
                    Toast.makeText(this@ForexShowActivity, "Show forex failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
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
