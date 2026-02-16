<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'url', 'public_id'];
    public $timestamps = false; // Only created_at in migration, or remove line if timestamps()

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
