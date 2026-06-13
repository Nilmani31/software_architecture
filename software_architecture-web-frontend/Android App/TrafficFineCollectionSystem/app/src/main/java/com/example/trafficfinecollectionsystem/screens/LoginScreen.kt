package com.example.trafficfinecollectionsystem.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.trafficfinecollectionsystem.viewmodel.AuthViewModel

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit,
    viewModel: AuthViewModel = viewModel()
) {
    val authState by viewModel.authState.collectAsState()
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }

    LaunchedEffect(authState.isLoggedIn) {
        if (authState.isLoggedIn) {
            onLoginSuccess()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF1F4E78), Color(0xFF2E5C9E))
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Text(
                "🚔 Traffic Fine System",
                style = MaterialTheme.typography.headlineMedium,
                color = Color.White,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Text(
                "Officer Login",
                style = MaterialTheme.typography.headlineSmall,
                color = Color.White.copy(alpha = 0.8f),
                modifier = Modifier.padding(bottom = 32.dp)
            )

            // Email Field
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email Address") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color.White.copy(alpha = 0.5f),
                    unfocusedTextColor = Color.White,
                    unfocusedLabelColor = Color.White.copy(alpha = 0.7f)
                ),
                textStyle = MaterialTheme.typography.bodyLarge.copy(color = Color.White)
            )

            // Password Field
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp),
                visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { showPassword = !showPassword }) {
                        Text(if (showPassword) "🙈" else "👁️")
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color.White.copy(alpha = 0.5f),
                    unfocusedTextColor = Color.White,
                    unfocusedLabelColor = Color.White.copy(alpha = 0.7f)
                ),
                textStyle = MaterialTheme.typography.bodyLarge.copy(color = Color.White)
            )

            // Error Message
            if (authState.error != null) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFB00020))
                ) {
                    Text(
                        authState.error ?: "",
                        color = Color.White,
                        modifier = Modifier.padding(12.dp),
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }

            // Login Button
            Button(
                onClick = { viewModel.login(email, password) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 16.dp)
                    .height(50.dp),
                enabled = !authState.isLoading,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50))
            ) {
                if (authState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("LOGIN", style = MaterialTheme.typography.labelLarge)
                }
            }

            // Demo Credentials
            Text(
                "Demo: test@example.com / 123456",
                color = Color.White.copy(alpha = 0.6f),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(top = 24.dp)
            )
        }
    }
}