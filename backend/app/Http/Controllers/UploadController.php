<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Upload Controller
 *
 * General-purpose image upload using local storage.
 * Used for product images and other uploads.
 */
class UploadController extends Controller
{
    /**
     * Upload an image to local storage
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:10240', // Max 10MB
        ]);

        $path = $request->file('image')->store('uploads/products', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'url' => $url,
            'path' => $path,
        ]);
    }
}
