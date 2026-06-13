package com.example.trafficfinecollectionsystem

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.navigation.compose.rememberNavController
import com.example.trafficfinecollectionsystem.navigation.AppNavigation
import com.example.trafficfinecollectionsystem.ui.theme.TrafficFineCollectionSystemTheme
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Firebase
        FirebaseUtils.initializeFirebase(this)
        
        setContent {
            TrafficFineCollectionSystemTheme {
                val navController = rememberNavController()
                AppNavigation(navController = navController)
            }
        }
    }
}