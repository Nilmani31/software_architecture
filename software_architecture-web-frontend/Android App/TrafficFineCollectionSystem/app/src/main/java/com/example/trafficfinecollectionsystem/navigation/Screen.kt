package com.example.trafficfinecollectionsystem.navigation

sealed class Screen(val route: String) {
    object SplashScreen : Screen("splash")
    object LoginScreen : Screen("login")
    object SignupScreen : Screen("signup")
    object DashboardScreen : Screen("dashboard")
    object IssueFineScreen : Screen("issue_fine")
    object FineSuccessScreen : Screen("fine_success")
    object FinesHistoryScreen : Screen("fines_history")
    object OfficerProfileScreen : Screen("officer_profile")
}
