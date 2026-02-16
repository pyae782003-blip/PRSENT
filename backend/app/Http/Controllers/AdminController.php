<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Admin Controller
 *
 * Dashboard stats and user management
 */
class AdminController extends Controller
{
    /**
     * Dashboard statistics
     */
    public function stats()
    {
        $totalOrders = DB::table('orders')->count();
        $totalRevenue = DB::table('orders')
            ->whereIn('status', ['confirmed', 'processing', 'shipped', 'delivered'])
            ->sum('total');
        $totalProducts = DB::table('products')->count();
        $totalUsers = DB::table('users')->where('role', 'user')->count();
        $pendingPayments = DB::table('payments')->where('status', 'pending')->count();

        $recentOrders = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as user_name')
            ->orderBy('orders.created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                $order->user = (object) ['name' => $order->user_name];
                unset($order->user_name);
                return $order;
            });

        return response()->json([
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'total_products' => $totalProducts,
            'total_users' => $totalUsers,
            'pending_payments' => $pendingPayments,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * List all users
     */
    public function users()
    {
        $users = DB::table('users')
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['users' => $users]);
    }

    /**
     * Update user role
     */
    public function updateUser(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        DB::table('users')->where('id', $id)->update([
            'role' => $request->role,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'User updated']);
    }

    /**
     * Delete user and related data
     */
    public function deleteUser($id)
    {
        $user = DB::table('users')->where('id', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Don't allow deleting yourself
        if ($id == auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        // Delete related data
        DB::table('favorites')->where('user_id', $id)->delete();
        $orderIds = DB::table('orders')->where('user_id', $id)->pluck('id');
        if ($orderIds->count()) {
            DB::table('order_items')->whereIn('order_id', $orderIds)->delete();
            DB::table('payments')->whereIn('order_id', $orderIds)->delete();
        }
        DB::table('orders')->where('user_id', $id)->delete();
        DB::table('personal_access_tokens')->where('tokenable_id', $id)->delete();
        DB::table('users')->where('id', $id)->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
