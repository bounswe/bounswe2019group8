package com.bounswe.mercatus.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.Fragments.ModifyActivity
import com.bounswe.mercatus.R



class ProfileActivity : Fragment() {
    // initialization
    private lateinit var btnModify: ImageButton
    private lateinit var profileName: TextView
    private lateinit var profileMail: TextView
    private lateinit var profileBirthday: TextView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.activity_profile, container, false)

        // define here
        btnModify = root.findViewById(R.id.btnModify)
        profileName = root.findViewById(R.id.profileName)
        profileMail = root.findViewById(R.id.profileMail)
        profileBirthday = root.findViewById(R.id.profileBirthday)

        btnModify.setOnClickListener {
            val intent = Intent(activity, ModifyActivity::class.java)
            startActivity(intent)
        }

        profileName.text = "Name: volki"
        profileMail.text = "Email: yilmaz"
        profileBirthday.text = "Birthday: 15-03-1996"

        return root
    }


}