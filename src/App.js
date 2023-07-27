import React, { useState } from "react";
import "./App.css";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Profile from "./components/Profile/Profile";
import FindBlood from "./components/FindBlood/FindBlood";

import {
  ApolloClient,
  createHttpLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { UserContext } from "./Context/userContext";
import { setContext } from "@apollo/client/link/context";
import PrivateRoute from "./components/Authentication/PrivateRoute";
import Editprofile from "./components/EditProfile/Editprofile";
import Notifications from "./components/Notifications/Notifications";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./components/Footer";

export default function App() {
  const [user, setuser] = useState(getUser());
  function logoutUser() {
    localStorage.removeItem("user");
  }
  function getUser() {
    return localStorage.user;
  }

  const httpLink = createHttpLink({
    uri: "https://bloodinneed-backend-production.up.railway.app/",
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    // return the headers to the context so httpLink can read them
    console.log(token);
    return {
      headers: {
        ...headers,
        authorization: token ? `${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <UserContext.Provider value={{ logoutUser, user, setuser }}>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route exact path="/" element={<div>
              <Landing />
              <Footer />
            </div>}>
            </Route>
            <Route path="/login" element={
              <div>
              <Login />
              <Footer />
              </div>
            }>
            </Route>
            <Route path="/signup" element={
              <div>
              <Signup />
              <Footer />
              </div>
            }>
              
            </Route>
            <Route path="/profile" element={<Profile/>} />
            <PrivateRoute path="/findblood" element={<FindBlood/>} />
            <PrivateRoute path="/edit" element={<Editprofile/>} />
            <PrivateRoute path="/notifications" element={<Notifications/>} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
}
