import { useState, useEffect,createContext } from "react";
import { basePath } from "./pagesData";
import { themes } from "./themes";

export const Context = createContext(null);

export const ContextProvider = ({children}) => {
  const savedToken = sessionStorage.getItem("GroupomaniaSessionToken");
  const initialToken = savedToken !== null ? savedToken : "none";
  const [token, setToken] = useState(initialToken);

  const [theme, setTheme] = useState("original");

  const savedUserData = JSON.parse(sessionStorage.getItem("GroupomaniaUserData"));
  const initialUserData = savedUserData !== null ? savedUserData : "none";
  const [userData, setUserData] = useState(initialUserData);

  const getUserData = async function () {
    if (token === "none") {
      sessionStorage.removeItem("GroupomaniaUserData");
      sessionStorage.removeItem("GroupomaniaSessionToken");
      if (userData !== "none"){
        setUserData("none");
      }
      if (theme !== "original"){
        setTheme("original");
      }
    }
    else {
      try {
        const res = await fetch (`${basePath}/users/me?activity=true`,{
          method : "GET",
          headers: { 
            'Authorization' : `Bearer ${token}`
            }
        });
        if (res.status === 200) {
          const newUserData = await res.json();
          sessionStorage.setItem("GroupomaniaSessionToken", token);
          sessionStorage.setItem("GroupomaniaUserData", JSON.stringify(newUserData));
          if (Object.keys(themes).includes(newUserData.theme)) {
            setTheme(newUserData.theme);
          } else {
            if (theme !== "original"){
              setTheme("original");
            }
          }
          setUserData(newUserData);
        }
        else if (res.status === 400 || res.status === 401 || res.status === 403) {
          setToken("none");
        } 
        else {
          console.log("Can't get user data from server")
        }
      } catch {
        console.log("fail");
      }
    }
  };

  useEffect (() => {
    getUserData();
  }, [token]);
  
  return (
    <Context.Provider value={{token, setToken, userData, setUserData, theme, setTheme}}>
      {children}
    </Context.Provider>
  )
}