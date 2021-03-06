import React from "react";
import "./game.css";
import RoundOne from "./rounds/round_one";
import RoundOneMult from "./rounds/multiplayer/round_one_mult_container";
import RoundTwoContainer from "./rounds/round_two_container";
import RoundThree from "./rounds/round_three";
import ScoreBoardContainer from "./scoreboard/scoreboard_container";
import GameOver from "./game_over";
import HighScores from "./high_scores";
import Clock from "./clock";
import Marquee from "./rounds/multiplayer/marquee";

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
      index: this.props.index,
      player: this.props.player,
      round2Room: null

      // currentPlayer: {
      //   id: this.props.currentUser.id,
      //   username: this.props.currentUser.username,
      //   round1Score: 0,
      //   round2Score: 0,
      //   round3Score: 0,
      //   currentScore: 0,
      //   inGame: true,
      //   round2Strikes: 0,
      //   clock: 0
      // }
    };

    this.updateScore = this.updateScore.bind(this);
    this.changeRounds = this.changeRounds.bind(this);
    this.fetchCurrentRnd2Score = this.fetchCurrentRnd2Score.bind(this);
    this.multiRound2Setup = this.multiRound2Setup.bind(this);
  }

  componentDidMount() {
    //console.log(this.props)
    // this.props.fetchAllQuestions();
    // this.props.fetchUsersInGame();

    // socket.on("update score", ({ room, game }) => {
    //   socket.to(room).emit("update score", { room, game });
    // });

    this.props.socket.on("remove player", ({ room, game }) => {
      this.props.removePlayerFromGame(game);
    });

    this.props.socket.on("updated score", ({ player, idx }) => {
      // this.props.players[idx] = player;
      let updatedPlayers = this.state.players;
      updatedPlayers[idx] = player;
      this.setState({ players: updatedPlayers });
      this.props.updateRoomScore(updatedPlayers);
    });

    // this.setState({
    //   currentPlayer: { currentScore: this.state.currentPlayer.currentScore }
    // });
  }

  updateScore(points) {
    if (this.state.currentScore + points < 0) {
      this.setState({
        currentScore: 0
      });
      let player = this.state.players[this.state.index];
      player.isActive.currentScore = 0;
      let room = this.props.game.data.roomId;
      // let idx = this.props.index;
      this.props.socket.emit("update score", {
        room,
        player,
        idx: this.state.index
      });
    } else {
      this.setState({
        currentScore: this.state.currentScore + points
      });

      let player = this.state.players[this.state.index];
      player.isActive.currentScore = this.state.currentScore + points;
      let room = this.props.game.data.roomId;
      // let idx = this.props.index;
      this.props.socket.emit("update score", {
        room,
        player,
        idx: this.state.index
      });
    }
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.players !== this.props.players) {
  //     this.setState({ players: this.props.players });
  //   }
  // }

  updateAllScores() {}

  multiRound2Setup() {
    // let players = this.state.players;
    // players.sort((a, b) =>
    //   a.isActive.currentScore < b.isActive.currentScore ? 1 : -1
    // );
    // let index = players.findIndex(player => {
    //   return player.username === this.props.currentUser.username;
    // });
    // this.setState({
    //   players: players,
    //   index: index
    // });
    // //Splitting up players into heads up object
    // let rooms = {};
    // let top = true;
    // let count = 1;
    // while (players.length > 0) {
    //   if (top) {
    //     //while(players[0].isActive.isActive === false) ;
    //     rooms[count] = [players.shift()];
    //     top = false;
    //   } else {
    //     //while(players[0].isActive.isActive === false) ;
    //     rooms[count].push(players.pop());
    //     count++;
    //     top = true;
    //   }
    // }
    // this.props.createRnd2Rooms(rooms);
    // this.props.game.data.round2Heads
    // this.setState({
    //   round1Score: this.state.currentScore,
    //   round: this.state.round + 1,
    //   index: index,
    //   players
    // });
  }

  changeRounds(round = null) {
    // console.log('changing rounds')
    if (round === "gameover") {
      this.setState({
        round: 10
      });
    } else if (this.state.round === 1) {
      // let players = this.state.players;

      // players.sort((a, b) =>
      //   a.isActive.currentScore < b.isActive.currentScore ? 1 : -1
      // );

      // let index = players.findIndex(player => {
      //   return player.username === this.props.currentUser.username;
      // });

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

  render() {
    if (!this.props.rnd1Qs) {
      return null;
    }

    //console.log(this.state.currentPlayer.currentScore);

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
          round={2}
          changeRounds={this.changeRounds}
          players={this.state.players}
        />
      );
    } else if (this.state.round === 3) {
      //Real Round TWO
      questions = this.props.rnd2Qs;
      display = (
        <RoundTwoContainer
          updateScore={this.updateScore}
          questions={questions}
          changeRounds={this.changeRounds}
        />
      );
    } else if (this.state.round === 4) {
      display = <HighScores round={4} changeRounds={this.changeRounds} />;
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
      display = (
        <HighScores
          round={4}
          changeRounds={this.changeRounds}
          round3Score={this.state.round3Score}
        />
      );
      // should be a game over board with high score(s)
    } else if (this.state.round === 7) {
      display = (
        <HighScores
          changeRounds={this.changeRounds}
          round1Score={this.state.round1Score}
          round2Score={this.state.round2Score}
          round3Score={this.state.round3Score}
          currentScore={this.state.currentScore}
        />
      );
      // should be a game over board
    } else if (this.state.round === 8) {
      display = (
        <GameOver
          round1Score={this.state.round1Score}
          round2Score={this.state.round2Score}
          round3Score={this.state.round3Score}
          currentScore={this.state.currentScore}
        />
      );
      // should be a game over board
    }

    return (
      <div className="game-container">
        <ScoreBoardContainer currentScore={this.state.currentScore} />
        {display}

        <Marquee players={this.state.players} />
        {/* <div className="marquee-container">
          <marquee behavior="scroll" direction="right" scrollamount="10">
            <div className="marquee-scores">
              {this.props.players.map(player => (
                <h1>
                  {player.username}: {player.isActive.currentScore} pts
                </h1>
              ))}
            </div>
          </marquee>
        </div> */}
      </div>
    );
  }
}

export default MultiplayerGame;
