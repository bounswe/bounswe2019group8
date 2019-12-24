package com.bounswe.mercatus.Fragments.Articles

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.AssetsAdapter
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.R
import com.bounswe.mercatus.ui.AssetsFragment
import kotlinx.android.synthetic.main.activity_create_article.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class CreateAssetsActivity : AppCompatActivity() {

    private lateinit var addCashButton: Button

    private lateinit var buyAssetsbutton: Button
    private lateinit var addCashText: EditText

    private lateinit var buyAssetName: EditText
    private lateinit var buyAssetAmount: EditText

    var cashAmountFloat: Float = 0.0f

    public val asset = ArrayList<GetAssetsBody>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_asset2)

        val CashAmount = findViewById<TextView>(R.id.CashAmountLayout)


        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)

        val tokenV = res?.getString("token", "Data Not Found!")


        val user_id = res?.getString("user_id", "Data Not Found!")

        // Create go back button on toolbar
        val actionBar = supportActionBar
        actionBar!!.title = getString(R.string.create_article)
        actionBar.setDisplayHomeAsUpEnabled(true)

        addCashButton  = findViewById(R.id.addAmountButton)
        getAmount()

        buyAssetsbutton  = findViewById(R.id.buyAsset)

        buyAssetName = findViewById(R.id.buyAssetName)

        buyAssetAmount = findViewById(R.id.buyAssetAmount)

        addCashText = findViewById(R.id.addAmount)

        Log.d("AssetFragment","")

        addCashButton.setOnClickListener { view ->
            addCash()
        }

        buyAssetsbutton.setOnClickListener { view ->
            buyAssets()
        }
    }

    private fun buyAssets() {

        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = findViewById<TextView>(R.id.CashAmount)


        val cashBody = BuyAssetsModel(buyAssetAmount!!.text.toString().toInt(),buyAssetName!!.text.toString(),"USD_USD")



        mer.buyAssets(cashBody,user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<GetAssetsBody> {
            override fun onFailure(call: Call<GetAssetsBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Log.d("BuyAssetThrowIf",""+t)


                    /*  Toast.makeText(
                          activity,
                          "Check your connection!AddCash if",
                          Toast.LENGTH_SHORT
                      ).show()

                     */
                }
                else{
                    Log.d("BuyAssetThrowElse",""+t)




                    cashAmountFloat = cashAmountFloat+addCashText!!.text.toString().toInt()
                    CashAmount.text = cashAmountFloat.toString()


                    Log.d("BuyAssetThrowElse",""+CashAmount.text)

                    /*
                    Toast.makeText(
                        activity,
                        "Check your connection!AddCash else",
                        Toast.LENGTH_SHORT
                    ).show()

                     */
                }
            }
            override fun onResponse(call: Call<GetAssetsBody>, response: Response<GetAssetsBody>) {

                Log.d("BuyAsset",""+response.body())

                if (response.code() == 200) {
                    Log.d("BuyAssetIf",""+response.body())


                    val res: GetAssetsBody? = response.body()

                  //  for(i in res){
                        //            asset.add(GetAssetsBody(i.owner,i.tr_eq,i.amount))
                  //  }


                    cashAmountFloat = res!!.amount
                    CashAmount.text = res!!.amount.toString()

                    val refreshActivity = intent
                    finish()


                }
                else  {
                    Log.d("throwElse","")
                }
            }
        })

    }

    private fun getAmount() {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = findViewById<TextView>(R.id.CashAmount)


        mer.getAssets(user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetAssetsBody>> {
            override fun onFailure(call: Call<List<GetAssetsBody>>, t: Throwable) {
                if(t.cause is ConnectException){

                }
                else{

                }
            }
            override fun onResponse(call: Call<List<GetAssetsBody>>, response: Response<List<GetAssetsBody>>) {


                Log.d("getAmountResponse",""+response.body())

                if (response.code() == 200) {

                    asset.clear()
                    Log.d("getAmountResponseIf",""+response.body())


                    val res: List<GetAssetsBody>? = response.body()

                    for(i in res.orEmpty()){
                        if(i.tr_eq.sym=="USD_USD"){
                            cashAmountFloat=i.amount
                            CashAmount.text = i.amount.toString()
                        }
                    }





                }
                else  {

                }
            }
        })

    }

    private fun addCash() {
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")
        val CashAmount = findViewById<TextView>(R.id.CashAmount)


        val cashBody = AddCashBody(addCashText!!.text.toString().toInt())



        mer.addCash(cashBody,user_id!!.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetAssetsBody>> {
            override fun onFailure(call: Call<List<GetAssetsBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Log.d("addCashThrowIf",""+t)


                    /*  Toast.makeText(
                          activity,
                          "Check your connection!AddCash if",
                          Toast.LENGTH_SHORT
                      ).show()

                     */
                }
                else{
                    Log.d("addCashThrowElse",""+t)




                    cashAmountFloat = cashAmountFloat+addCashText!!.text.toString().toInt()
                    CashAmount.text = cashAmountFloat.toString()
                    addCashText!!.setText("")


                    Log.d("addCashThrowElse",""+CashAmount.text)

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
                Log.d("addCashResnpose",""+response.body())

                if (response.code() == 201) {
                    Log.d("addCashResnpose",""+response.body())


                    val res: List<GetAssetsBody>? = response.body()

                    for(i in res.orEmpty()){
                        asset.add(GetAssetsBody(i.owner,i.tr_eq,i.amount))
                    }

                    Log.d("addCashResnposeIf",""+asset[0].amount)

                    cashAmountFloat = asset[0].amount.toFloat()
                    CashAmount.text = asset[0].amount.toString()




                }
                else  {
                    Log.d(" AddCashRenposeElse",""+asset[0].amount)


                }
            }
        })

    }
}