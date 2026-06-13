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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.trafficfinecollectionsystem.viewmodel.AuthViewModel

@Composable
fun OfficerProfileScreen(
    onBackClick: () -> Unit,
    authViewModel: AuthViewModel = viewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    val officer = authState.user

    var name by remember(officer) { mutableStateOf(officer?.name ?: "") }
    var phone by remember(officer) { mutableStateOf(officer?.phone ?: "") }
    var station by remember(officer) { mutableStateOf(officer?.station ?: "") }
    var isEditingMode by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1F4E78))
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    "👤 Officer Profile",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Button(
                    onClick = onBackClick,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.2f))
                ) {
                    Text("Back", color = Color.White)
                }
            }
        }

        if (officer != null) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Profile Info Card
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            "👮",
                            style = MaterialTheme.typography.displayMedium,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        Text(
                            officer.name,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            officer.rank.replaceFirstChar { it.uppercase() },
                            style = MaterialTheme.typography.bodyLarge,
                            color = Color(0xFF1F4E78)
                        )
                    }
                }

                // Badge Section
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp)
                    ) {
                        Text(
                            "📋 Badge Information",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        InfoRow("Badge Number", officer.badgeNumber)
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        InfoRow("Email", officer.email)
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        InfoRow("Station", officer.station)
                    }
                }

                // Editable Section
                if (isEditingMode) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp)
                        ) {
                            Text(
                                "✏️ Edit Profile",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 12.dp)
                            )

                            OutlinedTextField(
                                value = name,
                                onValueChange = { name = it },
                                label = { Text("Full Name") },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 12.dp)
                            )

                            OutlinedTextField(
                                value = phone,
                                onValueChange = { phone = it },
                                label = { Text("Phone Number") },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 12.dp),
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                            )

                            OutlinedTextField(
                                value = station,
                                onValueChange = { station = it },
                                label = { Text("Station") },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 12.dp)
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Button(
                                    onClick = { isEditingMode = false },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(50.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFB0BEC5))
                                ) {
                                    Text("CANCEL", color = Color.White)
                                }

                                Button(
                                    onClick = {
                                        // Update profile logic here
                                        isEditingMode = false
                                    },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(50.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))
                                ) {
                                    Text("SAVE", color = Color.White)
                                }
                            }
                        }
                    }
                } else {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp)
                        ) {
                            Text(
                                "📞 Contact Information",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(bottom = 12.dp)
                            )

                            InfoRow("Phone", officer.phone.takeIf { it.isNotBlank() } ?: "Not added")
                            Divider(modifier = Modifier.padding(vertical = 8.dp))
                            InfoRow("Station", officer.station.takeIf { it.isNotBlank() } ?: "Not added")

                            Button(
                                onClick = { isEditingMode = true },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(50.dp)
                                    .padding(top = 12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2196F3))
                            ) {
                                Text("EDIT PROFILE", color = Color.White)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )
        Text(
            value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold
        )
    }
}
