<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function employees()
    {
        $employees = User::role('employee')
            ->select('id', 'name', 'email')
            ->get();

        return response()->json($employees);
    }

    public function index()
    {
        $tasks = Task::with('users:id,name,email')
            ->latest()
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        $task = Task::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => 'pending',
        ]);

        $task->users()->sync($validated['user_ids']);

        $task->load('users:id,name,email');

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    public function myTasks($userId)
    {
        $user = User::with('tasks.users:id,name,email')->findOrFail($userId);

        return response()->json($user->tasks);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $task = Task::findOrFail($id);

        $task->update([
            'status' => $validated['status'],
        ]);

        $task->load('users:id,name,email');

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task,
        ]);
    }
}