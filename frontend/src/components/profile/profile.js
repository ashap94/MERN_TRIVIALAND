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
          
          <div className="profile-content-buttons">
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

          <div className="profile-stats">
            <h2>Welcome {currentUser.username}</h2>
            <h2>Main Objective is to reach the highest score possible utilizing your trivia knowledge!</h2>
            <h2>How to play:</h2>
            <h3>Round 1: (Classic Trivia)</h3>
            <h3>Single/Multiplayer:</h3>
              <ul>
                <li>Player(s) are given a board with 5 different categories.</li>
                <li>Each Category has 5 questions.</li>
                <li>Questions are ordered from easy to hard questions, the more points assigned to a question, the harder it is!</li>
                <li>Player(s) are given 2 minutes to answer as many questions as possible.</li>
                <li>Each question answered wrong, the same magnitude will be deducted from current score.</li>
              </ul>

            <h3>Round 2: (Single Category Elimination)</h3>
            <h3>Single/Multiplayer:</h3>
            
            <ul>
              <li>Player(s) are given a single category of questions and are given a total of 6 chances to answer 3 questions correct</li>
              <li>Player(s) are allowed to choose </li>
              <li>After each correct/incorrect answer to a question, users will have their respective grids assigned a check (<span style={{color: "lightgreen"}}>green</span> correct) or X (<span style={{color: "red"}}>red</span> incorrect) (x)</li>
              <li>Player(s) are only given 15 seconds for each question. Failure to answer a question on time will result in a X.</li>
              <li>If a user accrues 3 checks, they advance to the next round.</li>
              <li>If a user accrues 3 X, they are eliminated and the game ends for them.</li>
            </ul>

            <h3>Round 3: (Single Category Elimination)</h3>
            <h3>Single/Multiplayer:</h3>

            <ul>
              <li>Player(s) will be allowed the choice of 5 different categories to choose from and will automatically be assigned one hard question to answer.</li>
              <li>Player(s) have 30 seconds to answer said question from category.</li>
              <li>Player(s) may wager a certain amount, or all, of their points of theirs so that they may potentially double up on those points if question answered correctly. Question answered wrongly will result in deduction of amount wagered.</li>
            </ul>

            <h3>And Game over! Good job! If multiple players, individual with highest points is victor.</h3>
            
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
