<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Formation;
use App\Models\Inscription;

class StatsController extends Controller
{
    public function index()
    {
        return [
            'total_students' => Student::count(),
            'total_formations' => Formation::count(),
            'total_inscriptions' => Inscription::count(),
            'inscriptions_par_statut' => Inscription::selectRaw('statut, count(*) as total')
                ->groupBy('statut')
                ->pluck('total', 'statut'),
            'top_formations' => Formation::withCount('inscriptions')
                ->orderByDesc('inscriptions_count')
                ->take(5)
                ->get(),
        ];
    }
}