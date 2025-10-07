<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        
        $package = Package::create([
            'name' => 'Test Package',
            'price' => 150000,
            'speed' => '10 Mbps',
        ]);

        $this->customer = Customer::create([
            'name' => 'Test Customer',
            'address' => 'Test Address',
            'phone_number' => '08123456789',
            'package_id' => $package->id,
            'subscription_status' => 'active',
            'pppoe_username' => 'testuser',
            'pppoe_password' => 'testpass',
            'installation_date' => '2025-10-07',
            'next_due_date' => '2025-11-07',
        ]);
    }

    public function test_can_create_payment()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'customer_id' => $this->customer->id,
            'amount' => 150000,
            'payment_date' => '2025-10-07',
            'period_start' => '2025-10-01',
            'period_end' => '2025-10-31',
            'status' => 'paid',
            'notes' => 'Test payment',
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'customer_id',
                    'amount',
                    'payment_date',
                    'period_start',
                    'period_end',
                    'status',
                ]);
    }

    public function test_can_get_monthly_report()
    {
        // Create some test payments
        Payment::create([
            'customer_id' => $this->customer->id,
            'amount' => 150000,
            'payment_date' => '2025-10-07',
            'period_start' => '2025-10-01',
            'period_end' => '2025-10-31',
            'status' => 'paid',
        ]);

        Payment::create([
            'customer_id' => $this->customer->id,
            'amount' => 150000,
            'payment_date' => '2025-10-07',
            'period_start' => '2025-10-01',
            'period_end' => '2025-10-31',
            'status' => 'unpaid',
        ]);

        $response = $this->actingAs($this->admin)
                        ->getJson('/api/payments/monthly-report?month=10&year=2025');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'paid' => [
                            'count',
                            'total',
                        ],
                        'unpaid' => [
                            'count',
                            'total',
                        ],
                    ],
                ]);
    }

    public function test_cannot_create_payment_with_invalid_date_range()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/payments', [
            'customer_id' => $this->customer->id,
            'amount' => 150000,
            'payment_date' => '2025-10-07',
            'period_start' => '2025-10-31', // End date before start date
            'period_end' => '2025-10-01',
            'status' => 'paid',
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['period_end']);
    }

    public function test_can_get_customer_payment_history()
    {
        // Create some payments for the customer
        Payment::create([
            'customer_id' => $this->customer->id,
            'amount' => 150000,
            'payment_date' => '2025-10-07',
            'period_start' => '2025-10-01',
            'period_end' => '2025-10-31',
            'status' => 'paid',
        ]);

        $response = $this->actingAs($this->admin)
                        ->getJson("/api/payments?customer_id={$this->customer->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'amount',
                            'payment_date',
                            'status',
                        ],
                    ],
                ]);
    }
}