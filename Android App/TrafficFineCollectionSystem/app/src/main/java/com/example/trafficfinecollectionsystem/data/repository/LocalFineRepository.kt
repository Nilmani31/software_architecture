package com.example.trafficfinecollectionsystem.data.repository

import android.content.Context
import com.example.trafficfinecollectionsystem.data.models.Fine
import org.json.JSONArray
import org.json.JSONObject

class LocalFineRepository(context: Context) {
    private val sharedPreferences = context.applicationContext.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE)

    fun saveFine(fine: Fine): Result<String> {
        return try {
            val fineId = fine.fineId.ifBlank { "fine_${System.currentTimeMillis()}" }
            val storedFine = JSONObject().apply {
                put("fineId", fineId)
                put("officerId", fine.officerId)
                put("officerName", fine.officerName)
                put("driverNic", fine.driverNic)
                put("driverName", fine.driverName)
                put("driverPhone", fine.driverPhone)
                put("licenseNumber", fine.licenseNumber)
                put("vehicleNumber", fine.vehicleNumber)
                put("vehicleModel", fine.vehicleModel)
                put("violationCategory", fine.violationCategory)
                put("violationDescription", fine.violationDescription)
                put("fineAmount", fine.fineAmount)
                put("location", fine.location)
                put("latitude", fine.latitude)
                put("longitude", fine.longitude)
                put("fineDate", fine.fineDate)
                put("paymentStatus", fine.paymentStatus)
                put("photoUrl", fine.photoUrl)
                put("notes", fine.notes)
            }

            val fines = readAllStoredFines().toMutableList()
            fines.removeAll { it.fineId == fineId }
            fines.add(fine.copy(fineId = fineId))
            sharedPreferences.edit().putString(KEY_FINES, JSONArray(fines.map { it.toJson() }).toString()).apply()
            Result.success(fineId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getFinesByOfficer(officerId: String): Result<List<Fine>> {
        return try {
            Result.success(readAllStoredFines().filter { it.officerId == officerId })
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getStatistics(officerId: String): Result<Map<String, Any>> {
        return try {
            val fines = readAllStoredFines().filter { it.officerId == officerId }
            val totalFines = fines.size
            val totalAmount = fines.sumOf { it.fineAmount }
            val paidFines = fines.count { it.paymentStatus == "paid" }
            val pendingFines = fines.count { it.paymentStatus == "pending" }
            Result.success(
                mapOf(
                    "totalFines" to totalFines,
                    "totalAmount" to totalAmount,
                    "paidFines" to paidFines,
                    "pendingFines" to pendingFines
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun updateStatus(fineId: String, status: String): Result<Unit> {
        return try {
            val fines = readAllStoredFines().map {
                if (it.fineId == fineId) it.copy(paymentStatus = status) else it
            }
            sharedPreferences.edit().putString(KEY_FINES, JSONArray(fines.map { it.toJson() }).toString()).apply()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun readAllStoredFines(): List<Fine> {
        val raw = sharedPreferences.getString(KEY_FINES, null) ?: return emptyList()
        val array = JSONArray(raw)
        val fines = mutableListOf<Fine>()
        for (index in 0 until array.length()) {
            fines.add(array.getJSONObject(index).toFine())
        }
        return fines
    }

    private fun Fine.toJson(): JSONObject {
        return JSONObject().apply {
            put("fineId", fineId)
            put("officerId", officerId)
            put("officerName", officerName)
            put("driverNic", driverNic)
            put("driverName", driverName)
            put("driverPhone", driverPhone)
            put("licenseNumber", licenseNumber)
            put("vehicleNumber", vehicleNumber)
            put("vehicleModel", vehicleModel)
            put("violationCategory", violationCategory)
            put("violationDescription", violationDescription)
            put("fineAmount", fineAmount)
            put("location", location)
            put("latitude", latitude)
            put("longitude", longitude)
            put("fineDate", fineDate)
            put("paymentStatus", paymentStatus)
            put("photoUrl", photoUrl)
            put("notes", notes)
        }
    }

    private fun JSONObject.toFine(): Fine {
        return Fine(
            fineId = optString("fineId"),
            officerId = optString("officerId"),
            officerName = optString("officerName"),
            driverNic = optString("driverNic"),
            driverName = optString("driverName"),
            driverPhone = optString("driverPhone"),
            licenseNumber = optString("licenseNumber"),
            vehicleNumber = optString("vehicleNumber"),
            vehicleModel = optString("vehicleModel"),
            violationCategory = optString("violationCategory"),
            violationDescription = optString("violationDescription"),
            fineAmount = optDouble("fineAmount"),
            location = optString("location"),
            latitude = optDouble("latitude"),
            longitude = optDouble("longitude"),
            fineDate = optLong("fineDate"),
            paymentStatus = optString("paymentStatus", "pending"),
            photoUrl = optString("photoUrl"),
            notes = optString("notes")
        )
    }

    companion object {
        private const val FILE_NAME = "local_fine_store"
        private const val KEY_FINES = "fines_json"
    }
}
