<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Order Controller
 *
 * User: create orders, view own orders
 * Admin: view all orders, update status
 */
class OrderController extends Controller
{
    /**
     * List current user's orders
     */
    public function index(Request $request)
    {
        $orders = DB::table('orders')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                $order->items = DB::table('order_items')
                    ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
                    ->where('order_items.order_id', $order->id)
                    ->select('order_items.*', 'products.name as product_name')
                    ->get();
                return $order;
            });

        return response()->json(['orders' => $orders]);
    }

    /**
     * Show single order detail
     */
    public function show(Request $request, $id)
    {
        $order = DB::table('orders')
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Attach items
        $order->items = DB::table('order_items')
            ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
            ->where('order_items.order_id', $order->id)
            ->select('order_items.*', 'products.name as product_name')
            ->get()
            ->map(function ($item) {
                $item->product = (object) ['name' => $item->product_name];
                return $item;
            });

        // Attach payment
        $order->payment = DB::table('payments')
            ->where('order_id', $order->id)
            ->first();

        return response()->json(['order' => $order]);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'total' => 'required|numeric',
        ]);

        // Create order
        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $request->user()->id,
            'total' => $request->total,
            'status' => 'awaiting_payment',
            'shipping_address' => $request->shipping_address,
            'phone' => $request->phone,
            'notes' => $request->notes,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create order items & reduce stock
        foreach ($request->items as $item) {
            DB::table('order_items')->insert([
                'order_id' => $orderId,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);

            // Reduce product stock
            DB::table('products')
                ->where('id', $item['product_id'])
                ->decrement('stock', $item['quantity']);
        }

        $order = DB::table('orders')->where('id', $orderId)->first();

        return response()->json(['order' => $order], 201);
    }

    /**
     * Admin: List all orders
     */
    public function adminIndex(Request $request)
    {
        $query = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.name as user_name', 'users.email as user_email');

        // Filter by status
        if ($request->has('status')) {
            $query->where('orders.status', $request->status);
        }

        $orders = $query->orderBy('orders.created_at', 'desc')->get()
            ->map(function ($order) {
                $order->user = (object) [
                    'name' => $order->user_name,
                    'email' => $order->user_email,
                ];
                $order->items = DB::table('order_items')
                    ->leftJoin('products', 'order_items.product_id', '=', 'products.id')
                    ->where('order_items.order_id', $order->id)
                    ->select('order_items.*', 'products.name as product_name')
                    ->get()
                    ->map(function ($item) {
                        $item->product = (object) ['name' => $item->product_name];
                        return $item;
                    });
                $order->payment = DB::table('payments')->where('order_id', $order->id)->first();
                unset($order->user_name, $order->user_email);
                return $order;
            });

        return response()->json(['orders' => $orders]);
    }

    /**
     * Admin: Update order status
     */
    public function adminUpdate(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,awaiting_payment,payment_review,confirmed,processing,shipped,delivered,cancelled',
        ]);

        DB::table('orders')->where('id', $id)->update([
            'status' => $request->status,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Order updated']);
    }

    /**
     * Admin: Delete order and related data
     */
    public function adminDestroy($id)
    {
        $order = DB::table('orders')->where('id', $id)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Delete related data first
        DB::table('order_items')->where('order_id', $id)->delete();
        DB::table('payments')->where('order_id', $id)->delete();
        DB::table('orders')->where('id', $id)->delete();

        return response()->json(['message' => 'Order deleted']);
    }
}
