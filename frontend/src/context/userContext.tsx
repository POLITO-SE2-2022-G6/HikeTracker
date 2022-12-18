import { useState, useEffect, createContext, useMemo } from "react";
import { API } from "../utilities/api/api";

type Props = {
  children: JSX.Element;
}

export type UserInfo = {
  loggedIn: boolean;
  data?: {
    id: number;
    type: string;     // 'Hiker'  'Guide'
    email: string;
    username: string;
    phoneNumber: string;
  }
}

type UserContextType = {
  state: UserInfo;
  setState: (data: UserInfo) => void;
}

export const UserContext = createContext<UserContextType>(
  { state: { loggedIn: false }, setState: () => { } }
);

export const UserContextWrapper = ({ children }: Props) => {
  const [user, setUser] = useState<UserInfo>({ loggedIn: false });


  useEffect(() => {
    const fetchUser = async () => {
      const data  = await API.auth.check() ;
      if (data) {
        setUser({ loggedIn: true, data });
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={useMemo(() =>({state: user, setState: setUser}), [user,setUser])}>
      {children}
    </UserContext.Provider>
  );
};
