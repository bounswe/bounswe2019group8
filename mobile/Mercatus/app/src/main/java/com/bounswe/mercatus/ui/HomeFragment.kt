package com.bounswe.mercatus.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.Fragments.SearchActivity
import com.bounswe.mercatus.R
import com.google.android.material.floatingactionbutton.FloatingActionButton

class HomeFragment : Fragment() {
    private lateinit var fab: FloatingActionButton

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_home, container, false)

        fab  = root.findViewById(R.id.fab)
        fab.setOnClickListener { view ->
            val intent = Intent(root.context, SearchActivity::class.java)
            startActivity(intent)
        }


        return root
    }
}