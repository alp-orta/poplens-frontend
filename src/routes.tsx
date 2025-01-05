import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

// Lazy load pages for performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
//const FollowerFeed = lazy(() => import("./pages/FollowerFeed")); // Placeholder for the future
// const ForYouFeed = lazy(() => import("./pages/ForYouFeed"));     // Placeholder for the future
// const Profile = lazy(() => import("./pages/Profile"));           // Placeholder for the future
// const MediaBrowse = lazy(() => import("./pages/MediaBrowse"));   // Placeholder for the future
// const MediaPage = lazy(() => import("./pages/MediaPage"));       // Placeholder for the future
const NotFound = lazy(() => import("./pages/NotFound"));

const routes = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> }, // Default to login
  { path: "/login", element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
  { path: "/register", element: <Suspense fallback={<div>Loading...</div>}><Register /></Suspense> },
  { path: "/home", element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
  { path: "/profile/:username", element: <Suspense fallback={<div>Loading...</div>}><Profile /></Suspense> },
//   { 
//      path: "/media",
//      element: <Suspense fallback={<div>Loading...</div>}><MediaBrowse /></Suspense>,
//      children: [
//          { path: "browse", element: <MediaBrowse /> },
//          { path: ":id", element: <MediaPage /> },
//     ],
//   },
//   { path: "/media/:id", element: <Suspense fallback={<div>Loading...</div>}><MediaPage /></Suspense> },
  { path: "*", element: <Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense> }, // Catch-all route
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default AppRouter;
