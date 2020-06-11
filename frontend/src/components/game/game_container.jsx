import { connect } from 'react-redux';
//import Profile from './profile';
import Game from './game';
import {fetchAllQuestions} from '../../actions/questions_actions';
import { fetchUsersInGame } from '../../actions/session_actions';

const mapStateToProps = (state, ownProps) => {
    let questions = state.entities.questions;
    let rnd1Qs = state.entities.questions.round1Questions;
    let rnd2Qs = state.entities.questions.round2Questions;
    let rnd3Qs = state.entities.questions.round3Questions;
    console.log(state)
  return {
    currentUser: state.session.user,
    questions,
    rnd1Qs,
    rnd2Qs,
    rnd3Qs,
    // users: state.
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserData: "currently not fully setup",//id => dispatch(fetchUserData(id))
    fetchAllQuestions: ()=>dispatch(fetchAllQuestions()),
    //fetchUsersInGame: () => dispatch(fetchUsersInGame())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);