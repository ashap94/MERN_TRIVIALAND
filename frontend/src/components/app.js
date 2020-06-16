import React from "react";
import "./css/reset.css";
import { AuthRoute, ProtectedRoute } from "../util/route_util";
import * as GameUtil from "../util/game_util";
import { Switch } from "react-router-dom";
import NavBarContainer from "./nav/navbar_container";
import { Route } from "react-router-dom";
import MainPage from "./main/main_page_container";
import LoginFormContainer from "./session/login_form_container";
import SignupFormContainer from "./session/signup_form_container";
import ProfileContainer from "./profile/profile_container";
import GameContainer from "./game/game_container";
import MultiplayerOptionsContainer from "./game/multiplayer_options_container";
import GameLobbyContainer from "./game/game_lobby_container";
import { persistStore } from "redux-persist";
import GameMultiplayerContainer from "./game/multiplayer_game_container";
import socketIOClient from "socket.io-client";
import io from "socket.io-client";
import * as GameActions from "../actions/game_actions";

// import { emitSetup, onSetup } from '../util/sockets_util';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: "",
      message: "ON THE APP PAGE"
    };

    // this.socket =
    //   process.env.NODE_ENV === "development"
    //     ? socketIOClient("localhost:5000")
    //     : socketIOClient(window.location);

    // this.socket = io({ transports: ["websocket"] });
    this.socket = io();

    // this.message = "ON THE APP PAGE";
  }

  componentDidMount() {
    // console.log("ON THE STARTUP APP PAGE: ", this.message);
    // this.message = "NEW MESSAGE REASSIGNED!! ON TO THE NEXT PAGES!!";

    // const socket =
    //   process.env.NODE_ENV === "development"
    //     ? socketIOClient("localhost:5000")
    //     : socketIOClient(window.location);

    this.socket.on("connect", () => {
      console.log("working");
      console.log("IN THE APP PAGE!");
      this.socket.emit("testing", { testing: true });
    });

    this.socket.on("echo", msg => {
      console.log(msg);
    });

    // this.socket.on("added player", room => {
    //   console.log("UPDATING REDUX STATE GAME FROM CLIENT SIDE SOCKET: ", room);
    //   console.log("ON THE FRONTEND APP SHOWING THIS!!-----: ", this);
    //   debugger;
    //   // FOR SOME REASON FETCHCURRENTGAME IS NOT INSTANTIATING SUPPOSODELY
    //   // I HAVE DEBUGGERS IN THE ACTIONS IN THE OTHER FILES BUT THEY ARE NO EXECUTING
    //   // FETCH CURRENT GAME IS WITH UPDATED PLAYERS ARRAY FROM INDIVIDUAL JOINING GAME
    //   GameActions.fetchCurrentGame(room);
    // });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/signup" component={SignupFormContainer} />

          {/* <ProtectedRoute exact path="/profile" component={ProfileContainer} /> */}

          <ProtectedRoute
            exact
            path="/profile"
            component={() => (
              <ProfileContainer socket={this.socket} message={this.message} />
            )}
          />

          <ProtectedRoute
            exact
            path="/game"
            component={GameContainer}
            message={this.message}
          />

          {/* <ProtectedRoute
            exact
            path="/game/:gameId/lobby"
            component={GameLobbyContainer}
          /> */}

          <ProtectedRoute
            exact
            path="/game/:gameId/lobby"
            component={() => (
              <GameLobbyContainer socket={this.socket} message={this.message} />
            )}
          />

          {/*  ^^^^ playerlobby component for users who joined another room */}
          {/* <ProtectedRoute
            exact
            path="/game/:gameId"
            component={GameMultiplayerContainer}
          /> */}

          <ProtectedRoute
            exact
            path="/game/:gameId"
            component={() => (
              <GameMultiplayerContainer
                socket={this.socket}
                message={this.message}
              />
            )}
          />

          {/* <ProtectedRoute
            exact
            path="/multiplayerOptions"
            component={MultiplayerOptionsContainer}
          /> */}

          <ProtectedRoute
            exact
            path="/multiplayerOptions"
            component={() => (
              <MultiplayerOptionsContainer
                socket={this.socket}
                message={this.message}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
