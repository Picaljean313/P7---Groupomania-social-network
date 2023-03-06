import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { Context } from "../utils/Context";


function TokenRedirectionLayout () {
  const {token} = useContext (Context);

  if (token !== "none") return <Navigate to="/home" />
  
  return <Outlet/>
}
export default TokenRedirectionLayout;