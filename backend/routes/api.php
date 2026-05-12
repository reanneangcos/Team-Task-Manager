<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(),
            'avatar_url' => $user->avatar_url,
        ]);
    });

    Route::get('/profile/{id}', [ProfileController::class, 'show']);
    Route::patch('/profile/{id}', [ProfileController::class, 'update']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [TaskController::class, 'employees']);
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::patch('/tasks/{id}', [TaskController::class, 'update']);
    });

    Route::middleware('role:employee|admin')->group(function () {
        Route::get('/my-tasks/{userId}', [TaskController::class, 'myTasks']);
        Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);
    });
});
