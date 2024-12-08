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
        navigate("/chatbot"); // Redirect to the chatbot page
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
    <div style={styles.container}>
      <h2>Sign Up</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button} disabled={isSigningUp}>
          {isSigningUp ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p>Or</p>
      <button
        onClick={onGoogleSignUp}
        style={{ ...styles.button, ...styles.googleButton }}
        disabled={isSigningUp}
      >
        {isSigningUp ? "Signing Up..." : "Sign up with Google"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    marginBottom: "15px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default SignUp;
