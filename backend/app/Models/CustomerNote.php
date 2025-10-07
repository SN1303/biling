<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerNote extends Model
{
    protected $fillable = [
        'customer_id',
        'user_id',
        'note',
        'is_technical',
        'is_sent_notification',
    ];

    protected $casts = [
        'is_technical' => 'boolean',
        'is_sent_notification' => 'boolean',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}