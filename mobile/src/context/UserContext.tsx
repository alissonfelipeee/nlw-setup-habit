import { UserInfo } from "@firebase/auth-types";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createContext, useEffect, useState } from "react";

interface UserContext {
  user: UserInfo | null;
}

const Context = createContext({} as UserContext);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  GoogleSignin.configure({
    webClientId:
      "1089811791892-uodd6k32a0o0nc8tvfp2tu2pl5ipid44.apps.googleusercontent.com",
  });

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
};

export { Context, UserProvider };
