<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Display a listing of todos with pagination and search
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $search = $request->query('search', '');
        $status = $request->query('status', 'all');
        $page = $request->query('page', 1);
        $perPage = 20;

        $query = $user->todos();

        // Search functionality
        if ($search) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Status filtering: all / completed / pending
        if ($status === 'completed') {
            $query->where('is_finished', true);
        } elseif ($status === 'pending') {
            $query->where('is_finished', false);
        }

        // Get paginated todos
        $todos = $query->orderBy('created_at', 'desc')->paginate($perPage, ['*'], 'page', $page);
        // Ensure paginator links preserve search and status query parameters
        $todos->appends(['search' => $search, 'status' => $status]);

        // Get statistics
        $stats = [
            'total' => $user->todos()->count(),
            'completed' => $user->todos()->where('is_finished', true)->count(),
            'pending' => $user->todos()->where('is_finished', false)->count(),
        ];

        $data = [
            'todos' => $todos,
            'stats' => $stats,
            'search' => $search,
            'status' => $status,
        ];

        return Inertia::render('app/TodoPage', $data);
    }

    /**
     * Store a newly created todo in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            $todo = new Todo();
            $todo->user_id = Auth::id();
            $todo->title = $validated['title'];
            $todo->description = $validated['description'] ?? null;

            // Handle file upload
            if ($request->hasFile('cover')) {
                $file = $request->file('cover');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/todos'), $filename);
                $todo->cover = '/uploads/todos/' . $filename;
            }

            $todo->save();

            return response()->json([
                'success' => true,
                'message' => 'Todo berhasil ditambahkan!',
                'todo' => $todo,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan todo: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified todo in storage
     */
    public function update(Request $request, Todo $todo)
    {
        // Check authorization
        if ($todo->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengedit todo ini.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_finished' => 'nullable|boolean',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        try {
            $todo->title = $validated['title'];
            $todo->description = $validated['description'] ?? null;
            $todo->is_finished = $validated['is_finished'] ?? $todo->is_finished;

            // Handle file upload
            if ($request->hasFile('cover')) {
                // Delete old file if exists
                if ($todo->cover && file_exists(public_path($todo->cover))) {
                    unlink(public_path($todo->cover));
                }

                $file = $request->file('cover');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/todos'), $filename);
                $todo->cover = '/uploads/todos/' . $filename;
            }

            $todo->save();

            return response()->json([
                'success' => true,
                'message' => 'Todo berhasil diperbarui!',
                'todo' => $todo,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui todo: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified todo from storage
     */
    public function destroy(Todo $todo)
    {
        // Check authorization
        if ($todo->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus todo ini.',
            ], 403);
        }

        try {
            // Delete file if exists
            if ($todo->cover && file_exists(public_path($todo->cover))) {
                unlink(public_path($todo->cover));
            }

            $todo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Todo berhasil dihapus!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus todo: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle todo completion status
     */
    public function toggle(Todo $todo)
    {
        if ($todo->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah status todo ini.',
            ], 403);
        }

        try {
            $todo->is_finished = !$todo->is_finished;
            $todo->save();

            return response()->json([
                'success' => true,
                'message' => $todo->is_finished ? 'Todo ditandai selesai!' : 'Todo ditandai belum selesai!',
                'todo' => $todo,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status todo: ' . $e->getMessage(),
            ], 500);
        }
    }
}
