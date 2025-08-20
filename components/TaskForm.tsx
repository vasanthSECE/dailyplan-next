"use client";
import React, { useState } from "react";
import type { Task } from "./Dashboard";
import styles from "./TaskForm.module.css";

type TaskFormProps = {
  initialTask?: Partial<Task>;
  onSubmit: (task: Partial<Task>) => void;
  loading?: boolean;
};

export default function TaskForm({ initialTask = {}, onSubmit, loading }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask.title || "");
  const [description, setDescription] = useState(initialTask.description || "");
  const [date, setDate] = useState(initialTask.date ? initialTask.date.slice(0, 10) : "");
  const [time, setTime] = useState(initialTask.time || "");
  const [category, setCategory] = useState(initialTask.category || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, date, time, category });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Add / Edit Task</h2>

      <div className={styles.formGroup}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.flexRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Date</label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Time</label>
          <input
            type="time"
            className={styles.input}
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Category</label>
        <input
          type="text"
          className={styles.input}
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
