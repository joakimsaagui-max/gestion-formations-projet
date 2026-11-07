<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inscription extends Model
{
    protected $fillable = ['student_id', 'formation_id', 'date_inscription', 'statut'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }
}