package com.example.trafficfinecollectionsystem.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfinecollectionsystem.data.models.Fine
import com.example.trafficfinecollectionsystem.data.repository.FirestoreRepository
import com.example.trafficfinecollectionsystem.data.repository.LocalAuthRepository
import com.example.trafficfinecollectionsystem.data.repository.LocalFineRepository
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class FineState(
    val isLoading: Boolean = false,
    val fines: List<Fine> = emptyList(),
    val selectedFine: Fine? = null,
    val error: String? = null,
    val successMessage: String? = null,
    val stats: Map<String, Any> = emptyMap()
)

class FineViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = FirestoreRepository()
    private val localFineRepository = LocalFineRepository(application.applicationContext)
    private val localAuthRepository = LocalAuthRepository(application.applicationContext)
    private val officerId = FirebaseUtils.getCurrentUserId()
        ?: localAuthRepository.getLastSession()?.uid
        ?: ""

    private val _fineState = MutableStateFlow(FineState())
    val fineState: StateFlow<FineState> = _fineState

    init {
        loadOfficerFines()
        loadStatistics()
    }

    fun loadOfficerFines() {
        _fineState.value = _fineState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            localFineRepository.getFinesByOfficer(officerId)
                .onSuccess { fines ->
                    _fineState.value = _fineState.value.copy(
                        isLoading = false,
                        fines = fines
                    )
                }
                .onFailure { e ->
                    _fineState.value = _fineState.value.copy(
                        isLoading = false,
                        error = e.message ?: "Failed to load fines"
                    )
                }
        }
    }

    fun loadStatistics() {
        viewModelScope.launch {
            localFineRepository.getStatistics(officerId)
                .onSuccess { stats ->
                    _fineState.value = _fineState.value.copy(stats = stats)
                }
                .onFailure { e ->
                    _fineState.value = _fineState.value.copy(error = e.message)
                }
        }
    }

    fun issueFine(fine: Fine) {
        _fineState.value = _fineState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            localFineRepository.saveFine(fine)
                .onSuccess {
                    _fineState.value = _fineState.value.copy(
                        isLoading = false,
                        successMessage = "Fine issued successfully!"
                    )
                    loadOfficerFines()
                    loadStatistics()
                    launch {
                        repository.issueFine(fine)
                    }
                }
                .onFailure { e ->
                    _fineState.value = _fineState.value.copy(
                        isLoading = false,
                        error = e.message ?: "Failed to issue fine"
                    )
                }
        }
    }

    fun selectFine(fine: Fine) {
        _fineState.value = _fineState.value.copy(selectedFine = fine)
    }

    fun updateFineStatus(fineId: String, status: String) {
        viewModelScope.launch {
            localFineRepository.updateStatus(fineId, status)
                .onSuccess {
                    loadOfficerFines()
                }
                .onFailure { e ->
                    _fineState.value = _fineState.value.copy(error = e.message)
                }
        }
    }

    fun clearError() {
        _fineState.value = _fineState.value.copy(error = null)
    }

    fun clearSuccess() {
        _fineState.value = _fineState.value.copy(successMessage = null)
    }
}
