<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\CustomerNoteController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::apiResource('packages', PackageController::class);
    });

    // Admin and Teknisi routes
    Route::middleware('role:admin,teknisi')->group(function () {
        // Customers
        Route::get('/customers/dashboard', [CustomerController::class, 'dashboard']);
        Route::apiResource('customers', CustomerController::class);
        
        // Payments
        Route::get('/payments/monthly-report', [PaymentController::class, 'monthlyReport']);
        Route::apiResource('payments', PaymentController::class);
        
        // Customer Notes
        Route::apiResource('customer-notes', CustomerNoteController::class);
    });
});