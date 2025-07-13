import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Configurable backend URL - use deployed URL by default
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://giftrecomenderproject.onrender.com";

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = `${BACKEND_URL}/api/auth`;
    const res = await axios.post(url, data);

    localStorage.setItem("token", res.data.token); // ✅ now safe
    navigate("/");
  } catch (error) {
    setError(
      error.response?.data?.message || 
      error.message || 
      "An error occurred. Please try again."
    );
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
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
            
            {/* Development Info - Only shows in localhost */}
            {window.location.hostname === "localhost" && (
              <div className={styles.dev_info}>
                {/* <p>Using backend: {BACKEND_URL}</p> */}
                <button 
                  type="button"
                  className={styles.switch_btn}
                  onClick={() => {
                    const newUrl = BACKEND_URL.includes("localhost") 
                      ? "https://giftrecomenderproject.onrender.com"
                      : "http://localhost:5000";
                    alert(`Switching backend to: ${newUrl}\n\nReload page to apply changes`);
                    localStorage.setItem("backendOverride", newUrl);
                  }}
                >
                  {/* Switch to {BACKEND_URL.includes("localhost") ? "Deployed" : "Local"} Backend */}
                </button>
              </div>
            )}
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