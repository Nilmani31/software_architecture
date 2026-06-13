package com.example.trafficfinecollectionsystem.network.auth

data class BackendLoginRequest(
    val email: String,
    val password: String
)

data class BackendSignupRequest(
    val email: String,
    val password: String,
    val name: String,
    val badgeNumber: String,
    val phone: String,
    val station: String,
    val rank: String
)

data class BackendAuthResponse(
    val token: String,
    val officerId: String,
    val email: String,
    val name: String,
    val role: String? = null
)
