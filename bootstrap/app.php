<?php

use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'check.auth' => \App\Http\Middleware\CheckAuthMiddleware::class,
            'handle.inertia' => \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // Ensure CSRF and session middleware are applied to web routes
        $middleware->web(\Illuminate\Session\Middleware\StartSession::class);
        $middleware->web(\Illuminate\View\Middleware\ShareErrorsFromSession::class);
        $middleware->web(\App\Http\Middleware\VerifyCsrfToken::class);
        $middleware->web(\Illuminate\Session\Middleware\AuthenticateSession::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();