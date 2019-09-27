import React from 'react';
import './card.css'

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // users: Object.values(this.props.allUsers),
                              // if users.length >= 4, implement algorithm below
            timesAllowed: 1,  // n = Math.floor( users.length * 0.5), 
            flipped: false,

        }
    }
    
    componentDidMount() {
        console.log(this.props)
    }

    flipCard(){
        console.log("in flip function")
        this.setState({
            flipped:!this.state.flipped
        })
    }

    answerQuestion(points, answer, correctAnswer){
        console.log(points);
        console.log(answer);
        console.log(correctAnswer);
        if (answer === correctAnswer) {
            this.props.updateScore(points);
        } else {
            this.props.updateScore(-points);
        }
    }
   
    
    render() {
        let value = this.props.value;

        let question = this.props.question;
        let correctAnswer = this.props.question.correct_answer
        //let answers = this.props.question.incorrect_answers;
        let answers = [...this.props.question.incorrect_answers]
        let randomIndex = Math.floor(Math.random() * (answers.length+1))
        answers.splice((randomIndex), 0, correctAnswer);

        let flippedToggle;
        let flippedToggle2;
        if (this.state.flipped){
            flippedToggle = "card is-flipped";
            flippedToggle2 = "card-top-container more-flip"
        }else{
            flippedToggle = "card"
            flippedToggle2 = "card-top-container"
        }

        let answersArray = answers.map(answer=>(<div onClick={()=>this.answerQuestion(value, answer, correctAnswer)} className="answer-container">{answer}</div>))

        let questionAnswerDisplay = this.props.question.questionType === "boolean"?
            (<div className="card-question">
                <h1>{question.question}</h1>
                <ul className="answers-list">
                {answersArray}
                </ul>  
            </div>
            )
            :
            (<div className="card-question">
                <h1>{question.question}</h1>
                <ul className="answers-list">
                    {answersArray}
                </ul>
            </div>
            
        )

        let display = (
                <div className="scene" onClick={()=>this.flipCard()}>

                    <div className={flippedToggle}>

                        <div className="card-face card-face-front ">
                            <h1>{value}</h1>
                        </div>

                        <div className="card-face new_card-face-back">
                            {questionAnswerDisplay}
                        </div>

                    </div>
                
                </div>
            )

        return(
            <div className={flippedToggle2}>
                {display}
            </div>
        )
    }
}

export default Card;
