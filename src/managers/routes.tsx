import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import UserProfile from "../pages/UserProfile";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Layout from '../components/Layout';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> }, // Use index route
      { path: "login", element: <Login /> },                      // Remove leading slash
      { path: "register", element: <Register /> },                // Remove leading slash
      { path: "home", element: <Home /> },                        // Remove leading slash
      { path: "profile/:username", element: <UserProfile /> },    // Remove leading slash
      { path: "*", element: <NotFound /> },
    ],
  },
]); 

const AppRouter: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default AppRouter;
