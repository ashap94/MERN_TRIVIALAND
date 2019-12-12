import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Clock from './clock';

class GameOver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // rnd3Players: this.props.testRnd3Players,
            // currentScore: this.props.currentScore,
            // currentUser: this.props.currentUser
        }
        this.startNewGame = this.startNewGame.bind(this);
        this.finalEnd = this.finalEnd.bind(this);
        // setTimeout( startNewGame(), 5000);
    }

    finalEnd () {
        this.props.history.push("/profile");
    }

    startNewGame() {
        setTimeout(this.finalEnd, 5000);
    }
    

    render() {
        // let winner
        // let sorted = this.props.rnd3Players.sort(function(a,b){
        //     return a.isActive.currentScore > b.isActive.currentScore ? 1 : 
        //         a.isActive.currentScore < b.isActive.currentScore ? -1 : 0;
        // });
        // winner = sorted.pop();
        // this.props.players.isActive.currentScore.every(); 
        // debugger
        let display;
        if (this.props.currentScore > 0) {
           display = (
              <div className="game-over-message">
                <h3>Congratulations! You Win!</h3>
              </div>
            );
        } else {
            display = (
              <div className="game-over-message">
                <h1>You lost, better luck next time</h1>
              </div>
            );
        }
        // let display = this.props.currentScore > 0 ? (
        // <div className ='game-over-message'>
        //     <h3>Congratulations! You Win!</h3>
        // </div>
        // ) 
        // : 
        // (
        //     <div className ='game-over-message'>
        //         <h1>Sorry You Lose</h1>
        //     </div>
        // );

        return (
            <div>
                {display}
                <div className="next-round-clock-container">
                    <h2> Starting new Game in: &nbsp;&nbsp;</h2>
                    <Clock seconds={5} />
                    {this.startNewGame()}
                </div>
            </div>
        )

    }
}

export default withRouter(GameOver);