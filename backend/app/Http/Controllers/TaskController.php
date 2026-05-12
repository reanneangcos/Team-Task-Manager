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
                ->select('users.id', 'name', 'email', 'is_active')
                ->with('media'),
            'users' => fn ($query) => $query
                ->select('users.id', 'name', 'email', 'is_active')
                ->with('media'),
        ];
    }

    public function employees()
    {
        $employees = User::role('employee')
            ->with('media')
            ->select('id', 'name', 'email', 'is_active', 'created_at')
            ->get();

        return response()->json($employees);
    }

    public function updateEmployeeStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $employee = User::role('employee')->findOrFail($id);

        $employee->update([
            'is_active' => $validated['is_active'],
        ]);

        if (! $employee->is_active) {
            $employee->tokens()->delete();
        }

        $employee->load('media');

        return response()->json([
            'message' => $employee->is_active
                ? 'Employee account enabled'
                : 'Employee account disabled',
            'user' => $employee,
        ]);
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

    public function myTasks(Request $request, $userId)
    {
        if (! $request->user()->hasRole('admin') && (int) $userId !== $request->user()->id) {
            abort(403, 'You can only view your own tasks.');
        }

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

        if (
            ! $request->user()->hasRole('admin') &&
            ! $task->users()->where('users.id', $request->user()->id)->exists()
        ) {
            abort(403, 'You can only update tasks assigned to you.');
        }

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
