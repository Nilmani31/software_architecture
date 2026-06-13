package com.example.trafficfinecollectionsystem.security

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class JwtTokenStore(context: Context) {
    private val appContext = context.applicationContext
    private val sharedPreferences = appContext.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE)

    fun saveToken(token: String) {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
        val iv = cipher.iv
        val encryptedToken = cipher.doFinal(token.toByteArray(Charsets.UTF_8))
        sharedPreferences.edit()
            .putString(KEY_TOKEN, encode(iv, encryptedToken))
            .apply()
    }

    fun getToken(): String? {
        val storedValue = sharedPreferences.getString(KEY_TOKEN, null) ?: return null
        val decoded = decode(storedValue)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        val gcmSpec = GCMParameterSpec(TAG_LENGTH_BITS, decoded.iv)
        cipher.init(Cipher.DECRYPT_MODE, getOrCreateSecretKey(), gcmSpec)
        val decryptedToken = cipher.doFinal(decoded.payload)
        return decryptedToken.toString(Charsets.UTF_8)
    }

    fun clearToken() {
        sharedPreferences.edit().remove(KEY_TOKEN).apply()
    }

    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE).apply {
            load(null)
        }
        val existingKey = keyStore.getKey(KEY_ALIAS, null)
        if (existingKey is SecretKey) {
            return existingKey
        }

        val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE)
        val keySpec = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setUserAuthenticationRequired(false)
            .build()
        keyGenerator.init(keySpec)
        return keyGenerator.generateKey()
    }

    private fun encode(iv: ByteArray, payload: ByteArray): String {
        val combined = ByteArray(iv.size + payload.size)
        System.arraycopy(iv, 0, combined, 0, iv.size)
        System.arraycopy(payload, 0, combined, iv.size, payload.size)
        return Base64.encodeToString(combined, Base64.NO_WRAP)
    }

    private fun decode(data: String): TokenPayload {
        val combined = Base64.decode(data, Base64.NO_WRAP)
        val iv = combined.copyOfRange(0, IV_LENGTH_BYTES)
        val payload = combined.copyOfRange(IV_LENGTH_BYTES, combined.size)
        return TokenPayload(iv, payload)
    }

    private data class TokenPayload(
        val iv: ByteArray,
        val payload: ByteArray
    )

    companion object {
        private const val FILE_NAME = "jwt_session_store"
        private const val KEY_TOKEN = "auth_jwt_token"
        private const val KEY_ALIAS = "tfcs_jwt_key_alias"
        private const val ANDROID_KEY_STORE = "AndroidKeyStore"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val TAG_LENGTH_BITS = 128
        private const val IV_LENGTH_BYTES = 12
    }
}
