import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        toast.success("Signed In Successfully!");
        navigate("/chatbot");
      } catch (err) {
        toast.error(err.message);
        // setErrorMessage(err.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
        toast.success("Sign In Successfully!");
        navigate("/chatbot");
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center">Sign In</h2>
          {/* {errorMessage && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )} */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center">Or</p>
          <button
            onClick={onGoogleSignIn}
            className="w-full px-4 py-2 mt-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing In..." : "Sign in with Google"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
