"use client";
import React from "react";
import styles from "./Dashboard.module.css";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  status: "Pending" | "In Progress" | "Done";
  category?: string;
};

type DashboardProps = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
};

export default function Dashboard({ tasks, onEdit, onDelete, onStatusChange }: DashboardProps) {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Today's Tasks</h1>
      <div className="space-y-4">
        {tasks.length === 0 && <div className="text-gray-500">No tasks for today.</div>}
        {tasks.map(task => (
          <div key={task._id} className={styles.taskCard}>
  <div>
    <div className="font-bold text-2xl mb-1 text-blue-900">{task.title}</div>
    <div className="text-lg text-gray-700 mb-1">{task.description}</div>
    <div className="text-base text-gray-500 font-medium">
      {task.category} | {task.date} {task.time && `| ${task.time}`}
    </div>
  </div>

            <div className={styles.actions}>
              <select
                className="border rounded px-2 py-1"
                value={task.status}
                onChange={e => onStatusChange(task._id, e.target.value as Task["status"])}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button className={styles.editBtn} onClick={() => onEdit(task)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => onDelete(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 