package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.TradingEqps.ShowForexActivity
import com.bounswe.mercatus.Models.ForexShowBody
import com.bounswe.mercatus.Models.GetArticleBody
import com.bounswe.mercatus.Models.PriceModel
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.article_layout.view.*
import kotlinx.android.synthetic.main.forex_item.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException


abstract class BaseViewHolder<T>(itemView: View) : RecyclerView.ViewHolder(itemView) {
    abstract fun bind(item: T)
}

class HomeAdapter(val context : Context, val listViewType: List<Int>,
                  val forexList: ArrayList<ForexShowBody>,
                  val articlesList: ArrayList<GetArticleBody>): RecyclerView.Adapter<HomeAdapter.ViewHolder>() {

    companion object {
        val FOREX_HEADER = 0
        val ITEM_FOREX = 1
        val ARTICLE_HEADER = 2
        val ITEM_ARTICLE = 3
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val viewType = listViewType[position]
        when (viewType) {
            ITEM_FOREX -> {
                val viewHolderForex = holder as ViewHolderItemForex
                viewHolderForex.setData(forexList[position].pk, forexList[position].sym,forexList[position].name, position)
            }
            ITEM_ARTICLE -> {
                val viewHolderArticle = holder as ViewHolderItemArticle
                viewHolderArticle.itemView.article_heading.text = "sda mdas"
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        return when (viewType) {
            FOREX_HEADER -> ViewHolderItemForex(inflater.inflate(R.layout.item_forex_header, null))
            ITEM_FOREX -> ViewHolderItemForex(inflater.inflate(R.layout.forex_item, null))
            ARTICLE_HEADER -> ViewHolderItemForex(inflater.inflate(R.layout.item_article_header, null))
            else -> ViewHolderItemArticle(inflater.inflate(R.layout.article_layout, null))
        }
    }

    override fun getItemCount(): Int {
        return listViewType.size
    }

    override fun getItemViewType(position: Int): Int = listViewType[position]


    inner class ViewHolderItemForex(itemView: View) : ViewHolder(itemView) {
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
            getForexPrice(forex_id, itemView.highVal, itemView.lowVal)

            this.currentForexShowBody = ForexShowBody(forex_name, forex_sym, forex_id)
            this.currentPosition = position
        }
    }

    inner class ViewHolderItemArticle(itemView: View) : ViewHolder(itemView){

    }

    open inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView)

    private fun getForexPrice(forex_id: Int, highVal: TextView, lowVal: TextView){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexPrices(forex_id, "Token " + tokenV.toString()).enqueue(object :
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
                        if(forexPar[0].ask_price.length > 7 && forexPar[0].bid_price.length > 7){
                            highVal.text = forexPar[0].ask_price.substring(0,7)
                            lowVal.text = forexPar[0].bid_price.substring(0,7)
                        }
                        else{
                            highVal.text = forexPar[0].ask_price
                            lowVal.text = forexPar[0].bid_price
                        }
                    }
                }
                else  {
                    Toast.makeText(context, "Show forex failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
}