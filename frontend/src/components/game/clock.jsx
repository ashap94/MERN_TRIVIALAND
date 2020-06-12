import React, { forwardRef, useRef, useImperativeHandle } from "react";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.seconds,
      mins: 0,
      secs: 0,
      currentUser: this.props.currentUser,
      initialTime: true,
    };
    this.clock = setInterval(this.tick.bind(this), 1000);
    this.resetClock = this.resetClock.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.clock);
  }

  //   initialSeconds() {
  //     if (this.state.time > 0 && this.state.mins === 0 && this.state.secs === 0) {
  //     }
  //   }

  tick() {
    let newTime = this.state.time - 1;
    let newMins = Math.floor(newTime / 60);
    let newSecs = newTime % 60;
    this.setState({
      time: newTime,
      mins: newMins,
      secs: newSecs,
      initialTime: false,
    });
    if (newTime < -1) {
      clearInterval(this.clock);
    }
  }

  resetClock(newClock) {
    let newSecs = newClock || 30;
    this.setState({
      mins: 0,
      secs: newSecs,
      time: this.props.seconds,
    });
  }

  render() {
    // if (this.state.secs === 99 && this.state.mins === 99) {
    //   return null;
    // }
    if (this.state.secs < 1 && this.state.mins < 1) {
      this.resetClock(this.state.time);
    }
    let mins = this.state.time === 120 ? 2 : this.state.mins;
    let secs = this.state.initialTime
      ? Math.floor(this.state.time % 60)
      : this.state.secs > 9
      ? this.state.secs
      : "0" + this.state.secs;
    let display = <div> {`${mins}:${secs}`} </div>;

    return <div>{display}</div>;
  }
}

export default Clock;
