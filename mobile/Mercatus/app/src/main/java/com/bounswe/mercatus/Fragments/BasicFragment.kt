package com.bounswe.mercatus.Fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.R
import kotlinx.android.synthetic.main.fragment_basic.*

class BasicFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_basic, container, false)
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        btnBasic.setOnClickListener {
            val intent = Intent(activity, BasicUserActivity::class.java)
            startActivity(intent) }
        activity?.overridePendingTransition(
            R.anim.slide_in_right,
            R.anim.slide_out_left
        )
    }
}