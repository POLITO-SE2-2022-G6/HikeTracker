import axios from "axios";
import { useState, useEffect, createContext } from "react";

type Props = {
  children: JSX.Element;
}

export type UserInfo = {
  loggedIn: boolean;
  data?: {
    id: number;
    type: 'Hiker' | 'Guide';
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
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get('http://localhost:3001/api/sessions/current',
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
      if (data) {
        setUser({ loggedIn: true, data });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ state: user, setState: setUser }}>
      {children}
    </UserContext.Provider>
  );
};
