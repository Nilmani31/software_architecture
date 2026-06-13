package com.example.trafficfinecollectionsystem.utils

import android.content.Context
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.FirebaseApp
import com.google.firebase.firestore.firestore

object FirebaseUtils {
    fun initializeFirebase(context: Context) {
        try {
            if (FirebaseApp.getApps(context).isEmpty()) {
                FirebaseApp.initializeApp(context)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun getFirebaseAuth(): FirebaseAuth = FirebaseAuth.getInstance()

    fun getFirestore() = Firebase.firestore

    fun getCurrentUserId(): String? = getFirebaseAuth().currentUser?.uid

    fun isUserLoggedIn(): Boolean = getFirebaseAuth().currentUser != null

    fun getCurrentUserEmail(): String? = getFirebaseAuth().currentUser?.email
}
