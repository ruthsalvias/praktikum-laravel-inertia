<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create test todos
        Todo::create([
            'user_id' => $user->id,
            'title' => 'Belajar Laravel',
            'description' => '<div>Pelajari dasar-dasar Laravel framework</div>',
            'is_finished' => false,
        ]);

        Todo::create([
            'user_id' => $user->id,
            'title' => 'Belajar React',
            'description' => '<div>Menguasai React dengan Inertia</div>',
            'is_finished' => true,
        ]);

        Todo::create([
            'user_id' => $user->id,
            'title' => 'Implementasi CRUD',
            'description' => '<div>Membuat fitur CRUD untuk todos</div>',
            'is_finished' => false,
        ]);
    }
}
