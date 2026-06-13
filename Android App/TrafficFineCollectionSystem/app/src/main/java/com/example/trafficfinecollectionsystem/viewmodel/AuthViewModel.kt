package com.example.trafficfinecollectionsystem.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfinecollectionsystem.data.models.Officer
import com.example.trafficfinecollectionsystem.data.repository.FirestoreRepository
import com.example.trafficfinecollectionsystem.data.repository.LocalAuthRepository
import com.example.trafficfinecollectionsystem.security.JwtTokenStore
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await as tasksAwait

data class AuthState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val user: Officer? = null,
    val error: String? = null,
    val successMessage: String? = null
)

class AuthViewModel(application: Application) : AndroidViewModel(application) {
    private val auth = FirebaseUtils.getFirebaseAuth()
    private val repository = FirestoreRepository()
    private val localRepository = LocalAuthRepository(application.applicationContext)
    private val tokenStore = JwtTokenStore(application.applicationContext)

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState

    init {
        checkLoginStatus()
    }

    fun checkLoginStatus() {
        val currentUser = auth.currentUser
        if (currentUser != null) {
            refreshSession(currentUser)
        } else {
            localRepository.getLastSession()?.let { session ->
                _authState.value = AuthState(
                    isLoggedIn = true,
                    user = Officer(
                        uid = session.uid,
                        email = session.email,
                        name = session.name,
                        badgeNumber = session.badgeNumber,
                        phone = session.phone,
                        station = session.station,
                        rank = session.rank
                    ),
                    successMessage = "Restored local session"
                )
            } ?: run {
                _authState.value = AuthState(isLoggedIn = false)
            }
        }
    }

    fun signup(
        email: String,
        password: String,
        name: String,
        badgeNumber: String,
        phone: String,
        station: String,
        rank: String
    ) {
        if (!validateInputs(email, password, name)) return

        _authState.value = _authState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            try {
                val result = auth.createUserWithEmailAndPassword(email, password).tasksAwait()
                val uid = result.user?.uid ?: throw Exception("User creation failed")
                result.user?.let { persistSessionToken(it) }

                val officer = Officer(
                    uid = uid,
                    email = email,
                    name = name,
                    badgeNumber = badgeNumber,
                    phone = phone,
                    station = station,
                    rank = rank
                )

                repository.createOfficerProfile(officer)
                    .onSuccess {
                        _authState.value = AuthState(
                            isLoggedIn = true,
                            user = officer,
                            successMessage = "Account created successfully!"
                        )
                    }
                    .onFailure { e ->
                        fallbackLocalSignup(email, password, name, badgeNumber, phone, station, rank, e)
                    }
            } catch (e: Exception) {
                fallbackLocalSignup(email, password, name, badgeNumber, phone, station, rank, e)
            }
        }
    }

    fun login(email: String, password: String) {
        val cleanEmail = email.trim()
        val cleanPassword = password.trim()

        if (cleanEmail.isBlank() || cleanPassword.isBlank()) {
            _authState.value = _authState.value.copy(error = "Email and password required")
            return
        }

        _authState.value = _authState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            try {
                val result = auth.signInWithEmailAndPassword(cleanEmail, cleanPassword).tasksAwait()
                val uid = result.user?.uid ?: throw Exception("Login failed")
                result.user?.let { persistSessionToken(it) }
                loadUserProfile(uid)
            } catch (e: Exception) {
                fallbackLocalLogin(cleanEmail, cleanPassword, e)
            }
        }
    }

    private fun loadUserProfile(uid: String) {
        viewModelScope.launch {
            repository.getOfficerProfile(uid)
                .onSuccess { officer ->
                    _authState.value = AuthState(
                        isLoggedIn = true,
                        user = officer
                    )
                }
                .onFailure { e ->
                    _authState.value = _authState.value.copy(
                        error = e.message ?: "Failed to load profile"
                    )
                }
        }
    }

    fun logout() {
        auth.signOut()
        localRepository.logout()
        tokenStore.clearToken()
        _authState.value = AuthState(isLoggedIn = false)
    }

    fun clearError() {
        _authState.value = _authState.value.copy(error = null)
    }

    private fun validateInputs(email: String, password: String, name: String): Boolean {
        return when {
            email.isBlank() -> {
                _authState.value = _authState.value.copy(error = "Email is required")
                false
            }
            !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches() -> {
                _authState.value = _authState.value.copy(error = "Invalid email format")
                false
            }
            password.length < 6 -> {
                _authState.value = _authState.value.copy(error = "Password must be at least 6 characters")
                false
            }
            name.isBlank() -> {
                _authState.value = _authState.value.copy(error = "Name is required")
                false
            }
            else -> true
        }
    }

    private fun refreshSession(user: FirebaseUser) {
        viewModelScope.launch {
            try {
                persistSessionToken(user)
                loadUserProfile(user.uid)
            } catch (e: Exception) {
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Failed to restore session"
                )
            }
        }
    }

    private suspend fun persistSessionToken(user: FirebaseUser) {
        val token = user.getIdToken(true).tasksAwait().token
        if (!token.isNullOrBlank()) {
            tokenStore.saveToken(token)
        }
    }

    private fun fallbackLocalSignup(
        email: String,
        password: String,
        name: String,
        badgeNumber: String,
        phone: String,
        station: String,
        rank: String,
        cause: Throwable
    ) {
        localRepository.signup(email, password, name, badgeNumber, phone, station, rank)
            .onSuccess { session ->
                tokenStore.saveToken("local-${session.uid}-${System.currentTimeMillis()}")
                _authState.value = AuthState(
                    isLoggedIn = true,
                    user = Officer(
                        uid = session.uid,
                        email = session.email,
                        name = session.name,
                        badgeNumber = session.badgeNumber,
                        phone = session.phone,
                        station = session.station,
                        rank = session.rank
                    ),
                    successMessage = "Account created locally"
                )
            }
            .onFailure {
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = cause.message ?: it.message ?: "Signup failed"
                )
            }
    }

    private fun fallbackLocalLogin(email: String, password: String, cause: Throwable) {
        localRepository.login(email, password)
            .onSuccess { session ->
                tokenStore.saveToken("local-${session.uid}-${System.currentTimeMillis()}")
                _authState.value = AuthState(
                    isLoggedIn = true,
                    user = Officer(
                        uid = session.uid,
                        email = session.email,
                        name = session.name,
                        badgeNumber = session.badgeNumber,
                        phone = session.phone,
                        station = session.station,
                        rank = session.rank
                    )
                )
            }
            .onFailure {
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = cause.message ?: it.message ?: "Login failed"
                )
            }
    }
}
