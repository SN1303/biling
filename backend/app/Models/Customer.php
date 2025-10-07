<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'address',
        'phone_number',
        'package_id',
        'subscription_status',
        'pppoe_username',
        'pppoe_password',
        'installation_date',
        'next_due_date',
    ];

    protected $casts = [
        'installation_date' => 'date',
        'next_due_date' => 'date',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function notes()
    {
        return $this->hasMany(CustomerNote::class);
    }

    public function isActive()
    {
        return $this->subscription_status === 'active';
    }

    public function latestPayment()
    {
        return $this->payments()->latest()->first();
    }
}