import { connect } from "react-redux";
import * as GameAction from "../../actions/game_actions";
import * as GameUtil from "../../util/game_util";
import { emitSetup, onSetup } from "../../util/socket_util";
import GameLobby from "./game_lobby";
import { fetchAllQuestions } from "../../util/questions_util";

const msp = (state, ownProps) => {
  let currentUser = state.session.user;
  const socket = ownProps.socket;
<<<<<<< HEAD
  let players = state.entities.game.data.players;
  let currentPlayer = players.find(player => {
    return currentUser.username == player.username;
  });
=======
  let game;
  let players;
  if (state.entities.game.data){
    game = state.entities.game;
    players = state.entities.game.data.players;
  }
>>>>>>> 7f3d5bcee11791c7224b9be15fd8995b0e4d276c
  return {
    currentUser: currentUser,
    game: game,
    socket,
    state,
    players: players,
    currentPlayer
  };
};

const mdp = dispatch => {
  // all the commented out functions are thunk actions,
  // startgame and updateRoomScore actions sent to the reducers to
  // optimize speed, remove player, endGame, and addPlayer are the only
  // thunk functions as of the moment, may change logic if speed is really,
  // hindered
  return {
    // startGame: (gameId) => dispatch(GameAction.startNewGame(gameId)),
    // updateScore: (gameId) => dispatch(GameAction.updateScore(gameId)),

    addPlayer: gameId => dispatch(GameAction.addPlayer(gameId)),
    removePlayer: payload => dispatch(GameAction.removePlayer(payload)),
    endGame: gameId => dispatch(GameAction.endCurrentGame(gameId)),

    // below regular action creators

    // USING THIS ACTION CREATOR FOR TRUNCATING DUPLICATE PLAYERS ON COMPONENTWILLUNMOUNT
    startGame: game => dispatch(GameAction.startGame(game)),
    // USING THIS ACTION CREATOR FOR TRUNCATING DUPLICATE PLAYERS ON COMPONENTWILLUNMOUNT

    updateRoomScore: game => dispatch(GameAction.updateRoomScore(game)),

    fetchAllQuestions: () => dispatch(fetchAllQuestions()),
    fetchCurrentGame: roomId => dispatch(GameAction.fetchCurrentGame(roomId))

    // util for the response and then utilize action object creator
    // to send to store
  };
};

export default connect(msp, mdp)(GameLobby);
