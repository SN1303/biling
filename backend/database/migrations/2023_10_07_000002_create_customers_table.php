<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->string('phone_number');
            $table->foreignId('package_id')->constrained('packages');
            $table->enum('subscription_status', ['active', 'inactive', 'suspended']);
            $table->string('pppoe_username')->unique();
            $table->string('pppoe_password');
            $table->date('installation_date');
            $table->date('next_due_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};