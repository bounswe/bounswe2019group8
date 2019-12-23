package com.bounswe.mercatus.Fragments.TradingEqps

import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.CommentTradingAdapter
import com.bounswe.mercatus.Models.Comments.CommentShowTradingBody
import com.bounswe.mercatus.Models.CreateCommentBody
import com.bounswe.mercatus.Models.PredictionModel
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.activity_forex_show.*
import kotlinx.android.synthetic.main.dialog_new_category.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class ShowForexActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forex_show)

        val forexID = intent.getStringExtra("forex_id")
        val forexName = intent.getStringExtra("forex_name")

        val actionBar = supportActionBar
        actionBar!!.title = forexName
        actionBar.setDisplayHomeAsUpEnabled(true)

        if(forexID != null){
            getUpVotes(forexID.toInt())
            getDownVotes(forexID.toInt())
        }

        val rv = findViewById<RecyclerView>(R.id.recyclerViewForex)
        rv.layoutManager = LinearLayoutManager(this, RecyclerView.VERTICAL, false)

        val commentsList = ArrayList<CommentShowTradingBody>()

        var adapter = CommentTradingAdapter(this@ShowForexActivity, commentsList)
        rv.adapter = adapter

        zoomIn.setOnClickListener {
            val intent = Intent(this@ShowForexActivity, ZoomEqpActivity::class.java)
            intent.putExtra("forex_id", forexID)
            intent.putExtra("forex_name", forexName)
            startActivity(intent)
            finish()
        }
        fabForex.setOnClickListener {
            val dialogBuilder = AlertDialog.Builder(this)
                .setTitle("Comment")
                .setCancelable(true)
                .create()
            val editView = layoutInflater.inflate(R.layout.dialog_new_category, null)
            dialogBuilder.setView(editView)
            dialogBuilder.setButton(AlertDialog.BUTTON_POSITIVE, "Send", DialogInterface.OnClickListener{
                    dialog, _ ->
                val text = dialogBuilder.editCategory.text
                if(text.toString().isEmpty()){
                    Toast.makeText(this@ShowForexActivity, "Comment cannot be empty!", Toast.LENGTH_SHORT).show()
                    dialogBuilder.layCategory.isErrorEnabled = true
                    dialogBuilder.layCategory.error = "Comment cannot be empty!"
                }
                else{
                    dialogBuilder.layCategory.isErrorEnabled = false
                    makeComments(text.toString(), forexID!!.toInt())
                    val refreshActivity = intent
                    finish()
                    startActivity(refreshActivity)
                    dialog.dismiss()
                }
            })
            dialogBuilder.setButton(AlertDialog.BUTTON_NEGATIVE, "Cancel", DialogInterface.OnClickListener {
                    dialog, _ ->
                dialog.dismiss()

            })
            dialogBuilder.show()
        }

        //getForexParity(forexID!!.toInt(), forexName!!)
        getComments(forexID!!.toInt(), commentsList, adapter)
    }
    /*private fun getForexParity(forex_id: Int, forexName: String){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res.getString("token", "Data Not Found!")
        mer.getForexParity(forex_id, "Token " + tokenV.toString()).enqueue(object :
            Callback<List<ForexParityModel>> {
            override fun onFailure(call: Call<List<ForexParityModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
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
                        vl.setDrawFilled(true)
                        vl.lineWidth = 3f
                        vl.fillColor = R.color.gray
                        vl.fillAlpha = R.color.red
                        lineChart.xAxis.labelRotationAngle = 0f
                        lineChart.data = LineData(vl)
                        lineChart.axisRight.isEnabled = false
                        lineChart.xAxis.axisMaximum = j+0.1f
                        lineChart.setTouchEnabled(true)
                        lineChart.description.text = "Days"
                        lineChart.setNoDataText("No forex yet!")
                        lineChart.setPinchZoom(true)
                        val markerView = CustomMarker(this@ShowForexActivity, R.layout.marker_view)
                        lineChart.marker = markerView

                        lineChart.animateX(1800, Easing.EaseInExpo)
                        //lineChart.animateXY(3600,3600, Easing.EaseInOutBounce, Easing.EaseInExpo)
                    }
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Show forex failed", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

     */
    private fun getComments(eqp_id: Int, commentsList: ArrayList<CommentShowTradingBody>, adapter: CommentTradingAdapter){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")


        mer.getEqpComments(eqp_id,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<CommentShowTradingBody>> {
            override fun onFailure(call: Call<List<CommentShowTradingBody>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<CommentShowTradingBody>>, response: Response<List<CommentShowTradingBody>>) {
                if (response.code() == 200) {
                    val resp: List<CommentShowTradingBody>? = response.body()
                    commentsList.clear()
                    for(i in resp.orEmpty()){
                        commentsList.add(
                            CommentShowTradingBody(
                                i.author,
                                i.content,
                                i.pk,
                                i.tr_eq
                            )
                        )
                    }
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Get articles failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun makeComments(commentText: String, tr_id: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")
        val comBody = CreateCommentBody(commentText)

        mer.makeEqpComment(comBody,tr_id,"Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 201) {
                    Toast.makeText(this@ShowForexActivity, "Comment is added!", Toast.LENGTH_SHORT)
                        .show()
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Comment addition is failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun makeUpVote(forexID: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        mer.makePredictionUp(forexID,"Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    Toast.makeText(this@ShowForexActivity, "Vote is added!", Toast.LENGTH_SHORT)
                        .show()
                    //recreate()
                }
                else if(response.code() == 400){
                    Toast.makeText(this@ShowForexActivity, "You have already voted for this equipment", Toast.LENGTH_SHORT)
                        .show()
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Vote addition is failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun makeDownVote(forexID: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        mer.makePredictionDown(forexID,"Token " + tokenV.toString()).enqueue(object :
            Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.code() == 200) {
                    Toast.makeText(this@ShowForexActivity, "Vote is added!", Toast.LENGTH_SHORT)
                        .show()
                    //recreate()
                }
                else if(response.code() == 400){
                    Toast.makeText(this@ShowForexActivity, "You have already voted for this equipment", Toast.LENGTH_SHORT)
                        .show()
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Vote addition is failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }

    private fun getUpVotes(eqp_id: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        mer.getUpVotes(eqp_id,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<PredictionModel>> {
            override fun onFailure(call: Call<List<PredictionModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<PredictionModel>>, response: Response<List<PredictionModel>>) {
                if (response.code() == 200) {
                    val resUp: List<PredictionModel>? = response.body()
                    if(resUp!!.isNotEmpty()){
                        val upRes = resUp.size.toString() + " Votes"
                        upVoteText.text = upRes
                    }

                    increaseForex.setOnClickListener {
                        val upRes = (resUp.size +1).toString() + " Votes"
                        upVoteText.text = upRes
                        makeUpVote(eqp_id)
                    }
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Get votes failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun getDownVotes(eqp_id: Int){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        mer.getDownVotes(eqp_id,"Token " + tokenV.toString()).enqueue(object :
            Callback<List<PredictionModel>> {
            override fun onFailure(call: Call<List<PredictionModel>>, t: Throwable) {
                if(t.cause is ConnectException){
                    Toast.makeText(
                        this@ShowForexActivity,
                        "Check your connection!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
                else{
                    Toast.makeText(
                        this@ShowForexActivity,
                        t.message,
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<PredictionModel>>, response: Response<List<PredictionModel>>) {
                if (response.code() == 200) {
                    val resDown: List<PredictionModel>? = response.body()
                    if(resDown!!.isNotEmpty()){
                        val downRes = resDown.size.toString() + " Votes"
                        downVoteText.text = downRes
                    }

                    decreaseForex.setOnClickListener {
                        val downRes = (resDown.size +1).toString() + " Votes"
                        downVoteText.text = downRes
                        makeDownVote(eqp_id)
                    }
                }
                else  {
                    Toast.makeText(this@ShowForexActivity, "Get votes failed.", Toast.LENGTH_SHORT)
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
