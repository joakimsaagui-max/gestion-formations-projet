<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    protected $fillable = ['nom', 'prenom', 'email', 'telephone', 'date_naissance', 'adresse'];

    public function inscriptions(): HasMany
    {
        return $this->hasMany(Inscription::class);
    }

    public function formations(): BelongsToMany
    {
        return $this->belongsToMany(Formation::class, 'inscriptions')
                    ->withPivot('date_inscription', 'statut')
                    ->withTimestamps();
    }
}