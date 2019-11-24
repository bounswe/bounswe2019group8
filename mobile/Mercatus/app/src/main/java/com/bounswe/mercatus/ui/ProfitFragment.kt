package com.bounswe.mercatus.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.bounswe.mercatus.R
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry

class ProfitFragment : Fragment() {
    private lateinit var pieC: PieChart

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val root = inflater.inflate(R.layout.fragment_profit, container, false)

        pieC  = root.findViewById(R.id.pieChart)

        val yVals = ArrayList<PieEntry>()
        yVals.add(PieEntry(45f, "Income"))
        yVals.add(PieEntry(55f, "Loss"))

        val dataSet = PieDataSet(yVals, "")
        dataSet.valueTextSize=0f
        val colors = ArrayList<Int>()
        colors.add(ContextCompat.getColor(root.context, R.color.purpleDark))
        colors.add(ContextCompat.getColor(root.context, R.color.blueDark))

        dataSet.colors = colors
        val data = PieData(dataSet)
        pieC.data = data
        pieC.centerTextRadiusPercent = 0f
        //pieC.isDrawHoleEnabled = false
        //pieC.legend.isEnabled = false
        pieC.description.isEnabled = false
        return root
    }
}