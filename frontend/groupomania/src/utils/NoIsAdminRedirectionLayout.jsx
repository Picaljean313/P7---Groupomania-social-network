import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { Context } from "../utils/Context";


function NoIsAdminRedirectionLayout () {
  const {isAdmin} = useContext (Context);

  if (isAdmin !== true) return <Navigate to="/home" />
  
  return <Outlet/>
}
export default NoIsAdminRedirectionLayout;