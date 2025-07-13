import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const BACKEND_URL = "https://giftrecomenderproject.onrender.com";

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ show loading
    setError("");

    try {
      const url = `${BACKEND_URL}/api/auth`;
      const res = await axios.post(url, data);

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false); // ✅ hide loading
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            {loading && <div className={styles.loading_msg}>🔄 Please wait while logging in...</div>}
            <button 
              type="submit" 
              className={styles.green_btn} 
              disabled={loading} // ✅ disable during login
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
