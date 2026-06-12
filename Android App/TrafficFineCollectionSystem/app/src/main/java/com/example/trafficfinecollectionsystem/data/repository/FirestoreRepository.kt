package com.example.trafficfinecollectionsystem.data.repository

import com.example.trafficfinecollectionsystem.data.models.Fine
import com.example.trafficfinecollectionsystem.data.models.Officer
import com.example.trafficfinecollectionsystem.utils.FirebaseUtils
import com.google.firebase.firestore.Query
import kotlinx.coroutines.tasks.await

class FirestoreRepository {
    private val firestore = FirebaseUtils.getFirestore()

    // OFFICER OPERATIONS
    suspend fun createOfficerProfile(officer: Officer): Result<Unit> = try {
        firestore.collection("officers").document(officer.uid).set(officer).await()
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getOfficerProfile(uid: String): Result<Officer?> = try {
        val doc = firestore.collection("officers").document(uid).get().await()
        val officer = doc.toObject(Officer::class.java)
        Result.success(officer)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun updateOfficerProfile(officer: Officer): Result<Unit> = try {
        firestore.collection("officers").document(officer.uid).update(
            "name", officer.name,
            "phone", officer.phone,
            "station", officer.station,
            "photoUrl", officer.photoUrl
        ).await()
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    // FINE OPERATIONS
    suspend fun issueFine(fine: Fine): Result<String> = try {
        val docRef = firestore.collection("fines").add(fine).await()
        Result.success(docRef.id)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getFinesIssuedByOfficer(officerId: String): Result<List<Fine>> = try {
        val fines = firestore.collection("fines")
            .whereEqualTo("officerId", officerId)
            .orderBy("fineDate", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(Fine::class.java)
        Result.success(fines)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getAllFines(): Result<List<Fine>> = try {
        val fines = firestore.collection("fines")
            .orderBy("fineDate", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(Fine::class.java)
        Result.success(fines)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun getFineById(fineId: String): Result<Fine?> = try {
        val doc = firestore.collection("fines").document(fineId).get().await()
        val fine = doc.toObject(Fine::class.java)
        Result.success(fine)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun updateFineStatus(fineId: String, status: String): Result<Unit> = try {
        firestore.collection("fines").document(fineId).update("paymentStatus", status).await()
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun deleteFine(fineId: String): Result<Unit> = try {
        firestore.collection("fines").document(fineId).delete().await()
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    // STATISTICS
    suspend fun getOfficerStatistics(officerId: String): Result<Map<String, Any>> = try {
        val fines = firestore.collection("fines")
            .whereEqualTo("officerId", officerId)
            .get()
            .await()
            .toObjects(Fine::class.java)

        val totalFines = fines.size
        val totalAmount = fines.sumOf { it.fineAmount }
        val paidFines = fines.count { it.paymentStatus == "paid" }
        val pendingFines = fines.count { it.paymentStatus == "pending" }

        val stats = mapOf(
            "totalFines" to totalFines,
            "totalAmount" to totalAmount,
            "paidFines" to paidFines,
            "pendingFines" to pendingFines
        )
        Result.success(stats)
    } catch (e: Exception) {
        Result.failure(e)
    }
}
