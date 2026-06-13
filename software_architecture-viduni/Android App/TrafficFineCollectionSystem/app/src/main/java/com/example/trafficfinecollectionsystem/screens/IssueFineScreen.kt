package com.example.trafficfinecollectionsystem.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.trafficfinecollectionsystem.data.models.Fine
import com.example.trafficfinecollectionsystem.data.models.defaultViolationCategories
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils
import com.example.trafficfinecollectionsystem.viewmodel.AuthViewModel
import com.example.trafficfinecollectionsystem.viewmodel.FineViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IssueFineScreen(
    onSubmit: () -> Unit,
    authViewModel: AuthViewModel = viewModel(),
    fineViewModel: FineViewModel = viewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    val fineState by fineViewModel.fineState.collectAsState()

    var driverNic by remember { mutableStateOf("") }
    var driverName by remember { mutableStateOf("") }
    var driverPhone by remember { mutableStateOf("") }
    var licenseNo by remember { mutableStateOf("") }
    var vehicleNo by remember { mutableStateOf("") }
    var vehicleModel by remember { mutableStateOf("") }
    var violationId by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    var expanded by remember { mutableStateOf(false) }

    LaunchedEffect(fineState.successMessage) {
        if (fineState.successMessage != null) {
            onSubmit()
            fineViewModel.clearSuccess()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Text(
            "📝 Issue Traffic Fine",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(bottom = 20.dp)
        )

        // Form Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                // Section: Driver Information
                Text(
                    "🚗 Driver Information",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                OutlinedTextField(
                    value = driverName,
                    onValueChange = { driverName = it },
                    label = { Text("Driver Name *") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                )

                OutlinedTextField(
                    value = driverNic,
                    onValueChange = { driverNic = it },
                    label = { Text("Driver NIC/ID *") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                )

                OutlinedTextField(
                    value = driverPhone,
                    onValueChange = { driverPhone = it },
                    label = { Text("Phone Number") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                )

                OutlinedTextField(
                    value = licenseNo,
                    onValueChange = { licenseNo = it },
                    label = { Text("License Number") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp)
                )

                Divider()

                // Section: Vehicle Information
                Text(
                    "🚙 Vehicle Information",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(vertical = 12.dp)
                )

                OutlinedTextField(
                    value = vehicleNo,
                    onValueChange = { vehicleNo = it },
                    label = { Text("Vehicle Number *") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                )

                OutlinedTextField(
                    value = vehicleModel,
                    onValueChange = { vehicleModel = it },
                    label = { Text("Vehicle Model") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp)
                )

                Divider()

                // Section: Violation Details
                Text(
                    "⚠️ Violation Details",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(vertical = 12.dp)
                )

                ExposedDropdownMenuBox(
                    expanded = expanded,
                    onExpandedChange = { expanded = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {
                    OutlinedTextField(
                        value = violationId.takeIf { it.isNotBlank() }?.let { id ->
                            defaultViolationCategories.find { it.categoryId == id }?.name ?: ""
                        } ?: "",
                        onValueChange = {},
                        label = { Text("Violation Category *") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(),
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) }
                    )
                    ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        defaultViolationCategories.forEach { category ->
                            DropdownMenuItem(
                                text = { Text("${category.name} - ₹${category.fineAmount}") },
                                onClick = { violationId = category.categoryId; expanded = false }
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = { Text("Location/Street") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                )

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Additional Notes") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp)
                        .padding(bottom = 12.dp),
                    maxLines = 4
                )

                // Error/Success Messages
                if (fineState.error != null) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFB00020))
                    ) {
                        Text(
                            fineState.error ?: "",
                            color = Color.White,
                            modifier = Modifier.padding(12.dp),
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }

                if (fineState.successMessage != null) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF4CAF50))
                    ) {
                        Text(
                            fineState.successMessage ?: "",
                            color = Color.White,
                            modifier = Modifier.padding(12.dp),
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                }

                // Submit Button
                Button(
                    onClick = {
                        val violation = defaultViolationCategories.find { it.categoryId == violationId }
                        if (driverName.isNotBlank() && driverNic.isNotBlank() &&
                            vehicleNo.isNotBlank() && violation != null && location.isNotBlank()
                        ) {
                            val fine = Fine(
                                officerId = authState.user?.uid ?: "",
                                officerName = authState.user?.name ?: "",
                                driverNic = driverNic,
                                driverName = driverName,
                                driverPhone = driverPhone,
                                licenseNumber = licenseNo,
                                vehicleNumber = vehicleNo,
                                vehicleModel = vehicleModel,
                                violationCategory = violation.name,
                                violationDescription = violation.description,
                                fineAmount = violation.fineAmount,
                                location = location,
                                notes = notes
                            )
                            fineViewModel.issueFine(fine)
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .padding(top = 12.dp),
                    enabled = !fineState.isLoading,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))
                ) {
                    if (fineState.isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color.White,
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text("ISSUE FINE", style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}