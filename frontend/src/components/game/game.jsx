import React from "react";
import "./game.css";
import RoundOne from "./rounds/round_one";
import RoundTwoContainer from "./rounds/round_two_container";
import RoundThree from "./rounds/round_three";
import ScoreBoardContainer from "./scoreboard/scoreboard_container";
import GameOver from "./game_over";
import HighScores from "./high_scores";
import Clock from "./clock";

class Game extends React.Component {
  constructor(props) {
    super(props);
    //Need to add current user in State
    this.state = {
      round: 5,
      currentScore: 0,
      round1Score: 0,
      round2Score: 0,
      round3Score: 0,
      currentPlayer: {
        id: this.props.currentUser.id,
        username: this.props.currentUser.username,
        round1Score: 0,
        round2Score: 0,
        round3Score: 0,
        currentScore: 0,
        inGame: true,
        round2Strikes: 0,
        clock: 0,
      },
    };

    this.updateScore = this.updateScore.bind(this);
    this.changeRounds = this.changeRounds.bind(this);
    this.fetchCurrentRnd2Score = this.fetchCurrentRnd2Score.bind(this);
    this.singlePlayerHighScorePass = this.singlePlayerHighScorePass.bind(this);
  }

  componentDidMount() {
    //console.log(this.props)
    this.props.fetchAllQuestions();
    // this.props.fetchUsersInGame();
    this.setState({
      currentPlayer: { currentScore: this.state.currentPlayer.currentScore },
    });
  }

  updateScore(points) {
    if (this.state.currentScore + points < 0) {
      this.setState({
        currentScore: 0,
      });
    } else {
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  changeRounds(round = null) {
    // console.log('changing rounds')
    if (round === "gameover") {
      this.setState({
        round: 10,
      });
    } else if (this.state.round === 1) {
      this.setState({
        round1Score: this.state.currentScore,
        round: this.state.round + 1,
      });
    } else if (this.state.round === 2) {
      this.setState({
        round: this.state.round + 1,
      });
    } else if (this.state.round === 3) {
      let calculatedScore = this.state.currentScore - this.state.round1Score;
      if (calculatedScore <= 0) calculatedScore = 0;
      this.setState({
        round2Score: calculatedScore,
        // currentPlayer: {round2Score: (this.state.currentPlayer.currentScore - this.state.currentPlayer.round1Score)},
        round: this.state.round + 1,
      });
    } else if (this.state.round === 4) {
      this.setState({
        round: this.state.round + 1,
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
        round: this.state.round + 1,
      });
    } else {
      this.setState({
        round: this.state.round + 1,
      });
    }
    // console.log(this.state.round)
  }

  fetchCurrentRnd2Score() {
    let score = this.state.currentScore - this.state.round1Score;
    return score;
  }

  singlePlayerHighScorePass() {
    return [
      {
        username: this.props.currentUser.username,
        isActive: {
          currentScore: this.state.currentScore,
        },
      },
    ];
  }

  render() {
    if (!this.props.rnd1Qs) {
      return null;
    }

    //console.log(this.state.currentPlayer.currentScore);

    let questions;
    //console.log(this.new_questions)
    let display;
    if (this.state.round === 1) {
      questions = this.props.rnd1Qs;
      display = (
        <RoundOne
          updateScore={this.updateScore}
          questions={questions}
          changeRounds={this.changeRounds}
        />
      );
    } else if (this.state.round === 2) {
      display = (
        <HighScores
          players={this.singlePlayerHighScorePass()}
          round={2}
          changeRounds={this.changeRounds}
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
      display = (
        <HighScores
          players={this.singlePlayerHighScorePass()}
          round={4}
          changeRounds={this.changeRounds}
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
      display = (
        <HighScores
          players={this.singlePlayerHighScorePass()}
          round={4}
          changeRounds={this.changeRounds}
          round3Score={this.state.round3Score}
        />
      );
      // should be a game over board with high score(s)
    } else if (this.state.round === 7) {
      display = (
        <HighScores
          players={this.singlePlayerHighScorePass()}
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
      </div>
    );
  }
}

export default Game;
