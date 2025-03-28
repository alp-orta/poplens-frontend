import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import UserProfile from "../pages/UserProfile";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Layout from '../components/Layout';
import BooksPage from "../pages/Books";
import FilmsPage from "../pages/Films";
import GamesPage from "../pages/Games";
import MediaDetailsPage from "../pages/MediaDetails";

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
      { path: "films", element: <FilmsPage /> },
      { path: "books", element: <BooksPage /> },
      { path: "games", element: <GamesPage /> },
      { path: "*", element: <NotFound /> },
      { path: "films/:mediaName", element: <MediaDetailsPage /> },
      { path: "books/:mediaName", element: <MediaDetailsPage /> },
      { path: "games/:mediaName", element: <MediaDetailsPage /> },
    ],
  },
]); 

const AppRouter: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default AppRouter;
