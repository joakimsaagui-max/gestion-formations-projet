<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\StatsController;

Route::apiResource('students', StudentController::class);
Route::apiResource('formations', FormationController::class);
Route::apiResource('inscriptions', InscriptionController::class);
Route::get('stats', [StatsController::class, 'index']);