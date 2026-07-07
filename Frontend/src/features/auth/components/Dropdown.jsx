import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IoPersonCircleOutline } from "react-icons/io5";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";

import { useAuth } from "../../auth/hooks/useAuth";

import "./Dropdown.scss";

const Dropdown = () => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  const {
    user,
    handleLogout
  } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  const logout = async () => {
    await handleLogout();

    navigate("/login");

    setOpen(false);
  };

  return (
    <div
      className="profile-dropdown"
      ref={menuRef}
    >
      <IoPersonCircleOutline
        className="profile-icon"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="dropdown-menu">

          {user ? (
            <button
              className="dropdown-item"
              onClick={logout}
            >
              <FiLogOut />
              Logout
            </button>
          ) : (
            <>
              <button
                className="dropdown-item"
                onClick={() => navigate("/login")}
              >
                <FiLogIn />
                Login
              </button>

              <button
                className="dropdown-item"
                onClick={() => navigate("/register")}
              >
                <FiUserPlus />
                Register
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default Dropdown;