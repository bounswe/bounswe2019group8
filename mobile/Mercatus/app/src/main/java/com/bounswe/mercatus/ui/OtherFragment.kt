package com.bounswe.mercatus.ui

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
import com.bounswe.mercatus.Adapters.ForexAdapter
import com.bounswe.mercatus.Fragments.SearchForexActivity
import com.bounswe.mercatus.Models.TradingEquipments.ForexShowBody
import com.bounswe.mercatus.Models.TradingEquipments.OtherTradingBody
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_other.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.ConnectException

class OtherFragment : Fragment() {
    private lateinit var rv: RecyclerView
    private lateinit var fab: FloatingActionButton
    private var hasHeader: Boolean = false

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_other, container, false)

        rv = root.findViewById(R.id.recyclerViewOther)
        rv.layoutManager = LinearLayoutManager(activity, RecyclerView.VERTICAL, false)

        getItems(root)

        fab  = root.findViewById(R.id.fabForexSearch)
        fab.setOnClickListener {
            val intent = Intent(root.context, SearchForexActivity::class.java)
            startActivity(intent)
        }
        return root
    }

    private fun getItems(root: View){
        val mer = RetrofitInstance.getRetrofitInstance().create(ApiInterface::class.java)

        val forexItems = ArrayList<ForexShowBody>()

        mer.getOtherEquipments().enqueue(object :
            Callback<List<OtherTradingBody>> {
            override fun onFailure(call: Call<List<OtherTradingBody>>, t: Throwable) {
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
            override fun onResponse(call: Call<List<OtherTradingBody>>, response: Response<List<OtherTradingBody>>) {
                if (response.code() == 200) {
                    val respo: List<OtherTradingBody>? = response.body()

                    for(i in respo.orEmpty()){
                        if(i.type != "digital" && i.type != "forex"){
                            forexItems.add(
                                ForexShowBody(
                                    i.name,
                                    i.sym,
                                    i.pk
                                )
                            )
                        }
                    }
                    if(forexItems.size > 1){
                        forexItems.removeAt(forexItems.size-1)
                    }

                    val adapter = ForexAdapter(root.context, forexItems)

                    rv.adapter = adapter
                    runLayoutAnimation()
                    adapter.notifyDataSetChanged()
                }
                else  {
                    Toast.makeText(activity, "Get equipments failed.", Toast.LENGTH_SHORT)
                        .show()
                }
            }
        })
    }
    private fun runLayoutAnimation() = recyclerViewOther.apply {
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
        getItems(super.getView()!!)
        super.onStart()
    }
}