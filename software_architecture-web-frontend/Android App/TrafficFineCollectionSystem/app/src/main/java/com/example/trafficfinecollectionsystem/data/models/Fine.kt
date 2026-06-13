package com.example.trafficfinecollectionsystem.data.models

data class Fine(
    val fineId: String = "",
    val officerId: String = "",
    val officerName: String = "",
    val driverNic: String = "",
    val driverName: String = "",
    val driverPhone: String = "",
    val licenseNumber: String = "",
    val vehicleNumber: String = "",
    val vehicleModel: String = "",
    val violationCategory: String = "",
    val violationDescription: String = "",
    val fineAmount: Double = 0.0,
    val location: String = "",
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val fineDate: Long = System.currentTimeMillis(),
    val paymentStatus: String = "pending", // pending, paid, disputed
    val photoUrl: String = "",
    val notes: String = ""
)
