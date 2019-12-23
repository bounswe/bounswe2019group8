package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.Fragments.TradingEqps.ShowForexActivity
import com.bounswe.mercatus.Models.ForexShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.forex_item.view.*

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

            //getLatestForexParity(forex_id, itemView.situationForex)
            //getForexPrice(forex_sym, itemView.highVal, itemView.lowVal)

            this.currentForexShowBody = ForexShowBody(forex_name, forex_sym, forex_id)
            this.currentPosition = position
        }
    }
    /*private fun getForexPrice(forex_sym: String, highVal: TextView, lowVal: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexPrices(forex_sym, "Token " + tokenV.toString()).enqueue(object :
            Callback<NewPriceModel> {
            override fun onFailure(call: Call<NewPriceModel>, t: Throwable) {
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
            override fun onResponse(call: Call<NewPriceModel>, response: Response<NewPriceModel>) {
                if (response.code() == 200) {
                    val forexPar: NewPriceModel? = response.body()

                    /*if(forexPar != null){
                        if(forexPar[0].ask_price.length > 7 && forexPar[0].bid_price.length > 7){
                            highVal.text = forexPar[0].ask_price.substring(0,7)
                            lowVal.text = forexPar[0].bid_price.substring(0,7)
                        }
                        else{
                            highVal.text = forexPar[0].ask_price
                            lowVal.text = forexPar[0].bid_price
                        }
                    }

                     */
                }
                else  {
                    Toast.makeText(context, "Show forex failed...", Toast.LENGTH_SHORT)
                        .show()
                    Log.d("Digital adapter:", "show forex error1")
                }
            }
        })
    }

     */

    /*private fun getLatestForexParity(forex_id: Int, situationForex: ImageView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexParity(forex_id, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<ForexParityModel>> {
            override fun onFailure(call: Call<List<ForexParityModel>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<ForexParityModel>>, response: Response<List<ForexParityModel>>) {
                if (response.code() == 200) {
                    val forexPar: List<ForexParityModel>? = response.body()

                    if(forexPar!!.isNotEmpty()){
                        if(forexPar.last().open.toFloat() > forexPar.last().close.toFloat()){
                            situationForex.setImageResource(R.drawable.ic_decrease)
                        }
                    }
                }
                else  {
                    Toast.makeText(context, "Show forex failed....", Toast.LENGTH_SHORT)
                        .show()
                    Log.d("Digital adapter:", "show forex error2")
                }
            }
        })
    }

     */
}