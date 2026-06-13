package com.example.trafficfinecollectionsystem.data.repository

import android.content.Context
import org.json.JSONObject
import java.security.MessageDigest
import java.util.UUID

class LocalAuthRepository(context: Context) {
    private val sharedPreferences = context.applicationContext.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE)

    fun signup(
        email: String,
        password: String,
        name: String,
        badgeNumber: String,
        phone: String,
        station: String,
        rank: String
    ): Result<LocalAuthSession> {
        return try {
            if (getOfficerByEmail(email) != null) {
                return Result.failure(Exception("Account already exists for this email"))
            }

            val officer = JSONObject().apply {
                put("uid", UUID.randomUUID().toString())
                put("email", email)
                put("name", name)
                put("badgeNumber", badgeNumber)
                put("phone", phone)
                put("station", station)
                put("rank", rank)
                put("passwordHash", hashPassword(email, password))
                put("createdAt", System.currentTimeMillis())
                put("isActive", true)
            }

            sharedPreferences.edit()
                .putString(keyForOfficer(officer.getString("uid")), officer.toString())
                .putString(KEY_LAST_SESSION, officer.getString("uid"))
                .apply()

            Result.success(officer.toSession())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun login(email: String, password: String): Result<LocalAuthSession> {
        return try {
            val officer = getOfficerByEmail(email) ?: throw Exception("Invalid email or password")
            val expectedHash = officer.getString("passwordHash")
            if (expectedHash != hashPassword(email, password)) {
                throw Exception("Invalid email or password")
            }

            sharedPreferences.edit().putString(KEY_LAST_SESSION, officer.getString("uid")).apply()
            Result.success(officer.toSession())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getLastSession(): LocalAuthSession? {
        val uid = sharedPreferences.getString(KEY_LAST_SESSION, null) ?: return null
        val officer = sharedPreferences.getString(keyForOfficer(uid), null) ?: return null
        return JSONObject(officer).toSession()
    }

    fun logout() {
        sharedPreferences.edit().remove(KEY_LAST_SESSION).apply()
    }

    private fun getOfficerByEmail(email: String): JSONObject? {
        return sharedPreferences.all.values
            .mapNotNull { value -> value as? String }
            .mapNotNull { runCatching { JSONObject(it) }.getOrNull() }
            .firstOrNull { it.optString("email") == email }
    }

    private fun hashPassword(email: String, password: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest("$email:$password".toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }

    private fun JSONObject.toSession(): LocalAuthSession {
        return LocalAuthSession(
            uid = optString("uid"),
            email = optString("email"),
            name = optString("name"),
            badgeNumber = optString("badgeNumber"),
            phone = optString("phone"),
            station = optString("station"),
            rank = optString("rank")
        )
    }

    private fun keyForOfficer(uid: String): String = "local_officer_$uid"

    data class LocalAuthSession(
        val uid: String,
        val email: String,
        val name: String,
        val badgeNumber: String,
        val phone: String,
        val station: String,
        val rank: String
    )

    companion object {
        private const val FILE_NAME = "local_auth_store"
        private const val KEY_LAST_SESSION = "last_session_uid"
    }
}
