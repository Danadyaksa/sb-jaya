<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['user_id', 'customer_name', 'total_amount'];

public function items()
{
    return $this->hasMany(ReportItem::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}
}
