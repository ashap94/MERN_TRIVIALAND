import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
// ideally, figure out a way to prop thread from app component with the routes
// import { socket } from "../../index";

import UserStatsDisplay from "../game/stats/user_stats_display";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {}
    };

    this.playGame = this.playGame.bind(this);
    this.multiplayerGame = this.multiplayerGame.bind(this);
    this.fetchAllGames = this.fetchAllGames.bind(this);
    this.deleteAllGames = this.deleteAllGames.bind(this);

    this.props.socket.emit("profile page join", "hello world");
    this.props.socket.on("profile page join", data => {
      console.log(data);
    });
  }

  componentDidMount() {
    this.props.fetchCurrentUserData(this.props.currentUser.username);
    // this.props.message = "NEW MESSAGE REASSIGNEMT!!";
  }

  playGame(player) {
    if (player === "one") {
      this.props.history.push("/game");
    } else {
      // console.log("Not There Yet");
    }
  }

  multiplayerGame() {
    this.props.history.push("/multiplayerOptions");
  }

  // get all games only for ben and aaron

  fetchAllGames() {
    return axios
      .get("/api/games/getAllGames")
      .then(games => console.log(games));
  }

  deleteAllGames() {
    return axios.delete("api/games/deleteAllGames");
  }

  // delete all games only for ben and aaron

  render() {
    // console.log("APP PROPS", this.props);

    let currentUser = this.props.currentUser;
    let id = currentUser.id;
    let user = this.props.users[id];
    let username = this.props.currentUser.username;

    // let fetchAllGamesButton =
    //   username === "Benny" || username === "aaron" ? (
    //     <button className="play-button" onClick={this.fetchAllGames}>
    //       Show Games on Console
    //     </button>
    //   ) : null;

    // let deleteAllGamesButton =
    //   username === "Benny" || username === "aaron" ? (
    //     <button className="play-button" onClick={this.deleteAllGames}>
    //       Delete All Games
    //     </button>
    //   ) : null;

    console.log(this.props.currentUser);

    if (!user) {
      return null;
    }

    // let hasStats = !!user["gamesPlayed"];

    // if (!hasStats) {
      return (
        <div className="profile-content">
          <div className="profile-stats">
            <h2>Welcome {currentUser.username}</h2>
            <p>This user has no data</p>
          </div>
          <div>
            <button
              className="play-button"
              onClick={() => this.playGame("one")}
            >
              Play 1 Player Game
            </button>
            <button className="play-button" onClick={this.multiplayerGame}>
              Start MultiPlayer Game
            </button>
            {/* {fetchAllGamesButton}
            {deleteAllGamesButton} */}
          </div>
        </div>
      );
      
    // }
    //  else {
    //   return (
    //     <div className="profile-content">
    //       <div className="profile-stats">
    //         <h2>Stats for {currentUser.username}</h2>
    //         <UserStatsDisplay user={user} />
    //       </div>
    //       <div className="play-buttons">
    //         <button
    //           className="play-button"
    //           onClick={() => this.playGame("one")}
    //         >
    //           Play 1 Player Game
    //         </button>
    //         <button className="play-button" onClick={this.multiplayerGame}>
    //           Start MultiPlayer Game
    //         </button>
    //         {fetchAllGamesButton}
    //         {deleteAllGamesButton}
    //       </div>
    //     </div>
    //   );
    // }
  }
}

export default withRouter(Profile);
