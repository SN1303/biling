<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Customer;
use App\Models\Package;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teknisi;
    protected $package;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teknisi = User::factory()->create(['role' => 'teknisi']);

        // Create test package
        $this->package = Package::create([
            'name' => 'Test Package',
            'price' => 150000,
            'speed' => '10 Mbps',
        ]);
    }

    public function test_admin_can_create_customer()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/customers', [
            'name' => 'Test Customer',
            'address' => 'Test Address',
            'phone_number' => '08123456789',
            'package_id' => $this->package->id,
            'subscription_status' => 'active',
            'pppoe_username' => 'testuser',
            'pppoe_password' => 'testpass',
            'installation_date' => '2025-10-07',
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'address',
                    'phone_number',
                    'package_id',
                    'subscription_status',
                    'pppoe_username',
                ]);
    }

    public function test_teknisi_can_view_customers()
    {
        Customer::create([
            'name' => 'Test Customer',
            'address' => 'Test Address',
            'phone_number' => '08123456789',
            'package_id' => $this->package->id,
            'subscription_status' => 'active',
            'pppoe_username' => 'testuser',
            'pppoe_password' => 'testpass',
            'installation_date' => '2025-10-07',
            'next_due_date' => '2025-11-07',
        ]);

        $response = $this->actingAs($this->teknisi)->getJson('/api/customers');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'address',
                            'phone_number',
                            'subscription_status',
                        ]
                    ]
                ]);
    }

    public function test_unauthenticated_user_cannot_access_customers()
    {
        $response = $this->getJson('/api/customers');
        $response->assertStatus(401);
    }

    public function test_cannot_create_customer_with_duplicate_pppoe_username()
    {
        // Create first customer
        Customer::create([
            'name' => 'First Customer',
            'address' => 'Address 1',
            'phone_number' => '08123456789',
            'package_id' => $this->package->id,
            'subscription_status' => 'active',
            'pppoe_username' => 'testuser',
            'pppoe_password' => 'testpass',
            'installation_date' => '2025-10-07',
            'next_due_date' => '2025-11-07',
        ]);

        // Try to create second customer with same username
        $response = $this->actingAs($this->admin)->postJson('/api/customers', [
            'name' => 'Second Customer',
            'address' => 'Address 2',
            'phone_number' => '08987654321',
            'package_id' => $this->package->id,
            'subscription_status' => 'active',
            'pppoe_username' => 'testuser',
            'pppoe_password' => 'testpass2',
            'installation_date' => '2025-10-07',
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['pppoe_username']);
    }
}