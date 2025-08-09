"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
  setLoading(true);
  setMessage("");

  // This is the logic for when a user is trying to log in.
  // It remains unchanged.
  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      router.push("/"); // On success, go to the homepage
      router.refresh(); // This tells Next.js to re-check the middleware
    }
  } else {
    // This is the new, improved logic for when a user is signing up.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // The 'options.data' object is the key change.
      // This metadata is securely passed to your database trigger.
      options: {
        data: {
          username: username, // The trigger will read this value
        },
      },
    });

    if (error) {
      // If Supabase returns an error (like email already exists), show it.
      setMessage(error.message);
    } else {
      // On success, we don't redirect. We show a message telling the
      // user to check their email for the confirmation link.
      setMessage("Success! Please check your email to verify your account.");
    }
  }

  setLoading(false);
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-200">
        
        {/* EcoSnap Text Logo */}
        <div className="flex justify-center mb-6">
          <h1 className="text-5xl font-extrabold text-green-600">EcoSnap</h1>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 mb-5 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 mb-5 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mb-8 rounded-lg bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full p-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-center text-gray-600 hover:text-green-600 cursor-pointer text-base"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>

        {message && (
          <p className="mt-5 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
