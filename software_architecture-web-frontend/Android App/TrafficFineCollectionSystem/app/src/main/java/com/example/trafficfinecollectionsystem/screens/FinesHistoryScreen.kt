package com.example.trafficfinecollectionsystem.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.trafficfinecollectionsystem.data.models.Fine
import com.example.trafficfinecollectionsystem.viewmodel.FineViewModel
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun FinesHistoryScreen(
    onBackClick: () -> Unit,
    fineViewModel: FineViewModel = viewModel()
) {
    val fineState by fineViewModel.fineState.collectAsState()
    val dateFormat = remember { SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
    ) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1F4E78))
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        "📜 Fine History",
                        style = MaterialTheme.typography.headlineSmall,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        "Total: ${fineState.fines.size} fines",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White.copy(alpha = 0.8f)
                    )
                }
                Button(
                    onClick = onBackClick,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.2f))
                ) {
                    Text("Back", color = Color.White)
                }
            }
        }

        if (fineState.isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (fineState.fines.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("📭 No fines issued yet", style = MaterialTheme.typography.headlineMedium)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "Start issuing fines to see them here",
                        color = Color.Gray,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(fineState.fines) { fine ->
                    FineHistoryCard(fine, dateFormat)
                }
            }
        }
    }
}

@Composable
fun FineHistoryCard(fine: Fine, dateFormat: SimpleDateFormat) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        fine.vehicleNumber,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F4E78)
                    )
                    Text(
                        fine.driverName,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                }
                StatusBadge(fine.paymentStatus)
            }

            Divider(modifier = Modifier.padding(vertical = 8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        "Violation",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                    Text(
                        fine.violationCategory,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Column {
                    Text(
                        "Fine Amount",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                    Text(
                        "₹${fine.fineAmount}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFD32F2F)
                    )
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        "Location",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                    Text(
                        fine.location,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        "Date",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                    Text(
                        dateFormat.format(Date(fine.fineDate)),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val (backgroundColor, textColor) = when (status) {
        "paid" -> Color(0xFF4CAF50) to Color.White
        "pending" -> Color(0xFFFFA726) to Color.White
        "disputed" -> Color(0xFF42A5F5) to Color.White
        else -> Color.Gray to Color.White
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = backgroundColor)
    ) {
        Text(
            status.uppercase(),
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = textColor,
            fontWeight = FontWeight.Bold
        )
    }
}
