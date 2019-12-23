package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.RecyclerView
import at.blogc.android.views.ExpandableTextView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.Articles.EditArticleActivity
import com.bounswe.mercatus.Fragments.Articles.ShowArticleActivity
import com.bounswe.mercatus.Fragments.Portfolios.ShowPortfolioActivity
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.article_layout.view.*
import kotlinx.android.synthetic.main.portfolio_layout.view.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class PortfoliosAdapter(val context : Context, val portfoliosList: ArrayList<GetPortfolioBody>): RecyclerView.Adapter<PortfoliosAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(portfoliosList[position].pk,
            portfoliosList[position].equipments,
            portfoliosList[position].owner,
            portfoliosList[position].name,
            portfoliosList[position].followers,
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

        var currentPortfolio : GetPortfolioBody? = null
        var currentPosition : Int = 0

        fun setData(
            pk: Long,
            equipments: List<ForexShowBody>,
            owner: Long,
            name: String,
            followers: List<Long>,
            private: Boolean,
            position: Int
        ){
            itemView.portfolio_name.text = name
            // Write author to items
            Log.d("Portfolio123: PK user  ", ""+owner)
            getUser(owner,itemView.portfolio_owner_text)

            itemView.portfolio_name.setOnClickListener {
                //When click author of an article item, show profile
                val intent = Intent(context, ShowPortfolioActivity::class.java)
                intent.putExtra("portfolio_name", currentPortfolio?.pk.toString())
                context.startActivity(intent)
            }
            this.currentPortfolio = GetPortfolioBody(pk, equipments, owner,name, followers,private)
            this.currentPosition = position
        }
    }

    private fun getUser( pk: Long, name: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = context.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val user_id = res.getString("user_id", "Data Not Found!")

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

                Log.d("Portfolio123: response", ""+response.body())
                Log.d("Portfolio123: PK ", ""+pk)
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

    /*
    Gets user based on pk value and a token that was coming from login
    */



}