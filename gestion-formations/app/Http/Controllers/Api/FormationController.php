<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        $query = Formation::withCount('inscriptions');

        if ($request->filled('q')) {
            $query->where('titre', 'like', '%' . $request->q . '%');
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree' => 'required|integer|min:1',
            'prix' => 'required|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        return response()->json(Formation::create($data), 201);
    }

    public function show(Formation $formation)
    {
        return $formation->load('students');
    }

    public function update(Request $request, Formation $formation)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duree' => 'required|integer|min:1',
            'prix' => 'required|numeric|min:0',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        $formation->update($data);
        return $formation;
    }

    public function destroy(Formation $formation)
    {
        $formation->delete();
        return response()->json(null, 204);
    }
}