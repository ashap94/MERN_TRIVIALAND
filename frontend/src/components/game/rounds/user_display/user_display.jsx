import React from "react";
import "../../../css/game.css";
import Clock from "../../clock";
import CardContainer3 from "../../../card/card3_container";

//import ScoreBoard from '.scoreboard.js'

class HighScore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wagerAmount: 0,
      wagerPercentage: 0,
      miniRound: 0,
      disableSlider: true,
    };
    //setTimeout(this.props.changeRounds, 10000);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.clock = React.createRef();
    this.toggleSlider = this.toggleSlider.bind(this);
  }

  componentDidMount() {}

  handleSliderChange(field) {
    //console.log(this.props.currentScore)
    return (e) =>
      this.setState({
        wagerPercentage: e.currentTarget.value,
        [field]: Math.floor(
          (e.currentTarget.value / 100) * this.props.currentScore
        ),
      });
  }

  handleParentWagerChoice(allIn) {
    this.setState({
      wagerPercentage: 100,
      wagerAmount: allIn,
    });
    this.disableSlider();
  }

  toggleSlider() {
    this.setState({
      disableSlider: !this.state.disableSlider,
    });
    this.props.updateWager(this.state.wagerAmount);
  }

  changeMiniRound(roundNum) {
    // console.log("userdisplay-changeminirouind")
    this.setState({
      miniRound: roundNum,
    });
  }

  render() {
    if (0) {
      return null;
    }
    // console.log(this.state);
    //this.props.updateWager(this.state.wagerAmount);
    //console.log(this.state.wagerPercentage);

    let display = <h1>User stuff goes here</h1>;
    let question = this.props.question;
    let questionPlaceHolder = {};
    let cardDisplay =
      question && this.state.miniRound === 3 ? (
        <CardContainer3
          updateScore={this.props.updateScore}
          value={this.state.wagerAmount}
          question={question}
        />
      ) : (
        <div className="rnd3-unflipped-card">{this.state.wagerAmount}</div>
      );
    //:(<CardContainer3 updateScore={this.props.updateScore} value={this.state.wagerAmount} question={questionPlaceHolder}/>)

    return (
      <div className="rnd3-main-user-container">
        <div className="rnd_3_user_display_clock">
          <h1>Clock:&nbsp;&nbsp;</h1>
          <span className="rnd-3-clock">
            <Clock
              seconds={this.state.miniRound === 3 ? 30 : 10}
              ref={this.clock}
            />
          </span>
        </div>

        <div className="rnd_3_user_display_clock">
          <h1>Username:&nbsp;&nbsp;</h1>
          <span>{this.props.currentUser.username}</span>
        </div>

        <div className="rnd3_chosen_category">
          <h1>
            Your Category:
            <h6 className="user_display_category_title">
              {this.props.chosenCategory}
            </h6>
          </h1>
        </div>

        <div className="slider_container">
          <p>How Much Do You Wager:</p>
          <input
            disabled={this.state.disableSlider}
            onChange={this.handleSliderChange("wagerAmount")}
            className="wager-input"
            type="range"
            value={this.state.wagerPercentage}
          />
        </div>

        <div className="wager_card">{cardDisplay}</div>
      </div>
    );
  }
}

export default HighScore;
