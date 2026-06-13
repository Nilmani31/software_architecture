package com.example.trafficfinecollectionsystem.network

import android.content.Context
import com.example.trafficfinecollectionsystem.network.auth.BackendAuthApiService
import com.example.trafficfinecollectionsystem.security.JwtTokenStore
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object BackendApiClient {
    fun createAuthService(context: Context): BackendAuthApiService {
        val tokenStore = JwtTokenStore(context)
        val client = OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(tokenStore))
            .build()

        return Retrofit.Builder()
            .baseUrl(BackendConfig.BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(BackendAuthApiService::class.java)
    }
}
