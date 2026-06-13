package com.example.trafficfinecollectionsystem.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.trafficfinecollectionsystem.viewmodel.AuthViewModel
import com.example.trafficfinecollectionsystem.viewmodel.FineViewModel

@Composable
fun DashboardScreen(
    onIssueFine: () -> Unit,
    onViewFines: () -> Unit,
    onProfile: () -> Unit,
    onLogout: () -> Unit,
    authViewModel: AuthViewModel = viewModel(),
    fineViewModel: FineViewModel = viewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    val fineState by fineViewModel.fineState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F5))
            .verticalScroll(rememberScrollState())
    ) {
        // Top Bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1F4E78))
                .padding(20.dp)
        ) {
            Column {
                Text(
                    "Welcome, ${authState.user?.name}! 👮",
                    style = MaterialTheme.typography.headlineSmall,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    "Badge #${authState.user?.badgeNumber}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Statistics Cards
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                "📊 Statistics",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Total Fines",
                    value = "${fineState.stats["totalFines"] ?: 0}",
                    icon = "📋",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Revenue",
                    value = "₹${(fineState.stats["totalAmount"] as? Number)?.toLong() ?: 0}",
                    icon = "💰",
                    modifier = Modifier.weight(1f)
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(
                    title = "Pending",
                    value = "${fineState.stats["pendingFines"] ?: 0}",
                    icon = "⏳",
                    modifier = Modifier.weight(1f)
                )
                StatCard(
                    title = "Paid",
                    value = "${fineState.stats["paidFines"] ?: 0}",
                    icon = "✅",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick Actions
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Text(
                "⚡ Quick Actions",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            ActionButton(
                title = "📝 Issue New Fine",
                description = "Create and record a new fine",
                onClick = onIssueFine,
                backgroundColor = Color(0xFF4CAF50)
            )

            Spacer(modifier = Modifier.height(12.dp))

            ActionButton(
                title = "📜 View Fine History",
                description = "Check all issued fines",
                onClick = onViewFines,
                backgroundColor = Color(0xFF2196F3)
            )

            Spacer(modifier = Modifier.height(12.dp))

            ActionButton(
                title = "👤 My Profile",
                description = "Edit profile information",
                onClick = onProfile,
                backgroundColor = Color(0xFF9C27B0)
            )

            Spacer(modifier = Modifier.height(12.dp))

            ActionButton(
                title = "🚪 Logout",
                description = "Sign out from your account",
                onClick = {
                    authViewModel.logout()
                    onLogout()
                },
                backgroundColor = Color(0xFFF44336)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .height(100.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, style = MaterialTheme.typography.displaySmall)
            Text(
                value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1F4E78)
            )
            Text(
                title,
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun ActionButton(
    title: String,
    description: String,
    onClick: () -> Unit,
    backgroundColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .height(70.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    title,
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    description,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.8f)
                )
            }
            Text("→", style = MaterialTheme.typography.headlineSmall, color = Color.White)
        }
    }
}