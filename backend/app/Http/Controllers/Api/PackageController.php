<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::withCount('customers')->get();
        return response()->json($packages);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'speed' => 'required|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $package = Package::create($request->all());
        return response()->json($package, 201);
    }

    public function show(Package $package)
    {
        $package->load('customers');
        return response()->json($package);
    }

    public function update(Request $request, Package $package)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'price' => 'numeric|min:0',
            'speed' => 'string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $package->update($request->all());
        return response()->json($package);
    }

    public function destroy(Package $package)
    {
        // Check if package has customers
        if ($package->customers()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete package with active customers'
            ], 422);
        }

        $package->delete();
        return response()->json(null, 204);
    }
}