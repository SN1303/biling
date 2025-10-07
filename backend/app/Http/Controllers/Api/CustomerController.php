<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with(['package', 'latestPayment'])->get();
        return response()->json($customers);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:20',
            'package_id' => 'required|exists:packages,id',
            'pppoe_username' => 'required|string|unique:customers',
            'pppoe_password' => 'required|string',
            'installation_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    public function show(Customer $customer)
    {
        $customer->load(['package', 'payments', 'notes.user']);
        return response()->json($customer);
    }

    public function update(Request $request, Customer $customer)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'address' => 'string',
            'phone_number' => 'string|max:20',
            'package_id' => 'exists:packages,id',
            'subscription_status' => 'in:active,inactive,suspended',
            'pppoe_username' => 'string|unique:customers,pppoe_username,' . $customer->id,
            'pppoe_password' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer->update($request->all());
        return response()->json($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }

    public function dashboard()
    {
        $stats = [
            'total_active' => Customer::where('subscription_status', 'active')->count(),
            'total_inactive' => Customer::where('subscription_status', 'inactive')->count(),
            'total_suspended' => Customer::where('subscription_status', 'suspended')->count(),
            'payments_this_month' => Payment::whereMonth('payment_date', now()->month)
                                         ->whereYear('payment_date', now()->year)
                                         ->sum('amount'),
            'unpaid_customers' => Customer::whereHas('payments', function($q) {
                $q->where('status', 'unpaid');
            })->count(),
        ];

        return response()->json($stats);
    }
}