import { useContext, useEffect, useState } from "react";
import logoImage from "../assets/logo.svg";
import { Context } from "../context/UserContext";
import { SignIn } from "./SignIn";

export function Header() {
  const { user, SignOut } = useContext(Context);

  function handleSignOut() {
    SignOut();
  }

  return (
    <div className="w-full mx-auto flex items-center justify-between px-8 py-2">
      <img src={logoImage} alt="Habits logo" className="w-32" />
      {user ? (
        <>
          <button onClick={handleSignOut}>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="User avatar"
                className="w-14 rounded-full border-2 p-0.5"
              />
            )}
          </button>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
