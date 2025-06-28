<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Auth; // <-- Import Auth


return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
    

    // ▼▼▼ TAMBAHKAN ALIAS INI ▼▼▼
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
    })
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectUsersTo('/admin/produk');
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
    
