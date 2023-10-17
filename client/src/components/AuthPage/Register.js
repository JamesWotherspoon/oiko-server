import React, { useState } from "react";
import { postApiRequest } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [awaitingApiResponse, setAwaitingApiResponse] = useState(false);
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setAwaitingApiResponse(true);

    try {
      const response = await postApiRequest("/auth/register", { email, password });

      if (response.status === 201) {
        // Registration successful, you can handle it as needed
        login()
        navigate("/home");
      }
    } catch (error) {
      setErrorLoggingIn(true);
      console.error(error);
    } finally {
      setAwaitingApiResponse(false);
    }
  };

  return (
    <div>
      {awaitingApiResponse ? <div>Processing request</div> : null}
      {errorLoggingIn ? <div>Error</div> : null}

      {/* Registration form */}
      <form onSubmit={handleRegistration}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={awaitingApiResponse}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={awaitingApiResponse}
          />
        </div>
        <button type="submit" disabled={awaitingApiResponse}>
          {awaitingApiResponse ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
