package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Fragments.Articles.CreateArticleActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.github.mikephil.charting.charts.PieChart
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_profile.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class AssetsFragment : Fragment() {
    private lateinit var pieC: PieChart

    private lateinit var addCashButton: Button

    private lateinit var buyAssetsbutton: Button
    private lateinit var addCashText: EditText

    private lateinit var buyAssetName: EditText
    private lateinit var buyAssetAmount: EditText


    var cashAmountFloat: Float = 0.0f
    var currentCash: Float = 0.0f

    private lateinit var addAmountText: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_asset, container, false)

        val CashAmount = root.findViewById<TextView>(R.id.CashAmount)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val tokenV = res?.getString("token", "Data Not Found!")


        val user_id = res?.getString("user_id", "Data Not Found!")


        getAmount(root)

        val cash =0.0f

        addCashButton  = root.findViewById(R.id.addAmountButton)


        buyAssetsbutton  = root.findViewById(R.id.buyAsset)

        buyAssetName = root.findViewById(R.id.buyAssetName)

        buyAssetAmount = root.findViewById(R.id.buyAssetAmount)

        addCashText = root.findViewById(R.id.addAmount)

        Log.d("AssetFragment","")

        addCashButton.setOnClickListener { view ->
            addCash(root)
        }

        buyAssetsbutton.setOnClickListener { view ->
            buyAssets(root)
        }

        return root
    }

    private fun buyAssets(root: View) {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = root.findViewById<TextView>(R.id.CashAmount)


        val cashBody = BuyAssetsModel(buyAssetAmount!!.text.toString().toInt(),buyAssetName!!.text.toString(),"USD_USD")



        mer.buyAssets(cashBody,user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<BuyAssetsModel>> {
            override fun onFailure(call: Call<List<BuyAssetsModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Log.d("ShowPortfolio1234",""+t)


                    /*  Toast.makeText(
                          activity,
                          "Check your connection!AddCash if",
                          Toast.LENGTH_SHORT
                      ).show()

                     */
                }
                else{
                    Log.d("ShowPortfolio12345",""+t)




                    cashAmountFloat = currentCash+addCashText!!.text.toString().toInt()
                    CashAmount.text = cashAmountFloat.toString()


                    Log.d("ShowPortfolio12345",""+CashAmount.text)

                    /*
                    Toast.makeText(
                        activity,
                        "Check your connection!AddCash else",
                        Toast.LENGTH_SHORT
                    ).show()

                     */
                }
            }
            override fun onResponse(call: Call<List<BuyAssetsModel>>, response: Response<List<BuyAssetsModel>>) {

                val asset = ArrayList<GetAssetsBody>()
                Log.d("ShowPortfolio123",""+response.body())

                if (response.code() == 201) {
                    Log.d("ShowPortfolio",""+response.body())


                    val res: List<BuyAssetsModel>? = response.body()

                    for(i in res.orEmpty()){
            //            asset.add(GetAssetsBody(i.owner,i.tr_eq,i.amount))
                    }

                    Log.d("asdfsa",""+asset[0].amount)

                    cashAmountFloat = asset[0].amount.toFloat()
                    CashAmount.text = asset[0].amount.toString()




                }
                else  {
                    Toast.makeText(
                        activity,
                        "Check your connection!AddCash true",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        })

    }

    private fun addCash(root: View) {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = root.findViewById<TextView>(R.id.CashAmount)


        val cashBody = AddCashBody(addCashText!!.text.toString().toInt())



        mer.addCash(cashBody,user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetAssetsBody>> {
            override fun onFailure(call: Call<List<GetAssetsBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Log.d("ShowPortfolio1234",""+t)


                    /*  Toast.makeText(
                          activity,
                          "Check your connection!AddCash if",
                          Toast.LENGTH_SHORT
                      ).show()

                     */
                }
                else{
                    Log.d("ShowPortfolio12345",""+t)




                    cashAmountFloat = currentCash+addCashText!!.text.toString().toInt()
                    CashAmount.text = cashAmountFloat.toString()


                    Log.d("ShowPortfolio12345",""+CashAmount.text)

                    /*
                    Toast.makeText(
                        activity,
                        "Check your connection!AddCash else",
                        Toast.LENGTH_SHORT
                    ).show()

                     */
                }
            }
            override fun onResponse(call: Call<List<GetAssetsBody>>, response: Response<List<GetAssetsBody>>) {

                val asset = ArrayList<GetAssetsBody>()
                Log.d("ShowPortfolio123",""+response.body())

                if (response.code() == 201) {
                    Log.d("ShowPortfolio",""+response.body())


                    val res: List<GetAssetsBody>? = response.body()

                    for(i in res.orEmpty()){
                        asset.add(GetAssetsBody(i.owner,i.tr_eq,i.amount))
                    }

                    Log.d("asdfsa",""+asset[0].amount)

                    cashAmountFloat = asset[0].amount.toFloat()
                    CashAmount.text = asset[0].amount.toString()




                }
                else  {
                    Toast.makeText(
                        activity,
                        "Check your connection!AddCash true",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        })

    }

    private fun getAmount(root: View) {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = root.findViewById<TextView>(R.id.CashAmount)


        mer.getAssets(user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetAssetsBody>> {
            override fun onFailure(call: Call<List<GetAssetsBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetAssetsBody>>, response: Response<List<GetAssetsBody>>) {

                val asset = ArrayList<GetAssetsBody>()
                Log.d("ShowPortfolio123",""+response.body())

                if (response.code() == 200) {
                    Log.d("ShowPortfolio",""+response.body())


                    val res: List<GetAssetsBody>? = response.body()

                    for(i in res.orEmpty()){
                        asset.add(GetAssetsBody(i.owner, i.tr_eq,i.amount))
                    }

                    Log.d("asdfsa",""+asset[0].amount)

                    cashAmountFloat = asset[0].amount
                    CashAmount.text = asset[0].amount.toString()

                    currentCash= asset[0].amount

                }
                else  {
                    Toast.makeText(
                        activity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        })

    }
}