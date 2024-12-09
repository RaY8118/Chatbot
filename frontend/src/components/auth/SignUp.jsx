import React, { useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // React Router's hook

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigate("/chatbot");
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  const onGoogleSignUp = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        await doSignInWithGoogle();
        alert("Sign up with Google successful!");
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
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
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center">Or</p>
          <button
            onClick={onGoogleSignUp}
            className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing Up..." : "Sign up with Google"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have a account?{" "}
            <a
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
