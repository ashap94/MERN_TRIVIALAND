import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import jwt_decode from "jwt-decode";
import socketIOClient from "socket.io-client";
// import { emitSetup, onSetup } from '../util/sockets_util';

import { setAuthToken } from "./util/session_api_util";
import { logout } from "./actions/session_actions";

import { fetchGameStats } from "./actions/game_stats_actions";

// export const socket =
//   process.env.NODE_ENV === "development"
//     ? socketIOClient("localhost:5000")
//     : socketIOClient(window.location);

// socket.on("connect", () => {
//   console.log("working");
//   socket.emit("testing", { testing: true });
// });
// socket.on("echo", msg => {
//   console.log(msg);
// });
  console.log("Testing");

document.addEventListener("DOMContentLoaded", () => {
  // let client = socketIOClient("http://localhost:5000");
  // client.on("connect", () => {
  //   console.log("working");
  //   client.emit("testing", { testing: true });
  // });
  // client.on("echo", msg => {
  //   console.log(msg);
  // });

  // export const socket =
  //   process.env.NODE_ENV === "development"
  //     ? socketIOClient("localhost:5000")
  //     : socketIOClient(window.location);

  // socket.on("connect", () => {
  //   console.log("working");
  //   socket.emit("testing", { testing: true });
  // });
  // socket.on("echo", msg => {
  //   console.log(msg);
  // });

  let store;

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);

    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = {
      session: { isAuthenticated: true, user: decodedUser }
    };

    store = configureStore(preloadedState);

    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
  } else {
    store = configureStore({});
  }

  /* testing */
  window.dispatch = store.dispatch;
  window.getState = store.getState;
  window.fetchGameStats = fetchGameStats;
  /* end testing */

  const root = document.getElementById("root");

  ReactDOM.render(<Root store={store} persisor={0} />, root);
});
// socket={socket}
