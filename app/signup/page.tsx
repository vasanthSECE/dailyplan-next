"use client";
import { useState } from "react";
import styles from "./SignupForm.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.head}>Hey There !, Let's Starts with your Day planner Customization</h1>
            <h2 className={styles.title}> </h2>
        <h2 className={styles.title}>Sign Up</h2>
        {error && <div className={styles.error}>{error}</div>}
        <div>
          <label className={styles.label}>Name</label>
          <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className={styles.label}>Email</label>
          <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <a href="/login" className={styles.link}>Already have an account? Login</a>
      </form>
    </div>
  );
} 