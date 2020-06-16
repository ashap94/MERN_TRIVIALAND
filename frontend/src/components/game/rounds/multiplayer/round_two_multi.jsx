import "../../game.css";
// import '../game.css'
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import GameCategoryRow from "../../game_category_row";
import Clock from "../../clock";

class RoundTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      strikes: 0, // if number becomes three,
      rightAnswers: 0,
      opponentStrikes: 0,
      opponentRightAnswers: 0,
      timerSeconds: 120,
      currentPlayers: this.props.currentPlayers
    };
    //React hook for Clock

    //this.props.round2Players

    this.clock = React.createRef();

    // setTimeout(this.props.changeRounds, 6000); // shouldn't have
    this.wrongAnswersDisplay = this.wrongAnswersDisplay.bind(this);
    this.rightAnswer = this.rightAnswer.bind(this);
    this.numWrongRightCheck = this.numWrongRightCheck.bind(this);
    this.setTimer = this.setTimer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.round2Players) {
      let prevPlayer = prevProps.round2Players[this.props.opponentIndex];
      let currentPlayer = this.props.round2Players[this.props.opponentIndex];
      if (
        prevPlayer.strikes != currentPlayer.strikes ||
        prevPlayer.rightAnswers != currentPlayer.rightAnswers
      ) {
        // debugger;
        this.setState({
          // currentPlayers: this.props.round2Players,
          opponentStrikes: currentPlayer.strikes,
          opponentRightAnswers: currentPlayer.rightAnswers
        });
      }
    }
  }

  componentDidMount() {
    console.log("ROUND 2 PLAYERS:   ", this.props);
    // this.props.getQestions();
    // this.props.socket.on(
    //   "update round 2 answers",
    //   ({ round2Room, players }) => {
    //     // console.log("RND 2 DATA PASS: ======", round2Room, players);
    //     if (this.props.round2RoomNum === round2Room) {
    //       let opponent = players[this.props.opponentIndex];

    //       this.setState({
    //         opponentStrikes: opponent.strikes,
    //         opponentRightAnswers: opponent.rightAnswers
    //       });
    //     }

    //     let room2Data = { players: players, round2Room: round2Room };

    //     // this.props.updateRnd2GameStat(room2Data);
    //   }
    // );
  }

  componentWillUnmount() {
    // clearTimeout(this.questionTimer);
  }

  // wrongChoice() {
  //   let players = this.state.currentPlayers.map(plyr => plyr);
  //   let thisPlayer = players[this.props.myIndex];
  //   thisPlayer.strikes++;
  //   players[this.props.myIndex] = thisPlayer;
  //   this.setState({
  //     strikes: this.state.strikes + 1,
  //     rightAnswers: this.state.rightAnswers + 1
  //   });
  //   this.props.socket.emit("updateRnd2", {
  //     round2Room: this.props.round2RoomNum,
  //     players,
  //     room: this.props.socketRoom
  //   });
  //   if (this.state.strikes === 3) {
  //     // logic to use this.changeRounds(3)
  //     // which that logic will stop the game for the user
  //     // back in game
  //   }

  //   this.wrongAnswersDisplay();
  // }

  rightAnswer(answer) {
    // debugger;
    let players = this.state.currentPlayers.map(plyr => plyr);
    let thisPlayer = Object.assign(players[this.props.myIndex], {});

    //calling clock child component reset clock function to display new countdown
    // if (this.clock.current && this.state.rightAnswers < 3) {
    //   this.clock.current.resetClock();
    // }
    // clearTimeout(this.questionTimer);
    // this.setState({
    //   timerSeconds: 7
    // });

    if (answer) {
      thisPlayer.rightAnswers++;

      this.setState({
        rightAnswers: this.state.rightAnswers + 1
      });
    } else {
      thisPlayer.strikes++;

      this.setState({
        strikes: this.state.strikes + 1
      });
    }

    players[this.props.myIndex] = thisPlayer;

    // let room2Data = { players: players, round2Room: this.props.round2RoomNum };

    // this.props.updateRnd2GameStat(room2Data);

    // console.log(
    //   "MY END ROUND 2 DATA PASS:    ",
    //   room2Data.players,
    //   room2Data.round2Room
    // );

    this.props.socket.emit("updateRnd2", {
      round2Room: this.props.round2RoomNum,
      players,
      room: this.props.socketRoom
    });
  }

  numWrongRightCheck() {
    // if (this.state.strikes === 3 || this.state.opponentRightAnswers === 3) {
    //   clearTimeout(this.questionTimer);
    //   setTimeout(() => {
    //     this.props.changeRounds("gameover");
    //   }, 1200);
    // } else if (this.state.rightAnswers === 3 || this.state.opponentStrikes === 3) {
    //   console.log(
    //     "JOINING ROUND 3 ROUND 2 ROOM NUM DELETION:  ",
    //     this.props.round2RoomNum
    //   );
    //   this.props.socket.emit("join room 3", {
    //     round2Room: this.props.round2RoomNum,
    //     room: this.props.socketRoom,
    //     idx: this.props.playersIndex
    //   });
    //   clearTimeout(this.questionTimer);
    //   setTimeout(this.props.changeRounds, 1200);
    // }

    if (this.state.strikes === 3) {
      /*
        The logic below is for players that are in round two rooms
        And is to make sure the room is deleted when the strike out
        we set the index to -1 and check the index at the socket response
      */
      if (
        this.state.currentPlayers[this.props.opponentIndex].username === "Ghost"
      ) {
        this.props.socket.emit("join room 3", {
          round2Room: this.props.round2RoomNum,
          room: this.props.socketRoom,
          idx: -1
        });
      }

      clearTimeout(this.questionTimer);
      setTimeout(() => {
        this.props.changeRounds("gameover");
      }, 1400);
    } else if (this.state.rightAnswers === 3) {
      console.log(
        "JOINING ROUND 3 ROUND 2 ROOM NUM DELETION:  ",
        this.props.round2RoomNum
      );
      this.props.socket.emit("join room 3", {
        round2Room: this.props.round2RoomNum,
        room: this.props.socketRoom,
        idx: this.props.playersIndex
      });
      clearTimeout(this.questionTimer);
      setTimeout(this.props.changeRounds, 1200);
    } else if (this.state.opponentStrikes === 3) {
      console.log(
        "JOINING ROUND 3 ROUND 2 ROOM NUM DELETION:  ",
        this.props.round2RoomNum
      );
      this.props.socket.emit("join room 3", {
        round2Room: this.props.round2RoomNum,
        room: this.props.socketRoom,
        idx: this.props.playersIndex
      });
      clearTimeout(this.questionTimer);
      setTimeout(this.props.changeRounds, 1200);
    } else if (this.state.opponentRightAnswers === 3) {
      clearTimeout(this.questionTimer);
      setTimeout(() => {
        this.props.changeRounds("gameover");
      }, 1400);
    }
  }

  wrongAnswersDisplay() {
    let dispArr = [];
    let numWrong = this.state.strikes;

    for (let i = 0; i < numWrong; i++) {
      dispArr.push(<div className="wrong-answer">X</div>);
    }

    for (let j = 0; j < 3 - numWrong; j++) {
      dispArr.push(<div className="wrong-answer"></div>);
    }
    return dispArr;
  }

  rightAnswersDisplay() {
    let dispArr = [];
    let numRight = this.state.rightAnswers;

    for (let i = 0; i < numRight; i++) {
      dispArr.push(<div className="right-answer">0</div>);
    }

    for (let j = 0; j < 3 - numRight; j++) {
      dispArr.push(<div className="right-answer"></div>);
    }
    return dispArr;
  }



  setTimer() {
    let that = this;
    if (this.state.strikes < 3 && this.state.rightAnswers < 3) {
      this.questionTimer = setTimeout(
        () =>
          that.setState({
            strikes: 3
          }),
        120000
      );
    }
  }

  render() {
    //EveryTime we re-render we want to check if we got three strikes or 3 rights and change roungs if necessary
    this.numWrongRightCheck();
    this.setTimer();

    // console.log("MY STRIKES:   ", this.state.strikes);
    // console.log("MY RIGHT ANSWERS:   ", this.state.rightAnswers);
    // console.log("OPPONENT STRIKES:   ", this.state.opponentStrikes);
    // console.log("OPPONENT RIGHT ANSWERS:   ", this.state.opponentRightAnswers);

    let questionsObject = this.props.questions;
    //let categoryName = Object.keys(questionsObject)
    //let display = <GameCategoryRow round={1} questions={questionsObject[categoryName]}/>
    // Object.keys(questionsObject).map(catName => (<GameCategoryRow updateScore={this.props.updateScore} category={catName} key={catName} round={1} questions={questionsObject[catName]} />))

    let display = (
      <div>
        <h1>Round Two</h1>
      </div>
    );

    let new_display = <h1>Round Two</h1>;

    let rightAnswersDisplay = this.rightAnswersDisplay();
    let wrongAnswersDisplay = this.wrongAnswersDisplay();

    let questions = this.props.questions;

    let catName = Object.keys(this.props.questions)[0];
    // console.log(questions)
    // console.log('ALL QUESTIONS')
    return (
      <div className="game-board-rnd2">
        <div className="game-board-rnd2-left">
          <div className="round-two-rules">
            <h1>Round Two</h1>
            <h1>
              Opponent:{" "}
              {this.state.currentPlayers[this.props.opponentIndex].username}
            </h1>
            <h2>
              Rules: you have 2 minutes to answer any 3 out of 5 questions right
            </h2>
          </div>
          <div className="cat-questions-container">
            <GameCategoryRow
              rightAnswer={this.rightAnswer}
              updateScore={this.props.updateScore}
              category={catName}
              key={catName}
              round={3}
              questions={questions[catName]}
            />
          </div>
        </div>

        <div className="game-board-rnd2-right">
          <div className="rnd2-clock">
            <Clock seconds={120} ref={this.clock} />
          </div>

          <div className="rnd2-username">
            <h1>{this.state.currentUser.username}</h1>
          </div>
          <div className="right-answers">
            <h1>Right Answers</h1>
            {rightAnswersDisplay}
          </div>
          <div className="wrong-answers">
            <h1>Wrong Answers</h1>
            {wrongAnswersDisplay}
          </div>
          <div className="rnd2-player-scores-parent">
            <h1>Player Scores</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default RoundTwo;

/*

<div>
                    <h1>{Object.keys(this.props.questions)[0]}</h1>
                    <div>

                    </div>
                </div>
                <div>

                </div>
                <div className="game-board-rnd2">
                    {display}
                </div>



*/
