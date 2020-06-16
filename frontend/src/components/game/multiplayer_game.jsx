import React from "react";
import "./game.css";
import RoundOne from "./rounds/round_one";
import RoundOneMult from "./rounds/multiplayer/round_one_mult_container";
import RoundTwoContainer from "./rounds/multiplayer/round_two_multi_container";
import RoundThree from "./rounds/multiplayer/round_three_mult";
import ScoreBoardContainer from "./scoreboard/scoreboard_container";
import GameOver from "./game_over";
import GameOverLost from './game_over_lost';
import HighScores from "./high_scores";
import Clock from "./clock";
import Marquee from "./rounds/multiplayer/marquee";
import { Route, Redirect, withRouter } from "react-router-dom";

// import { socket } from "../../index";

class MultiplayerGame extends React.Component {
  constructor(props) {
    super(props);
    //Need to add current user in State
    this.state = {
      game: null,
      round: 1,
      currentScore: 0,
      round1Score: 0,
      round2Score: 0,
      round3Score: 0,
      players: this.props.players,
      round2RoomNum: null,
      isActive: true,
      round3Players: [],
      testRnd3Plyrs: [],
      round2Players: null

    };

    this.updateScore = this.updateScore.bind(this);
    this.changeRounds = this.changeRounds.bind(this);
    this.fetchCurrentRnd2Score = this.fetchCurrentRnd2Score.bind(this);
    this.multiRound2Setup = this.multiRound2Setup.bind(this);
    this.updateRound2HighScores = this.updateRound2HighScores.bind(this);

    ///The begginning /   /   /
  }

  updateRound2HighScores() {}

  componentDidMount() {

    this.props.socket.off("remove player");

    this.props.socket.on("updated score", ({ player, idx }) => {
      // this.props.players[idx] = player;
      // console.log("UPDATE SCORE ON MULTIPLAYER: ", idx);
      let players = this.state.players || [];
      players[idx] = player;
      this.setState({ players: players });
      this.props.updateRoomScore(players);
    });

    this.props.socket.on("add player to room 3", ({ idx, round2Room }) => {
      console.log("RND 2 DATA PASS", idx);

      //idx = -1 means that a a round two room had only player and they lost
      //We will there for not be adding anyone to a room but just removing the room
      this.props.deleteRound2Rooms(round2Room);

      if (this.props.game && idx > -1) {
        this.props.addToRnd3Room(idx);

        this.setState({
          testRnd3Plyrs: Object.values(this.props.game.data.round3Room)
        });
      }
    });

    this.props.socket.on(
      "update round 2 answers",
      ({ round2Room, players }) => {
        // console.log("RND 2 DATA PASS: ======", round2Room, players);
        if (this.state.round2RoomNum === round2Room) {
          // let opponent = players[this.props.opponentIndex];
          this.setState({
            round2Players: players
          });
        }
        // this.props.updateRnd2GameStat(room2Data);
      }
    );

    this.props.socket.on("change round", () => {
      console.log("doing the change");
      this.changeRounds();
    });

    // this.setState({
    //   currentPlayer: { currentScore: this.state.currentPlayer.currentScore }
    // });
  }

  // comp;

  updateScore(points) {
    if (this.state.currentScore + points < 0) {
      this.setState({
        currentScore: 0
      });
      let player = this.state.players[this.props.index];
      player.isActive.currentScore = 0;
      let room = this.props.game.data.roomId;
      // let idx = this.props.index;
      this.props.socket.emit("update score", {
        room,
        player,
        idx: this.props.index
      });
    } else {
      this.setState({
        currentScore: this.state.currentScore + points
      });

      let player = this.state.players[this.props.index];
      player.isActive.currentScore = this.state.currentScore + points;
      let room = this.props.game.data.roomId;
      // let idx = this.props.index;
      this.props.socket.emit("update score", {
        room,
        player,
        idx: this.props.index
      });
    }
  }

  multiRound2Setup() {
    let players = [];
    if (this.state.players) {
      players = this.state.players.map(plyr => {
        return plyr;
      });
    }
    players.sort((a, b) =>
      a.isActive.currentScore < b.isActive.currentScore ? 1 : -1
    );
    let index = players.findIndex(player => {
      return player.username === this.props.currentUser.username;
    });

    //Splitting up players into heads up object
    let rooms = {};
    let top = true;
    let count = 1;
    while (players.length > 0) {
      if (top) {
        //while(players[0].isActive.isActive === false) ;
        let player = players.shift();
        if (player.username === this.props.currentUser.username) {
          this.setState({
            round2RoomNum: count
          });
        }
        rooms[count] = [player];
        top = false;
      } else {
        //while(players[0].isActive.isActive === false) ;
        let player = players.pop();
        if (player.username === this.props.currentUser.username) {
          this.setState({
            round2RoomNum: count
          });
        }

        rooms[count].push(player);
        count++;
        top = true;
      }
    }
    this.props.createRound2Rooms(rooms);
    // this.props.game.data.round2Rooms;
  }

  updateAllScores() {}

