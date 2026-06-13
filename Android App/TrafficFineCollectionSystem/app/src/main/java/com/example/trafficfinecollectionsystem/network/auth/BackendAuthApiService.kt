package com.example.trafficfinecollectionsystem.network.auth

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface BackendAuthApiService {
    @POST("auth/login")
    suspend fun login(@Body request: BackendLoginRequest): Response<BackendAuthResponse>

    @POST("auth/signup")
    suspend fun signup(@Body request: BackendSignupRequest): Response<BackendAuthResponse>
}
