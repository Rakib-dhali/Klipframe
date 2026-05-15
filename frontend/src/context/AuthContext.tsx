import { createContext, useEffect, useState } from "react";
import type { IUser } from "../constant/assets";

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (user: { email: string; password: string }) => Promise<void>;
  register: (user: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const register = async ({name, email, password}) => {

  }
  const logIn = async ( ) => {

  }
  const logOut = async ( ) => {

  }
  const fetchUser = async ( ) => {

  }

  useEffect(()=> {
    (async ()=> {
       await fetchUser()
    })();
  },[])

  const value = {
    user, setUser, isLoggedIn, setIsLoggedIn, register, logIn, logOut, 
  }

  return
  <>
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  </>
};
