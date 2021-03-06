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
import com.bounswe.mercatus.Fragments.Portfolios.ShowPortfolioActivity
import com.bounswe.mercatus.Models.PortfolioShowBody
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.portfolio_layout.view.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class PortfoliosAdapter(val context : Context, val portfoliosList: ArrayList<PortfolioShowBody>): RecyclerView.Adapter<PortfoliosAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(portfoliosList[position].pk,
            portfoliosList[position].owner,
            portfoliosList[position].name,
            portfoliosList[position].private,
            position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.portfolio_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return portfoliosList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){

        var currentPortfolio : PortfolioShowBody? = null
        var currentPosition : Int = 0

        fun setData(pk: Long, owner: Long, name: String, private: Boolean, position: Int){
            itemView.portfolio_name.text = name
            if(private){
                itemView.imagePrivate.visibility = View.VISIBLE
            }
            getUser(owner,itemView.portfolio_owner_text)

            itemView.portfolio_name.setOnClickListener {
                //When click author of an portfolio item, show profile
                val intent = Intent(context, ShowPortfolioActivity::class.java)
                intent.putExtra("portfolio_id", currentPortfolio?.pk.toString())
                context.startActivity(intent)
            }
            this.currentPortfolio = PortfolioShowBody(pk, owner,name,private)
            this.currentPosition = position
        }
    }

    private fun getUser( pk: Long, name: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val tokenV = res.getString("token", "Data Not Found!")

        mercatus.getUser(pk, "Token " + tokenV.toString()).enqueue(object :
            Callback<UserRes> {
            override fun onFailure(call: Call<UserRes>, t: Throwable) {
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
            override fun onResponse(call: Call<UserRes>, response: Response<UserRes>) {
                if (response.code() == 200) {
                    val fullName = response.body()?.first_name + " " + response.body()?.last_name
                    name.text = fullName

                }
                else  {
                    Toast.makeText(context, "Portfolio adapter failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

}