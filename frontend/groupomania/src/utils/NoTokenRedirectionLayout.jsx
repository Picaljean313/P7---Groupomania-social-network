import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { Context } from "../utils/Context";


function NoTokenRedirectionLayout () {
  const {token} = useContext (Context);

  if (token === "none") return <Navigate to="/" />
  
  return <Outlet/>
}
export default NoTokenRedirectionLayout;