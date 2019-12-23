package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.TradingEqps.ShowForexActivity
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.PriceModel
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.forex_item.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class DigitalAdapter(val context : Context, val forexList: ArrayList<ForexShowBody>): RecyclerView.Adapter<DigitalAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(forexList[position].pk, forexList[position].sym,forexList[position].name, position)
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.forex_item, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return forexList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var currentForexShowBody : ForexShowBody? = null
        var currentPosition : Int = 0
        init {
            itemView.forexLayout.setOnClickListener {
                //When click forex of an article item, show forex in detail
                val intent = Intent(context, ShowForexActivity::class.java)
                intent.putExtra("forex_id", currentForexShowBody?.pk.toString())
                intent.putExtra("forex_name", currentForexShowBody?.name.toString())
                context.startActivity(intent)
            }
        }

        fun setData(forex_id: Int, forex_sym : String, forex_name : String, position: Int){
            itemView.forexName.text = forex_name
            itemView.forexSymbol.text = forex_sym

            getLatestForexParity(forex_sym, itemView.situationForex)
            getForexPrice(forex_sym, itemView.highVal, itemView.lowVal)

            this.currentForexShowBody =
                ForexShowBody(
                    forex_name,
                    forex_sym,
                    forex_id
                )
            this.currentPosition = position
        }
    }
    private fun getForexPrice(forex_sym: String, highVal: TextView, lowVal: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        mer.getForexPrices(forex_sym, "Token " + tokenV.toString()).enqueue(object :
            Callback<PriceModel> {
            override fun onFailure(call: Call<PriceModel>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        context,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        context,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<PriceModel>, response: Response<PriceModel>) {
                if (response.code() == 200) {
                    val forexPar: PriceModel? = response.body()

                    if(forexPar != null){
                        if(forexPar.ask_value.length > 7 && forexPar.bid_value.length > 7){
                            highVal.text = forexPar.ask_value.substring(0,7)
                            lowVal.text = forexPar.bid_value.substring(0,7)
                        }
                        else{
                            highVal.text = forexPar.ask_value
                            lowVal.text = forexPar.bid_value
                        }
                    }
                }
                else  {
                    Log.d("Forex adapter:", "Show forex failed.")
                }
            }
        })
    }

    private fun getLatestForexParity(forex_sym: String, situationForex: ImageView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexParity(forex_sym, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<PriceModel>> {
            override fun onFailure(call: Call<List<PriceModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        context,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        context,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<PriceModel>>, response: Response<List<PriceModel>>) {
                if (response.code() == 200) {
                    val forexPar: List<PriceModel>? = response.body()

                    if(forexPar!!.isNotEmpty()){
                        if(forexPar.first().ask_value.toFloat() > forexPar.last().ask_value.toFloat()){
                            situationForex.setImageResource(R.drawable.ic_decrease)
                        }
                    }
                }
                else  {
                    Log.d("Forex adapter:", "Show forex failed.")
                }
            }
        })
    }
}