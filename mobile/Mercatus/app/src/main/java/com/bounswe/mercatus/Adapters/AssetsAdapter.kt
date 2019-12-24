package com.bounswe.mercatus.Adapters

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
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
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.article_layout.view.*
import kotlinx.android.synthetic.main.asset_layout.view.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class AssetsAdapter(val context : Context, val assetList: ArrayList<GetAssetsBody>): RecyclerView.Adapter<AssetsAdapter.ViewHolder>() {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.setData(assetList[position].owner,
            assetList[position].tr_eq,
            assetList[position].amount,
            position)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context).inflate(R.layout.asset_layout, parent, false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return assetList.size
    }
    /*
    Each item in RecyclerView is called as viewholder.
     */
    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){

        var currentArticle : GetAssetsBody? = null
        var currentPosition : Int = 0
        init {



        }
        fun setData(owner : Long, tr_eq : AssetEquipmentModel, amount: Float, position: Int){
            itemView.CashName.text = tr_eq.name
            itemView.CashAmountLayout.text = amount.toString()


            this.currentArticle = GetAssetsBody(owner,tr_eq,amount)
            this.currentPosition = position
        }
    }

    /*
    Gets user based on pk value and a token that was coming from login
    */

}