  changeRounds(round = null) {
    console.log("changing rounds", this.state.round);
    if (round === "gameover") {
      this.setState({
        round: 10
      });
    } else if (this.state.round === 1) {
      this.multiRound2Setup();

      this.setState({
        round1Score: this.state.currentScore,
        round: this.state.round + 1
      });
    } else if (this.state.round === 2) {
      this.setState({
        round: this.state.round + 1
      });
    } else if (this.state.round === 3) {
      let calculatedScore = this.state.currentScore - this.state.round1Score;
      if (calculatedScore <= 0) calculatedScore = 0;
      this.setState({
        round2Score: calculatedScore,
        // currentPlayer: {round2Score: (this.state.currentPlayer.currentScore - this.state.currentPlayer.round1Score)},
        round: this.state.round + 1
      });
    } else if (this.state.round === 4) {
      this.setState({
        round: this.state.round + 1
      });
    } else if (this.state.round === 5) {
      let calculatedScore =
        this.state.currentScore -
        this.state.round2Score -
        this.state.round1Score;
      if (calculatedScore <= 0) calculatedScore = 0;
      this.setState({
        round3Score: calculatedScore,
        // currentPlayer: {round3Score: (this.state.currentPlayer.currentScore - this.state.currentPlayer.round1Score - this.state.currentPlayer.round2Score) },
        round: this.state.round + 1
      });
    } else {
      this.setState({
        round: this.state.round + 1
      });
    }
    // console.log(this.state.round)
  }

  fetchCurrentRnd2Score() {
    let score = this.state.currentScore - this.state.round1Score;
    return score;
  }

  componentDidUpdate(prevProps) {
    // if round 3 exists
    //   if prev props of rnd 3 room =! current this.props.rnd3Room
    //     setState
    console.log(
      "CHECKING COMPDIDUPDATE FOR ROUND_3_PLAYERS:   ",
      this.props,
      this.props.game.data.round3Room
    );
    let round3Players;
    // Object.keys(this.props.rnd3Players).length
    // this.state.rnd3Players.length
    if (
      this.props.game.data.round3Room &&
      prevProps.game.data.round3Room != this.props.game.data.round3Room
    ) {
      round3Players = Object.keys(this.props.rnd3Players).map(
        plyr => this.props.rnd3Players[plyr]
      );
      round3Players.sort((a, b) =>
        a.isActive.currentScore < b.isActive.currentScore ? 1 : -1
      );
      //sort

      this.setState({
        round3Players
      });
    }

    // this.updateRound2HighScores();
  }

  render() {
    if (!this.props.rnd1Qs) {
      return <Redirect to="/profile" />;
    }

    // console.log(this.state);

    let questions = this.props.rnd1Qs;
    //console.log(this.new_questions)
    let display;
    if (this.state.round === 1) {
      questions = this.props.rnd1Qs;
      display = (
        <RoundOneMult
          updateScore={this.updateScore}
          changeRounds={this.changeRounds}
          questions={questions}
        />
      );
    } else if (this.state.round === 2) {
      display = (
        <HighScores
          players={this.state.players}
          round={2}
          changeRounds={this.changeRounds}
          socket={this.props.socket}
          room={this.props.game.data.roomId}
        />
      );
    } else if (this.state.round === 3) {
      //Real Round TWO
      questions = this.props.rnd2Qs;
      display = (
        <RoundTwoContainer
          round2Players={this.state.round2Players}
          socket={this.props.socket}
          // updateRnd2GameStat={this.props.updateRnd2GameStat}
          round2RoomNum={this.state.round2RoomNum}
          updateScore={this.updateScore}
          questions={questions}
          changeRounds={this.changeRounds}
          playersIndex={this.props.index}
        />
      );
    } else if (this.state.round === 4) {
      //High Scores AFTER ROUND TWO
      console.log(
        "MULTIPLAYER AFTER RND 2 HIGH SCORES",
        this.props.rnd3Players
      );
      display = (
        <HighScores
          players={this.state.testRnd3Plyrs}
          round={4}
          changeRounds={this.changeRounds}
          socket={this.props.socket}
          room={this.props.game.data.roomId}
          playersReady={this.props.game.data.round2Rooms}
        />
      );
      // high score board for proceed
    } else if (this.state.round === 5) {
      questions = this.props.rnd3Qs;
      display = (
        <RoundThree
          currentUser={this.props.currentUser}
          updateScore={this.updateScore}
          currentScore={this.state.currentScore}
          questions={questions}
          changeRounds={this.changeRounds}
        />
      );
    } else if (this.state.round === 6) {
      //High Score At The End of the Game
      display = (
        <HighScores
          players={this.state.players}
          round={4}
          changeRounds={this.changeRounds}
          round3Score={this.state.round3Score}
        />
      );
      // should be a game over board with high score(s)
    // } else if (this.state.round === 7) {
    //   display = (
    //     <HighScores
    //       players={this.state.players}
    //       changeRounds={this.changeRounds}
    //       round1Score={this.state.round1Score}
    //       round2Score={this.state.round2Score}
    //       round3Score={this.state.round3Score}
    //       currentScore={this.state.currentScore}
    //     />
    //   );
      // should be a game over board
    } else if (this.state.round === 7) {
      display = (
        <GameOver
          // currentUser={this.props.currentUser}
          // rnd3Players={this.state.testRnd3Players}
          players={this.state.players}
          round1Score={this.state.round1Score}
          round2Score={this.state.round2Score}
          round3Score={this.state.round3Score}
          currentScore={this.state.currentScore}
        />
      );
      // should be a game over board
    } else if (this.state.round === 10) {
      display = (
        <GameOverLost />
      )
    }

    return (
      <div className="game-container">
        <ScoreBoardContainer currentScore={this.state.currentScore} />
        {display}

        <Marquee players={this.state.players} />
        {/* <h1>{this.props.currentUser.username}</h1> */}
      </div>
    );
  }
}

export default MultiplayerGame;
