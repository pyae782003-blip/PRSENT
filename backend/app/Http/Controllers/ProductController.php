<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Product Controller
 *
 * Public: list and show products
 * Admin: create, update, delete products with Cloudinary images
 */
class ProductController extends Controller
{
    /**
     * List all products with optional filters
     */
    public function index(Request $request)
    {
        $query = DB::table('products')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name');

        // Search filter
        if ($request->has('search')) {
            $query->where('products.name', 'ilike', '%' . $request->search . '%');
        }

        // Category filter
        if ($request->has('category_id')) {
            $query->where('products.category_id', $request->category_id);
        }

        $products = $query->orderBy('products.created_at', 'desc')->get();

        // Attach images and format category
        $products = $products->map(function ($product) {
            $images = DB::table('product_images')
                ->where('product_id', $product->id)
                ->get();

            $product->images = $images;
            $product->category = (object) [
                'id' => $product->category_id,
                'name' => $product->category_name,
            ];
            unset($product->category_name);

            return $product;
        });

        return response()->json(['products' => $products]);
    }

    /**
     * Show single product with images
     */
    public function show($id)
    {
        $product = DB::table('products')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->where('products.id', $id)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->images = DB::table('product_images')
            ->where('product_id', $product->id)
            ->get();

        $product->category = (object) [
            'id' => $product->category_id,
            'name' => $product->category_name,
        ];
        unset($product->category_name);

        return response()->json(['product' => $product]);
    }

    /**
     * Create product (Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        $productId = DB::table('products')->insertGetId([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Save image URLs
        if ($request->has('images')) {
            foreach ($request->images as $url) {
                DB::table('product_images')->insert([
                    'product_id' => $productId,
                    'url' => $url,
                    'created_at' => now(),
                ]);
            }
        }

        $product = DB::table('products')->where('id', $productId)->first();

        return response()->json(['product' => $product], 201);
    }

    /**
     * Update product (Admin)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'category_id' => 'nullable|integer',
            'images' => 'nullable|array',
            'images.*' => 'string',
        ]);

        $product = DB::table('products')->where('id', $id)->first();
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Build update data explicitly — don't use array_filter which strips valid falsy values
        $updateData = ['updated_at' => now()];
        if ($request->has('name'))
            $updateData['name'] = $request->name;
        if ($request->has('description'))
            $updateData['description'] = $request->description;
        if ($request->has('price'))
            $updateData['price'] = $request->price;
        if ($request->has('stock'))
            $updateData['stock'] = $request->stock;
        if ($request->has('category_id'))
            $updateData['category_id'] = $request->category_id;

        DB::table('products')->where('id', $id)->update($updateData);

        // Replace images (delete old, insert new) when images array is provided
        if ($request->has('images')) {
            DB::table('product_images')->where('product_id', $id)->delete();
            foreach ($request->images as $url) {
                if (!empty($url)) {
                    DB::table('product_images')->insert([
                        'product_id' => $id,
                        'url' => $url,
                        'created_at' => now(),
                    ]);
                }
            }
        }

        $product = DB::table('products')->where('id', $id)->first();
        $product->images = DB::table('product_images')->where('product_id', $id)->get();

        return response()->json(['product' => $product]);
    }

    /**
     * Delete product (Admin)
     */
    public function destroy($id)
    {
        DB::table('products')->where('id', $id)->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
