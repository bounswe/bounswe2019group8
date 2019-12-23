package com.bounswe.mercatus.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.mercatus.API.ApiInterface
import com.bounswe.mercatus.API.RetrofitInstance
import com.bounswe.mercatus.Adapters.DigitalAdapter
import com.bounswe.mercatus.Fragments.SearchDigitalActivity
import com.bounswe.mercatus.Models.TradingEquipments.ForexDataModel
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_digital.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class DigitalFragment : Fragment() {
    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton
    private var hasHeader: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_digital, container, false)

        rv = root.findViewById(R.id.recyclerViewDigital)

        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)
        getDigitalItems(root)

        fab  = root.findViewById(R.id.fabDigital)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, SearchDigitalActivity::class.java)
            startActivity(intent)

        }

        return root
    }
    private fun getDigitalItems(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val res = activity?.getSharedPreferences("TOKEN_INFO", Context.MODE_PRIVATE)
        val tokenV = res?.getString("token", "Data Not Found!")

        val digitalItems = ArrayList<ForexShowBody>()

        mer.getDigital("Token " + tokenV.toString()).enqueue(object :
            Callback<List<ForexDataModel>> {
            override fun onFailure(call: Call<List<ForexDataModel>>, t: Throwable) {
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
                        "Something bad happened!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            override fun onResponse(call: Call<List<ForexDataModel>>, response: Response<List<ForexDataModel>>) {
                if (response.code() == 200) {
                    val respo: List<ForexDataModel>? = response.body()

                    for(i in respo.orEmpty()){
                        digitalItems.add(
                            ForexShowBody(
                                i.name,
                                i.sym,
                                i.pk
                            )
                        )
                    }

                    var adapter = DigitalAdapter(root.context, digitalItems)
                    rv.adapter = adapter
                    adapter.notifyDataSetChanged()
                    runLayoutAnimation()
                }
                else  {
                    Toast.makeText(activity, "Get equipments failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun runLayoutAnimation() = recyclerViewDigital.apply {
        layoutAnimation = AnimationUtils.loadLayoutAnimation(context, R.anim.layout_animation_fall_down)
        adapter?.notifyDataSetChanged()
        scheduleLayoutAnimation()

        if (hasHeader) {
            layoutAnimationListener = object : Animation.AnimationListener {
                override fun onAnimationStart(animation: Animation?) {
                    layoutManager?.findViewByPosition(0)?.clearAnimation()
                }
                override fun onAnimationEnd(animation: Animation?) = Unit
                override fun onAnimationRepeat(animation: Animation?) = Unit
            }
        }
    }
    override fun onStart() {
        getDigitalItems(super.getView()!!)
        super.onStart()
    }
}