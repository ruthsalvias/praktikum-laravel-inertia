<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {
    // Auth Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');

        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');

        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    Route::group(['middleware' => 'check.auth'], function () {
        Route::get('/', [HomeController::class, 'home'])->name('home');

        // Todo Routes
        Route::group(['prefix' => 'todos'], function () {
            Route::get('/', [TodoController::class, 'index'])->name('todos.index');
            Route::post('/', [TodoController::class, 'store'])->name('todos.store');
            Route::put('/{todo}', [TodoController::class, 'update'])->name('todos.update');
            Route::delete('/{todo}', [TodoController::class, 'destroy'])->name('todos.destroy');
            Route::put('/{todo}/toggle', [TodoController::class, 'toggle'])->name('todos.toggle');
        });
    });
});