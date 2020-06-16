import React from 'react';
import './game.css'
import '../card/card.css'
import CardContainer from '../card/card_container';
import Card2Container from '../card/card2_container';


class GameCategoryRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allAnswered: false,
            currentRound: this.props.round,
            round2Questions: {},
        }
        // this.round2StateSetup();
        this.round1Display = this.round1Display.bind(this);
        this.round2Display = this.round2Display.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.round2StateSetup = this.round2StateSetup.bind(this);
        this.updateRound2Question = this.updateRound2Question.bind(this);
    }


    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    componentDidMount() {
        if (this.props.round === 3) {
            this.round2StateSetup();
        }
    }

    round2StateSetup() {
        let catName = this.props.category;
        let easy = this.props.questions["easy"];
        this.shuffle(easy);
        let easyQuestion = easy.pop();

        let medium = this.props.questions["medium"];
        this.shuffle(medium);
        let mediumQuestion = medium.pop();

        let hard = this.props.questions["hard"];
        this.shuffle(hard);
        let hardQuestion = hard.pop();


        // console.log(easy);
        // console.log('easy Questions')
        // console.log(medium);
        // console.log(hard);

        this.setState({
            round2Questions: {
                easyQuestion: easyQuestion,
                mediumQuestion: mediumQuestion,
                hardQuestion: hardQuestion,
                easyQuestions: easy,
                mediumQuestions: medium,
                hardQuestions: hard,
            }
        })
        //debugger
    }
    
    round1Display() {
        var value = 0;

        let display = this.props.questions.map(question => {
            value += 100;
            return <CardContainer updateScore={this.props.updateScore} value={value} question={question} />
        });

        let categoryName = this.props.category.split("_").join(" ");
        console.log(categoryName)
        display.unshift(<div className="category-container">{categoryName}</div>)
        return display;
    }

    updateRound2Question(diff) {

        if (diff === "easy") {
            let easyArr = this.state.round2Questions.easyQuestions;
            let newEasyQuestion = easyArr.pop();
            this.setState({
                easyQuestion: newEasyQuestion,
                easyQuestions: easyArr
            })
            return newEasyQuestion;
        } else if (diff === "medium") {
            let mediumArr = this.state.round2Questions.mediumQuestions;
            let newMediumQuestion = mediumArr.pop();
            this.setState({
                mediumQuestion: newMediumQuestion,
                mediumQuestions: mediumArr
            })
            return newMediumQuestion;
        } else if (diff === "hard") {
            let hardArr = this.state.round2Questions.hardQuestions;
            let newHardQuestion = hardArr.pop();
            this.setState({
                hardQuestion: newHardQuestion,
                hardQuestions: hardArr
            })
            return newHardQuestion;
        }

    }


    round2Display() {
        //debugger
        // console.log(this.state.round2Questions);
        let display = 
            [<div className="round-2-card">
                <Card2Container question={this.state.round2Questions.easyQuestion} value={200} rightAnswer={this.props.rightAnswer}  updateScore={this.props.updateScore} updateRound2Question={this.updateRound2Question}/>
                    
            </div>,
            <div className="round-2-card">
                <Card2Container question={this.state.round2Questions.mediumQuestion} value={500} rightAnswer={this.props.rightAnswer}  updateScore={this.props.updateScore} updateRound2Question={this.updateRound2Question}/>
                    
            </div>,
            <div className="round-2-card">
                <Card2Container question={this.state.round2Questions.hardQuestion} value={1000} rightAnswer={this.props.rightAnswer} updateScore={this.props.updateScore} updateRound2Question={this.updateRound2Question}/>
                    
            </div>];
            
            
        return display;
    }

    render() {

        if (!this.state.round2Questions.easyQuestions && this.props.round!=1) {
            return null
        }

        let display;
        //console.log(this.props)
        switch (this.props.round) {
            case 1:
                //console.log("in it")
                display = this.round1Display();
                break;
            case 3:
                display = this.round2Display();
                // console.log(this.state.round2Questions)
                // console.log('In Switch Statement')
                break;

            default:
                break;
        }
        // console.log(display)
        return (
            <div>
                
                <div className="category-ul">
                    {display}
                </div>

            </div>
        )
    }
}

export default GameCategoryRow;

