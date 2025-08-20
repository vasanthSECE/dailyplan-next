"use client";
import { useState } from "react";
import styles from "./LoginForm.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        // Save userId to localStorage
        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user._id);
        }
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
 
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
         <h3 className={styles.head1}>Your Daily - Planner Welcomes You!</h3>
          <h2 className={styles.title}></h2>
        <h2 className={styles.title}>Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        <div>
          <label className={styles.label}>Email</label>
          <input type="email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <a href="/signup" className={styles.link}>Don't have an account? Sign up</a>
      </form>
    </div>
  );
} 