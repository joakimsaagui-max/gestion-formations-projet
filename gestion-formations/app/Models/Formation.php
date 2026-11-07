<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Formation extends Model
{
    protected $fillable = ['titre', 'description', 'duree', 'prix', 'date_debut', 'date_fin'];

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'inscriptions')
                    ->withPivot('date_inscription', 'statut')
                    ->withTimestamps();
    }
}