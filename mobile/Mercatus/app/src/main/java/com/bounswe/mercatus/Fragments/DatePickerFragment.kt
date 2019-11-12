package com.bounswe.mercatus.Fragments

import android.app.DatePickerDialog
import android.os.Bundle
import androidx.fragment.app.DialogFragment
import androidx.fragment.app.FragmentManager
import java.util.*

class DatePickerFragment: DialogFragment() {

    private lateinit var callback: Callback
    private lateinit var calendar: Calendar

    override fun onCreateDialog(savedInstanceState: Bundle?) = DatePickerDialog(
        activity!!,
        DatePickerDialog.OnDateSetListener { _, year, month, dayOfMonth -> callback.onDateSelected(calendar.apply { set(year, month, dayOfMonth) }) },
        calendar.get(Calendar.YEAR),
        calendar.get(Calendar.MONTH),
        calendar.get(Calendar.DAY_OF_MONTH)
    )

    fun display(manager: FragmentManager, tag: String, calendar: Calendar = Calendar.getInstance(), callback: Callback) {
        this.calendar = calendar
        this.callback = callback
        super.show(manager, tag)
    }

    interface Callback {
        fun onDateSelected(calendar: Calendar)
    }
}