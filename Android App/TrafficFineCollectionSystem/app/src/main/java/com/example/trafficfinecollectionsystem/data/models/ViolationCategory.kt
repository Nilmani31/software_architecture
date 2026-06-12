package com.example.trafficfinecollectionsystem.data.models

data class ViolationCategory(
    val categoryId: String = "",
    val name: String = "",
    val description: String = "",
    val fineAmount: Double = 0.0,
    val severity: String = "" // low, medium, high, critical
)

val defaultViolationCategories = listOf(
    ViolationCategory("1", "Speeding", "Driving above speed limit", 500.0, "medium"),
    ViolationCategory("2", "No Helmet", "Motorcycle rider without helmet", 300.0, "high"),
    ViolationCategory("3", "No Seat Belt", "Not wearing seat belt", 400.0, "high"),
    ViolationCategory("4", "Red Light Jump", "Crossing on red signal", 600.0, "high"),
    ViolationCategory("5", "Wrong Parking", "Illegal parking", 200.0, "low"),
    ViolationCategory("6", "Expired License", "Driving with expired license", 1000.0, "critical"),
    ViolationCategory("7", "No Documents", "Missing vehicle documents", 800.0, "critical"),
    ViolationCategory("8", "Mobile Phone", "Using phone while driving", 350.0, "medium")
)
