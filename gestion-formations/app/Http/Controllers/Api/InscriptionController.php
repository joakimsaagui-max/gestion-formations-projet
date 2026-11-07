<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InscriptionController extends Controller
{
    public function index()
    {
        return Inscription::with(['student', 'formation'])->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|exists:students,id',
            'formation_id' => [
                'required',
                'exists:formations,id',
                Rule::unique('inscriptions')->where('student_id', $request->student_id),
            ],
            'date_inscription' => 'required|date',
            'statut' => 'nullable|in:en_cours,validee,annulee',
        ]);

        $inscription = Inscription::create($data);
        return response()->json($inscription->load(['student', 'formation']), 201);
    }

    public function show(Inscription $inscription)
    {
        return $inscription->load(['student', 'formation']);
    }

    public function update(Request $request, Inscription $inscription)
    {
        $data = $request->validate([
            'date_inscription' => 'sometimes|date',
            'statut' => 'sometimes|in:en_cours,validee,annulee',
        ]);

        $inscription->update($data);
        return $inscription->load(['student', 'formation']);
    }

    public function destroy(Inscription $inscription)
    {
        $inscription->delete();
        return response()->json(null, 204);
    }
}
