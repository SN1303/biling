<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'customer_id',
        'amount',
        'payment_date',
        'period_start',
        'period_end',
        'status',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'period_start' => 'date',
        'period_end' => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function isPaid()
    {
        return $this->status === 'paid';
    }

    public function isPartial()
    {
        return $this->status === 'partial';
    }
}