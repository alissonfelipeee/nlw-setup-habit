import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";

interface UserContext {
  user: User | null;
  SignIn: () => void;
  SignOut: () => void;
}

const Context = createContext({} as UserContext);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  function SignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function SignOut() {
    auth.signOut();
    setUser(null);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Context.Provider value={{ user, SignIn, SignOut }}>
      {children}
    </Context.Provider>
  );
};

export { Context, UserProvider };
