<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();

    $request->session()->regenerate();

    // ▼▼▼ LOGIKA BARU KITA MULAI DARI SINI ▼▼▼

    // Cek role user yang baru saja login
    $user = $request->user();
$url = '/'; // Default untuk customer

if ($user->role === 'kasir') {
    $url = route('admin.products.index');
} elseif ($user->role === 'gudang') {
    $url = route('admin.stock.index');
}

return redirect()->intended($url);


    // ▲▲▲ SAMPAI SINI ▲▲▲
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
