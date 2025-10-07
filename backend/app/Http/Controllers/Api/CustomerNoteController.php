<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerNoteController extends Controller
{
    public function index(Request $request)
    {
        $query = CustomerNote::with(['user', 'customer']);
        
        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('is_technical')) {
            $query->where('is_technical', $request->boolean('is_technical'));
        }

        $notes = $query->latest()->get();
        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'note' => 'required|string',
            'is_technical' => 'boolean',
            'is_sent_notification' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note = new CustomerNote($request->all());
        $note->user_id = auth()->id();
        $note->save();

        if ($note->is_sent_notification) {
            // Integrate with MPWA API here
            // $this->sendMpwaNotification($note);
        }

        return response()->json($note, 201);
    }

    public function show(CustomerNote $note)
    {
        $note->load(['user', 'customer']);
        return response()->json($note);
    }

    public function update(Request $request, CustomerNote $note)
    {
        $validator = Validator::make($request->all(), [
            'note' => 'string',
            'is_technical' => 'boolean',
            'is_sent_notification' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note->update($request->all());
        return response()->json($note);
    }

    public function destroy(CustomerNote $note)
    {
        $note->delete();
        return response()->json(null, 204);
    }
}