import React from 'react';
import '../../css/game.css'
import GameCategoryRow from '../game_category_row';
import Clock from '../clock';
import UserDisplay  from './user_display/user_display';

class RoundThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            miniRound: 0,
            highlightRoundInstructions: "",
            regularRoundInstructions: "",
            currentUser: this.props.currentUser,
            currentUserTurn: true,
            currentUsersCategory: "",
            currentUsersWager: 0,
            allCategoriesNamesArr: [],
            showingCategoriesArr: [],
            questionAnswered: false
        }
        // setTimeout(this.props.changeRounds, 6000);
        

        this.getAllCategories = this.getAllCategories.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.changeMiniRound = this.changeMiniRound.bind(this);
        this.updateWager = this.updateWager.bind(this);
        this.endRound = this.endRound.bind(this);
        this.updateScore = this.updateScore.bind(this);

        //React Hooks
        this.userDisplay = React.createRef();
    }
    
    componentDidMount() {
        //console.log(this.props)
        // this.props.getQestions();
        this.getAllCategories();
        this.changeMiniRound();  
    }

    removeCategory = cat => {
        //console.log(this.state.allCategoriesNamesArr.length)
        if (this.state.allCategoriesNamesArr.length<1){
            this.getAllCategories();
        }else{
            this.setState(state => {
    
                let showingCategoriesArr = state.showingCategoriesArr.filter((item) => cat !== item);
                let allCategoriesNamesArr = state.allCategoriesNamesArr;
                showingCategoriesArr = showingCategoriesArr.concat(allCategoriesNamesArr.shift());
                return {
                    showingCategoriesArr,
                    allCategoriesNamesArr
                };
            });
        }

    };


    updateWager(amount){
        // console.log()
        this.setState({
            currentUsersWager: amount,
        })
    }

    updateScore(amount){
        this.props.updateScore(amount);
        this.setState({
            questionAnswered:true
        })
    }

    ranOutOfTimeUpdateScore(){
        this.props.updateScore(-this.currentUsersWager);
    }
    
    getAllCategories(){
        let allCategories = Object.keys(this.props.questions);
        let display5Categories = allCategories.slice(0,5);
        let leftOver = allCategories.slice(5);
        this.setState({
            allCategoriesNamesArr: leftOver,
            showingCategoriesArr: display5Categories
        })
        //console.log(display5Categories)
        //console.log(this.state);

    }


    chooseCategory(category){
        // console.log(category)
        this.removeCategory(category)
        this.setState({
            currentUserTurn: true,
            currentUsersCategory: category,
        })
        
        //this.changeMiniRound();
    }

    endRound(){
        if(this.state.questionAnswered){
            this.props.changeRounds();
        }else{
            this.updateScore(-1*this.state.currentUsersWager);
            this.props.changeRounds();
        }
    }

    changeMiniRound(nextRound){
        if(this.miniRoundTimer) clearTimeout(this.miniRoundTimer)

        // console.log(this.state.miniRound);

        switch (this.state.miniRound) {
            case 0:
                this.miniRoundTimer = setTimeout(this.changeMiniRound,10000)
                break;
            case 1:
                if(!this.state.currentUsersCategory) this.chooseCategory(this.state.showingCategoriesArr[0]);
                if(this.userDisplay.current) this.userDisplay.current.toggleSlider();
                this.miniRoundTimer = setTimeout(this.changeMiniRound,10000)
                break;
            case 2:
                // console.log(this.state.currentUsersWager)
                if(this.userDisplay.current) {
                    this.userDisplay.current.toggleSlider();
                    this.userDisplay.current.changeMiniRound(3)
                    this.miniRoundTimer = setTimeout(this.changeMiniRound,15000)
                }
                break;

            case 3:         
                setTimeout(this.endRound(),1200);
                break;
                    
            default:
                break;
        }

        this.setState({
            miniRound: this.state.miniRound + 1,
        });
    }

    render() {
        let questionsObject = this.props.questions;
        let allCategories = Object.keys(questionsObject);
        //console.log(allCategories)
        let questions = questionsObject[this.state.currentUsersCategory]
        let question;
        if (questions){
            questions = (questions["hard"])
            question = questions[Math.floor(Math.random() * (questions.length+1))]
        }
        //let categoryName = Object.keys(questionsObject)
        //let display = <GameCategoryRow round={1} questions={questionsObject[categoryName]}/>

        let display = "This will hold all other players of shrink to nothing";
        let currentCategories = "";
        let playersTurnDisplay = this.state.currentUserTurn? 
        (<div className="rnd-3-category-container">
            <h1 className="rnd-3-cat-title">Choose Your Final Category</h1>
            <h1 className="rnd-3-cat-instructs-first">All Questions Are Hard</h1>
            <h1 className={this.state.miniRound === 1? "rnd-3-cat-instructs instructs-bold" : "rnd-3-cat-instructs"}>1: You have 10 Seconds to choose your category</h1>
            <h1 className={this.state.miniRound === 2? "rnd-3-cat-instructs instructs-bold" : "rnd-3-cat-instructs"}>2: You have 10 Seconds to choose your wager</h1>
            <h1 className={this.state.miniRound === 3? "rnd-3-cat-instructs instructs-bold" : "rnd-3-cat-instructs"}>3: You have 15 Seconds to Answer</h1>
            {(this.state.currentUsersCategory)?
                (<div className="rnd-3-cat-selector">{this.state.currentUsersCategory.split("_").join(" ")}</div>)
                :
                this.state.showingCategoriesArr.map(category=>(<div className="rnd-3-cat-selector" onClick={()=>this.chooseCategory(category)}>{category.split("_").join(" ")}</div>))
            }
        </div>)
        :
        (<div>
            <h1>"it is NOT the users turn"</h1>
        </div>);
        
        //Object.keys(questionsObject).map(catName => (<GameCategoryRow updateScore={this.props.updateScore} category={catName} key={catName} round={1} questions={questionsObject[catName]}/>))
        //Categories to choose from
        let categoriesDisplay = "";
        
        //console.log("category: "+categoryName)
        
        return(
            <div className="game-board-rnd3">
                <div className="game-board-rnd3-choose-category-display">
                    {playersTurnDisplay}
                </div>

                <div className="game-board-rnd3-title">
                    <h1 className="rnd_3_title">Round Three</h1>
                </div>

                <div className="game-board-rnd3-main-user">
                    <UserDisplay currentUser={this.props.currentUser} updateWager={this.updateWager} ref={this.userDisplay} currentScore={this.props.currentScore} updateScore={this.updateScore} question={question} chosenCategory={this.state.currentUsersCategory}/>
                </div>
                
            </div>
        )
    }
}

export default RoundThree;