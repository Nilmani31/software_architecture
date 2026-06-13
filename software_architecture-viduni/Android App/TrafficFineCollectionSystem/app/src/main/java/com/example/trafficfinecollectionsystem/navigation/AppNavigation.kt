package com.example.trafficfinecollectionsystem.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.trafficfinecollectionsystem.screens.*

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.LoginScreen.route) {
        composable(Screen.LoginScreen.route) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Screen.DashboardScreen.route) {
                        popUpTo(Screen.LoginScreen.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.SignupScreen.route) {
            SignupScreen(
                onSignupSuccess = {
                    navController.navigate(Screen.DashboardScreen.route) {
                        popUpTo(Screen.SignupScreen.route) { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.popBackStack(Screen.LoginScreen.route, false)
                }
            )
        }

        composable(Screen.DashboardScreen.route) {
            DashboardScreen(
                onIssueFine = {
                    navController.navigate(Screen.IssueFineScreen.route)
                },
                onViewFines = {
                    navController.navigate(Screen.FinesHistoryScreen.route)
                },
                onProfile = {
                    navController.navigate(Screen.OfficerProfileScreen.route)
                },
                onLogout = {
                    navController.navigate(Screen.LoginScreen.route) {
                        popUpTo(Screen.DashboardScreen.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.IssueFineScreen.route) {
            IssueFineScreen(
                onSubmit = {
                    navController.navigate(Screen.FineSuccessScreen.route) {
                        popUpTo(Screen.IssueFineScreen.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.FineSuccessScreen.route) {
            FineSuccessScreen(
                onBack = {
                    navController.navigate(Screen.DashboardScreen.route) {
                        popUpTo(Screen.FineSuccessScreen.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.FinesHistoryScreen.route) {
            FinesHistoryScreen(
                onBackClick = {
                    navController.popBackStack()
                }
            )
        }

        composable(Screen.OfficerProfileScreen.route) {
            OfficerProfileScreen(
                onBackClick = {
                    navController.popBackStack()
                }
            )
        }
    }
}
