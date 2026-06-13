package com.example.trafficfinecollectionsystem.data.repository

import android.content.Context
import com.example.trafficfinecollectionsystem.network.BackendApiClient
import com.example.trafficfinecollectionsystem.network.auth.BackendLoginRequest
import com.example.trafficfinecollectionsystem.network.auth.BackendSignupRequest
import com.example.trafficfinecollectionsystem.security.JwtTokenStore

class BackendAuthRepository(context: Context) {
    private val tokenStore = JwtTokenStore(context)
    private val authService = BackendApiClient.createAuthService(context)

    suspend fun login(email: String, password: String): Result<Unit> {
        return try {
            val response = authService.login(BackendLoginRequest(email, password))
            if (response.isSuccessful) {
                val token = response.body()?.token
                if (!token.isNullOrBlank()) {
                    tokenStore.saveToken(token)
                }
                Result.success(Unit)
            } else {
                Result.failure(Exception(response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signup(
        email: String,
        password: String,
        name: String,
        badgeNumber: String,
        phone: String,
        station: String,
        rank: String
    ): Result<Unit> {
        return try {
            val response = authService.signup(
                BackendSignupRequest(
                    email = email,
                    password = password,
                    name = name,
                    badgeNumber = badgeNumber,
                    phone = phone,
                    station = station,
                    rank = rank
                )
            )
            if (response.isSuccessful) {
                val token = response.body()?.token
                if (!token.isNullOrBlank()) {
                    tokenStore.saveToken(token)
                }
                Result.success(Unit)
            } else {
                Result.failure(Exception(response.message()))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun logout() {
        tokenStore.clearToken()
    }
}
