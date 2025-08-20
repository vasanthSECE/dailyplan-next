"use client";

import Dashboard, { Task } from "../../components/Dashboard";
import TaskForm from "../../components/TaskForm";
import React, { useState, useEffect } from "react";

import styles from "../../components/Dashboard.module.css";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserId = () => (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        setTasks([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/tasks?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch {
        setError("Could not load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      setTasks((tasks) => tasks.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleStatusChange = async (id: string, status: Task["status"]) => {
    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setTasks((tasks) => tasks.map((t) => (t._id === id ? { ...t, status } : t)));
    } catch {
      setError("Failed to update status.");
    }
  };

  const handleFormSubmit = async (task: Partial<Task>) => {
    setError("");
    const userId = getUserId();
    if (!userId) {
      setError("User not logged in.");
      return;
    }
    try {
      if (editingTask) {
        const res = await fetch(`/api/tasks?id=${editingTask._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...task, userId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to update task");
          return;
        }
        setTasks((tasks) =>
          tasks.map((t) => (t._id === editingTask._id ? { ...t, ...task } as Task : t))
        );
      } else {
        const res = await fetch(`/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...task, userId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to create task");
          return;
        }
        setTasks((tasks) => [...tasks, data]);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Task Manager</h1>
        <button
          className={styles.addTaskBtn}
          onClick={() => {
            setShowForm(true);
            setEditingTask(null);
          }}
          aria-label="Add new task"
        >
          <span className={styles.plus}>＋</span> Add New Task
        </button>
      </header>

      {showForm && (
        <div className={styles.formWrapper}>
          <TaskForm initialTask={editingTask || {}} onSubmit={handleFormSubmit} />
        </div>
        
      )}

      {error && <div className={styles.errorMsg}>{error}</div>}

      {loading ? (
        <div className={styles.loadingText}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <p className={styles.emptyMsg}>No tasks yet. Add one to get started!</p>
      ) : (
        <Dashboard
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
