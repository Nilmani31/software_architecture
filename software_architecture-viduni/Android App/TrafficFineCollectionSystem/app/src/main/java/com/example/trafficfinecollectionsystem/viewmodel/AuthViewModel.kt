package com.example.trafficfinecollectionsystem.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfinecollectionsystem.data.models.Officer
import com.example.trafficfinecollectionsystem.data.repository.FirestoreRepository
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils
import com.google.firebase.auth.FirebaseAuth
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

class AuthViewModel : ViewModel() {
    private val auth = FirebaseUtils.getFirebaseAuth()
    private val repository = FirestoreRepository()

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState

    init {
        checkLoginStatus()
    }

    fun checkLoginStatus() {
        val currentUser = auth.currentUser
        if (currentUser != null) {
            loadUserProfile(currentUser.uid)
        } else {
            _authState.value = AuthState(isLoggedIn = false)
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
                        _authState.value = _authState.value.copy(
                            isLoading = false,
                            error = e.message ?: "Failed to create profile"
                        )
                    }
            } catch (e: Exception) {
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Signup failed"
                )
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
                loadUserProfile(uid)
            } catch (e: Exception) {
                _authState.value = _authState.value.copy(
                    isLoading = false,
                    error = e.message ?: "Login failed"
                )
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
}
