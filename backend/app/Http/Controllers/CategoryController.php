<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Category Controller
 *
 * Public: list categories
 * Admin: create, update, delete categories
 */
class CategoryController extends Controller
{
    /**
     * List all categories with product count
     */
    public function index()
    {
        $categories = DB::table('categories')
            ->select('categories.*')
            ->orderBy('name')
            ->get()
            ->map(function ($cat) {
                $cat->_count = (object) [
                    'products' => DB::table('products')->where('category_id', $cat->id)->count(),
                ];
                return $cat;
            });

        return response()->json(['categories' => $categories]);
    }

    /**
     * Create category (Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $id = DB::table('categories')->insertGetId([
            'name' => $request->name,
            'description' => $request->description,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $category = DB::table('categories')->where('id', $id)->first();

        return response()->json(['category' => $category], 201);
    }

    /**
     * Update category (Admin)
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = DB::table('categories')->where('id', $id)->first();
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $updateData = ['updated_at' => now()];
        if ($request->has('name'))
            $updateData['name'] = $request->name;
        if ($request->has('description'))
            $updateData['description'] = $request->description;

        DB::table('categories')->where('id', $id)->update($updateData);

        $category = DB::table('categories')->where('id', $id)->first();

        return response()->json(['category' => $category]);
    }

    /**
     * Delete category (Admin)
     */
    public function destroy($id)
    {
        DB::table('categories')->where('id', $id)->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
