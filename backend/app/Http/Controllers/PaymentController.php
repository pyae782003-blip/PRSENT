<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Cloudinary\Cloudinary;

/**
 * Payment Controller
 *
 * User: Upload payment slip
 * Admin: Approve/reject payment
 */
class PaymentController extends Controller
{
    private function cloudinary(): Cloudinary
    {
        return new Cloudinary(env('CLOUDINARY_URL'));
    }

    /**
     * Upload payment slip for an order
     */
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer|exists:orders,id',
            'payment_slip' => 'required|image|mimes:jpg,jpeg,png,webp|max:10240', // Max 10MB
        ]);

        // Verify order belongs to user
        $order = DB::table('orders')
            ->where('id', $request->order_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Upload to Cloudinary
        $result = $this->cloudinary()->uploadApi()->upload(
            $request->file('payment_slip')->getRealPath(),
            ['folder' => 'myanmar_presents/payments']
        );

        $slipUrl = $result['secure_url'];
        $publicId = $result['public_id'];

        // Create or update payment record
        $existingPayment = DB::table('payments')->where('order_id', $request->order_id)->first();

        if ($existingPayment) {
            // Delete old image from Cloudinary
            if ($existingPayment->public_id ?? null) {
                try {
                    $this->cloudinary()->uploadApi()->destroy($existingPayment->public_id);
                } catch (\Exception $e) {
                    // Ignore deletion errors
                }
            }
            DB::table('payments')->where('id', $existingPayment->id)->update([
                'slip_url' => $slipUrl,
                'public_id' => $publicId,
                'status' => 'pending',
                'updated_at' => now(),
            ]);
        } else {
            DB::table('payments')->insert([
                'order_id' => $request->order_id,
                'user_id' => $request->user()->id,
                'slip_url' => $slipUrl,
                'public_id' => $publicId,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Update order status
        DB::table('orders')->where('id', $request->order_id)->update([
            'status' => 'payment_review',
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Payment slip uploaded', 'url' => $slipUrl]);
    }

    /**
     * Admin: List all payments
     */
    public function adminIndex()
    {
        $payments = DB::table('payments')
            ->leftJoin('orders', 'payments.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select('payments.*', 'orders.total as order_total', 'orders.user_id', 'users.name as user_name', 'users.email as user_email')
            ->orderBy('payments.created_at', 'desc')
            ->get()
            ->map(function ($p) {
                $p->order = (object) [
                    'id' => $p->order_id,
                    'total' => $p->order_total,
                    'user' => (object) [
                        'name' => $p->user_name,
                        'email' => $p->user_email,
                    ],
                ];
                $p->amount = $p->order_total;
                unset($p->order_total, $p->user_name, $p->user_email, $p->user_id);
                return $p;
            });

        return response()->json($payments);
    }

    /**
     * Admin: Approve or reject a payment
     */
    public function review(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $payment = DB::table('payments')->where('id', $id)->first();

        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        DB::table('payments')->where('id', $id)->update([
            'status' => $request->status,
            'reviewed_at' => now(),
            'updated_at' => now(),
        ]);

        // Update order status based on payment decision
        $newOrderStatus = $request->status === 'approved' ? 'confirmed' : 'awaiting_payment';
        DB::table('orders')->where('id', $payment->order_id)->update([
            'status' => $newOrderStatus,
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Payment ' . $request->status]);
    }
}
