<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Favorite Controller
 *
 * Manages user's favorite/wishlist products.
 */
class FavoriteController extends Controller
{
    /**
     * List current user's favorites
     */
    public function index(Request $request)
    {
        $favorites = DB::table('favorites')
            ->leftJoin('products', 'favorites.product_id', '=', 'products.id')
            ->where('favorites.user_id', $request->user()->id)
            ->select('favorites.*', 'products.name', 'products.price', 'products.description')
            ->orderBy('favorites.created_at', 'desc')
            ->get()
            ->map(function ($fav) {
                $images = DB::table('product_images')
                    ->where('product_id', $fav->product_id)
                    ->get();
                $fav->product = (object) [
                    'id' => $fav->product_id,
                    'name' => $fav->name,
                    'price' => $fav->price,
                    'description' => $fav->description,
                    'images' => $images,
                ];
                return $fav;
            });

        return response()->json(['favorites' => $favorites]);
    }

    /**
     * Add product to favorites
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        // Check if already favorited
        $exists = DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already in favorites'], 200);
        }

        DB::table('favorites')->insert([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Added to favorites'], 201);
    }

    /**
     * Remove from favorites
     */
    public function destroy(Request $request, $id)
    {
        DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('product_id', $id);
            })
            ->delete();

        return response()->json(['message' => 'Removed from favorites']);
    }
}
