"use client";
import { useState } from "react";

export default function Login() {
  const [pw, setPw] = useState("");

  const submit = () => {
    document.cookie = `founder-auth=${pw}; path=/`;
    location.href = "/";
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>FoundingOS Access</h1>
      <input
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Password"
      />
      <button onClick={submit}>Enter</button>
    </div>
  );
}
