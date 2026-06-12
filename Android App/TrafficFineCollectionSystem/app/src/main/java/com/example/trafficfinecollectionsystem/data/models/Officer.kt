package com.example.trafficfinecollectionsystem.data.models

data class Officer(
    val uid: String = "",
    val email: String = "",
    val name: String = "",
    val badgeNumber: String = "",
    val phone: String = "",
    val station: String = "",
    val rank: String = "",
    val photoUrl: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val isActive: Boolean = true
)
