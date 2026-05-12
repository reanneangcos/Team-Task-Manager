<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    private function taskRelations(): array
    {
        return [
            'creator' => fn ($query) => $query
                ->select('users.id', 'name', 'email')
                ->with('media'),
            'users' => fn ($query) => $query
                ->select('users.id', 'name', 'email')
                ->with('media'),
        ];
    }

    public function employees()
    {
        $employees = User::role('employee')
            ->with('media')
            ->select('id', 'name', 'email', 'created_at')
            ->get();

        return response()->json($employees);
    }

    public function index()
    {
        $tasks = Task::with($this->taskRelations())
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
            'created_by' => $request->user()->id,
        ]);

        $task->users()->sync($validated['user_ids']);

        $task->load($this->taskRelations());

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed',
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'],
        ]);

        $task->users()->sync($validated['user_ids']);
        $task->load($this->taskRelations());

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }

    public function myTasks($userId)
    {
        $user = User::with([
            'tasks' => fn ($query) => $query->with($this->taskRelations()),
        ])->findOrFail($userId);

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

        $task->load($this->taskRelations());

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task,
        ]);
    }
}
