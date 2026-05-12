<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfilePhotoUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_a_profile_photo(): void
    {
        Storage::fake('local');

        $user = User::factory()->create([
            'name' => 'Upload Test User',
            'email' => 'upload-test@example.com',
        ]);

        Sanctum::actingAs($user);

        $response = $this->patch("/api/profile/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'profile_photo' => UploadedFile::fake()->image('avatar.png', 64, 64),
        ], [
            'Accept' => 'application/json',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('message', 'Profile updated successfully')
            ->assertJsonPath('user.id', $user->id);

        $user->refresh();

        $this->assertSame(1, $user->getMedia('avatar')->count());
        $this->assertNotEmpty($response->json('user.avatar_url'));
    }
}
