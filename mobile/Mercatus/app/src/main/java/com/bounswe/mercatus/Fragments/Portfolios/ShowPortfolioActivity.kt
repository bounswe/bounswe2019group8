package com.bounswe.mercatus.Fragments.Portfolios

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.text.method.ScrollingMovementMethod
import android.util.Log
import android.view.LayoutInflater
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.CommentAdapter
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Fragments.User.ShowProfileActivity
import com.bounswe.mercatus.Models.*
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.ForexUpdateBody
import com.bounswe.mercatus.Models.User.UserRes
import com.bounswe.mercatus.ModelsgetArticles.CommentShowBody
import com.bounswe.mercatus.ModelsgetArticles.EquipmentShowBody
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_show_article.*
import kotlinx.android.synthetic.main.activity_show_portfolio.*
import kotlinx.android.synthetic.main.dialog_new_category.*
import kotlinx.android.synthetic.main.new_trading_equipment.view.*
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

        val portfolioID = intent.getStringExtra("portfolio_name")

        getPortfolio(name, portfolioID!!.toLong(),owner)

        val rv = findViewById<RecyclerView>(R.id.recyclerViewEquipments)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val equipmentList = ArrayList<ForexShowBody>()
        val equipmentUpdateList = ArrayList<ForexUpdateBody>()

        var adapter = ForexAdapter(this@ShowPortfolioActivity, equipmentList)
        rv.adapter = adapter

        getEquipments(portfolioID.toInt(), equipmentList, adapter)
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        val user_id = res?.getString("user_id", "Data Not Found!")


        add_a_new_trading_equipment.setOnClickListener {
            //THIS SECTION SHOULD GET FIND THE EQUIPMENT AND ADD TO CURRENT EQUIPMENT LIST.
            //GETS ERROR FROM SERVER SO I COMMENT IT
            /*

            //Inflate the dialog with custom view
            val mDialogView =
                LayoutInflater.from(this).inflate(R.layout.new_trading_equipment, null)
            //AlertDialogBuilder
            val mBuilder = AlertDialog.Builder(this)
                .setView(mDialogView)
                .setTitle("Login Form")
            //show dialog
            val mAlertDialog = mBuilder.show()
            //login button click of custom layout
            mDialogView.dialogLoginBtn.setOnClickListener {
                //dismiss dialog
                mAlertDialog.dismiss()
                //get text from EditTexts of custom layout
                val text = mDialogView.dialogNameEt.text.toString()
                //set the input text in TextView

                mercatus.getForexSearch("Token " + tokenV.toString()).enqueue(object :
                    Callback<List<ForexDataModel>> {
                    override fun onFailure(call: Call<List<ForexDataModel>>, t: Throwable) {
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

                    override fun onResponse(call: Call<List<ForexDataModel>>, response: Response<List<ForexDataModel>>) {
                        if (response.code() == 200) {

                            Log.d("SearchForexActivity",""+response)
                            Log.d("SearchForexActivity1",""+response.body())
                            Log.d("SearchForexActivity2",""+text)

                            val res: List<ForexDataModel>? = response.body()

                            for(i in res.orEmpty()){
                                Log.d("SearchForexActivity4",""+i.name)
                                if (i.name.contains(text.toString(), true)) {
                                    for(k in equipmentList){
                                        equipmentUpdateList.add(ForexUpdateBody(k.sym))
                                    }
                                    Log.d("SearchForexActivity5",""+i.name)
                                    equipmentList.add(ForexShowBody(i.name,i.sym,i.pk))
                                    equipmentUpdateList.add(ForexUpdateBody(i.sym))
                                    Log.d("SearchForexActivity6",""+equipmentList)
                                    val updatePortfolioBody = UpdatePortfolio(name.text.toString(),equipmentUpdateList)
                                    Log.d("Activity7_equip",""+updatePortfolioBody.equipments)
                                    Log.d("Activity7_name",""+updatePortfolioBody.name)

                                    Log.d("Activity7_user_id_8",""+user_id!!.toLong())
                                    Log.d("Activity7_port_id_8",""+portfolioID!!.toLong())



                                    mercatus.updatePortfolio(updatePortfolioBody,user_id!!.toLong(), "Token " + tokenV.toString(),portfolioID!!.toLong()).enqueue(object :
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

                                            Log.d("portfolio_responsePor:",""+response)
                                            Log.d("portfolio_bodyPort:",""+response.body())
                                            Log.d("portfolio_user_idPort: ",""+user_id!!.toLong())
                                            Log.d("portfolio_port_idPort: ",""+portfolioID)

                                            if (response.code() == 200) {
                                                Log.d("entered_successfuly: ",""+"")

                                            }
                                            else  {
                                                Toast.makeText(this@ShowPortfolioActivity, "Show Portfolio Activity failed", Toast.LENGTH_SHORT)
                                                    .show()
                                            }
                                        }
                                    })
                                }
                            }

                            //                 addEquipments(portfolioID.toInt(), equipmentList, adapter)
                            val refreshActivity = intent
                            finish()
                            startActivity(refreshActivity)
                            mAlertDialog.dismiss()
                            //val users: List<UserRes>? = response.body()
                            //Toast.makeText(this@SearchActivity, users?.get(0)?.first_name , Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText( this@ShowPortfolioActivity, "Search failed.", Toast.LENGTH_SHORT).show()
                        }
                    }


                })
            }
            //cancel button click of custom layout
            mDialogView.dialogCancelBtn.setOnClickListener {
                //dismiss dialog
                mAlertDialog.dismiss()
            }

             */
        }







        deletePortfolioButton.setOnClickListener {

            deletePortfolio(name, portfolioID!!.toLong(),owner)

        }
    }

    private fun getPortfolio(name: TextView, portfolioID: Long,owner: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val user_id = res?.getString("user_id", "Data Not Found!")


        mercatus.getSpecificPortfolio(user_id!!.toLong(), "Token " + tokenV.toString(),portfolioID).enqueue(object :
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

                Log.d("portfolio_response: ",""+response)
                Log.d("portfolio_body:",""+response.body())
                Log.d("portfolio_user_id: ",""+user_id!!.toLong())
                Log.d("portfolio_port_id: ",""+portfolioID)

                if (response.code() == 200) {
                    name.text = response.body()?.name
                    getUser(response.body()!!.owner, owner)

                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Show Portfolio Activity failed", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
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

                    Log.d("Get user_portfolio", ""+response)

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

    private fun getEquipments(articleID: Int, equipmentsList: ArrayList<ForexShowBody>, adapter: ForexAdapter){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")


        mer.getPortfolios(articleID.toLong(),"Token " + tokenV.toString()).enqueue(object :
            Callback<List<GetPortfolioBody>> {
            override fun onFailure(call: Call<List<GetPortfolioBody>>, t: Throwable) {
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
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<GetPortfolioBody>>, response: Response<List<GetPortfolioBody>>) {

                Log.d("ShowPortfolio123",""+response.body())
                if (response.code() == 200) {
                    val res: List<GetPortfolioBody>? = response.body()
                    equipmentsList.clear()
                    Log.d("ShowPortfolio",""+response.body())
                    for(i in res.orEmpty()){
            //            val equipments_list: List<ForexShowBody>? = i.equipments
            //            for(e in equipments_list.orEmpty()){

             //               equipmentsList.add(ForexShowBody(e.name, e.sym,e.pk))
             //           }
                    }
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Get articles failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    /*
    private fun addEquipments(articleID: Int, equipmentsList: ArrayList<ForexShowBody>, adapter: ForexAdapter){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val comBody = CreateCommentBody(commentText)

        mer.makeComment(comBody,article_pk,"Token " + tokenV.toString()).enqueue(object :
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
                if (response.code() == 201) {
                    Toast.makeText(this@ShowPortfolioActivity, "Comment is added!", Toast.LENGTH_SHORT)
                        .show()
                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Comment addition is failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }


 */
    private fun deletePortfolio(name: TextView, portfolioID: Long,owner: TextView){
        val mercatus = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)
        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")

        val user_id = res?.getString("user_id", "Data Not Found!")


        mercatus.deletePortfolio(user_id!!.toLong(), "Token " + tokenV.toString(),portfolioID).enqueue(object :
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

                Log.d("portfolio_response: ",""+response)
                Log.d("portfolio_body:",""+response.body())
                Log.d("portfolio_user_id: ",""+user_id!!.toLong())
                Log.d("portfolio_port_id: ",""+portfolioID)

                if (response.code() == 204) {

                    Log.d("portfolio_response: ",""+"Deleted portfolio")
                    finish()

                }
                else  {
                    Toast.makeText(this@ShowPortfolioActivity, "Show Portfolio Activity failed", Toast.LENGTH_SHORT)
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
