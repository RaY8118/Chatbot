import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // React Router's hook

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigate("/chatbot"); // Redirect to the chatbot page
      } catch (err) {
        setErrorMessage(err.message);
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
        navigate("/chatbot"); // Redirect to the chatbot page
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign In</h2>
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
        <button type="submit" style={styles.button} disabled={isSigningIn}>
          {isSigningIn ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p>Or</p>
      <button
        onClick={onGoogleSignIn}
        style={{ ...styles.button, ...styles.googleButton }}
        disabled={isSigningIn}
      >
        {isSigningIn ? "Signing In..." : "Sign in with Google"}
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

export default SignIn;
