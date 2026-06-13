package com.example.trafficfinecollectionsystem.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.trafficfinecollectionsystem.data.models.Fine
import com.example.trafficfinecollectionsystem.data.repository.FirestoreRepository
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

class FineViewModel : ViewModel() {
    private val repository = FirestoreRepository()
    private val officerId = FirebaseUtils.getCurrentUserId() ?: ""

    private val _fineState = MutableStateFlow(FineState())
    val fineState: StateFlow<FineState> = _fineState

    init {
        loadOfficerFines()
        loadStatistics()
    }

    fun loadOfficerFines() {
        _fineState.value = _fineState.value.copy(isLoading = true, error = null)

        viewModelScope.launch {
            repository.getFinesIssuedByOfficer(officerId)
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
            repository.getOfficerStatistics(officerId)
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
            repository.issueFine(fine)
                .onSuccess {
                    _fineState.value = _fineState.value.copy(
                        isLoading = false,
                        successMessage = "Fine issued successfully!"
                    )
                    loadOfficerFines()
                    loadStatistics()
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
            repository.updateFineStatus(fineId, status)
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
