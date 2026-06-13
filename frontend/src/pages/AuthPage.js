import { useState } from "react";
import { login, register } from "../services/authService";

function AuthPage({ onLogin, darkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const cardClass = darkMode
    ? "card bg-secondary text-light shadow p-4"
    : "card shadow p-4";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      let user;

      if (isLogin) {
        user = await login({ email, password });
      } else {
        user = await register({ name, email, password });
      }

      onLogin(user);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className={cardClass}>
          <h2 className="mb-4 text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          {message && (
            <div className="alert alert-danger">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME (only for register) */}
            {!isLogin && (
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* SUBMIT */}
            <button type="submit" className="btn btn-primary w-100">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          {/* TOGGLE LOGIN/REGISTER */}
          <p className="text-center mt-3 mb-0">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="btn btn-link p-0 ms-1"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;