import React from "react";
import { Link, withRouter } from "react-router-dom";
import Clock from "./clock";

class GameOverLost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.startNewGame = this.startNewGame.bind(this);
    this.finalEnd = this.finalEnd.bind(this);
    // setTimeout( startNewGame(), 5000);
  }

  finalEnd() {
    this.props.history.push("/profile");
  }

  startNewGame() {
    setTimeout(this.finalEnd, 5000);
  }

  render() {
    let display = (
        <div className="game-over-message">
          <h1>You lost, better luck next time </h1>
        </div>
      );

    return (
      <div>
        {display}
        <div className="next-round-clock-container">
          <h2> Starting new Game in: &nbsp;&nbsp;</h2>
          <Clock seconds={5} />
          {this.startNewGame()}
        </div>
      </div>
    );
  }
}

export default withRouter(GameOverLost);
