const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const Game = require("../../models/Game");
const User = require("../../models/User");
const keys = require("../../config/keys");
const CurrentGameQuestions = require("../../models/CurrentGameQuestions");

router.get("/test", (req, res) => {
  return res.json({ msg: "This is the games route" });
});

//  Route to create a new game (default one player);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log("Create game OBJECT BACKEND: ", req.body);
    const roomId = Math.floor(Math.random() * 10000);
    const isOnePlayerGame = req.body.isOnePlayerGame;
    let user = req.body.user;
    // console.log(
    //   "WHAT DOES USER PAYLOAD LOOK LIKE IN BACKEND:   ",
    //   req.body.user
    // );
    // console.log("WHAT USER MODEL LOOKS LIKE IN BACKEND REQUEST: ", user);
    // console.log("CREATING GAME BACKEND, HERE IS WHAT A USER LOOKS LIKE:  ");

    const updateUser = async user => {
      try {
        var updatedUser = await User.findOneAndUpdate(
          { _id: user.id },
          {
            isActive: {
              isActive: true,
              roomId: null,
              isTurn: true,
              currentScore: 0,
              round1Score: 0,
              round2Score: 0,
              round3Score: 0
            }
          },
          { new: true }
        );
        return updatedUser;
      } catch (err) {
        console.log("ERROR ON CREATING GAME: ", err);
        return err;
      }
    };

    // let updatedUser = updateUser(user);

    // let updatedUser = await updateUser(user);

    // ^^^^^^^^^^^ MAY NEED TO IMPLEMENT THIS ^^^^^^^^^^======

    // updatedUser = await User.findOne({ _id: user.id });
    // console.log("FROM /create route", user);

    //   User.updateOne({ _id:  })
    // });

    // hope with lines of code is that it will tap into current users model
    // and reset scores
    // req.user.currentScore = 0;
    // req.user.round1Score = 0;
    // req.user.round2Score = 0;
    // req.user.round3Score = 0;

    Game.find().then(games => {
      // console.log("IN THE BACKEND LOOKING AT GAMES COLLECTION: ", games);
      let roomIds = games.map(game => {
        return game["roomId"];
      });

      while (roomIds.includes(roomId)) {
        roomId = Math.floor(Math.random() * 10000);
      }

      const newGame = new Game({
        creator: req.user.id,
        round: 1,
        players: [user], // value was req.user.id, but want entire user model
        numberPlayers: 1, // for score update
        roomId: roomId,
        round2Rooms: {},
        round3Room: {},
        isOnePlayerGame: isOnePlayerGame,
        hasStarted: false,
        startedAt: null
      });

      newGame.save().then(game => res.json(game));
    });
  }
);

//  Route to add the signed-in user to existing game

router.patch(
  "/:gameId/addPlayer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let gameId = req.params.gameId;
    let newPlayerId = req.user.id;
    // console.log(
    //   "WHAT THE USER MODEL LOOKS LIKE FOR ADDING PLAYER:   ",
    //   req.body.user
    // );
    // console.log("back it up request", req.user.id);

    const user = req.body.user;

    // const updateUser = async user => {
    //   try {
    //     var updatedUser = await User.findOneAndUpdate(
    //       { _id: user.id },
    //       {
    //         isActive: {
    //           isActive: true,
    //           roomId: null,
    //           isTurn: true,
    //           currentScore: 0,
    //           round1Score: 0,
    //           round2Score: 0,
    //           round3Score: 0
    //         }
    //       },
    //       { new: true }
    //     );
    //     // console.log("updated User Backend Success: ", updatedUser);
    //     return updatedUser;
    //   } catch (err) {
    //     console.log("ERROR ON CREATING GAME: ", err);
    //     return err;
    //   }
    // };

    // let updatedUser = updateUser(user);

    // hope with lines of code is that it will tap into current users model
    // and reset scores
    // req.user.currentScore = 0;
    // req.user.round1Score = 0;
    // req.user.round2Score = 0;
    // req.user.round3Score = 0;

    Game.findOne({ roomId: gameId }).then(game => {
      let players = game["players"].map(player => {
        return player._id;
      });

      if (!players.includes(newPlayerId)) {
        game["players"].push(user);
        game["numberPlayers"] += 1;

        // console.log(
        //   "ADDING PLAYER IN BACKEND HERES WHAT GAME LOOKS LIKE:   ",
        //   game
        // );

        Game.updateOne(
          { roomId: gameId },
          {
            $set: game
          },
          function(err, result) {
            // console.log(err);
            // console.log(result);
          }
        ).then(() => {
          res.json(game);
        });
      } else {
        let index;
        for (let i = 0; i < players.length; i++) {
          if (players[i].username == user.username) {
            index = i;
            break;
          }
        }
        // console.log("")
        console.log(
          "JOINING GAME BEFORE ADDING USER AGAIN:  ",
          game["players"]
        );
        game["players"][index] = user;
        console.log("JOINING GAME AFTER ADDING USER AGAIN:  ", game["players"]);

        Game.updateOne(
          { roomId: gameId },
          {
            $set: game
          },
          function(err, result) {
            // console.log(err);
            // console.log(result);
          }
        ).then(() => {
          res.json(game);
        });
        // console.log(
        //   "ADDING PLAYER IN BACKEND HERES WHAT GAME LOOKS LIKE:   ",
        //   game
        // );
        // res.status(400).json({ error: "User is already in game" });
      }
    });
  }
);

// route to update score each time a player answers a question or is penalized for
// not answering on time

router.patch(
  "/:gameId/updateScore",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // need req.body to have a payload of the current game state updated
    // by a player gaining/losing points from an answered question
    // lines 125 - 139 should be erased because that is only accounting
    // for live changes to backend which we'll deprecate

    let gameId = req.params.gameId;
    let playerId = req.user.id;

    Game.findOne({ roomId: gameId }).then(game => {
      let players = game["players"];

      game["players"].map(player => {
        User.findOne({ _id: player.id }).then(player => {
          return player;
        });
      });

      Game.updateOne(
        { roomId: gameId },
        {
          $set: game
        },
        function(err, result) {
          if (err) console.log(err);
          res.json(result);
        }
      );
    });
  }
);

router.patch("/:gameId/removePlayer", (req, res) => {
  let gameId = req.params.gameId;
  // let playerId = req.body["userId"];
  console.log("REMOVE PLAYER BACKEND INDEX:   ", req.body.removePlayerIndex);

  Game.findOne({ roomId: gameId }).then(game => {
    let players = game["players"];
    let indexToDelete = req.body.removePlayerIndex;
    // ^^ flawed logic, indexOf playerId is not the location in array,
    // it is the player id

    let creator = game["creator"]; // player id of person who created game
    let roomId = game.roomId;

    if (indexToDelete > -1) {
      players.splice(indexToDelete, 1);
      // now check mutated players array if "creator" player id is among any players
      // in current players array, if not, then reassign creator property of game
      // to the id of the first player in the array

      // boolean value to check if creator in array
      let isCreatorInGame = false;
      for (let i = 0; i < players.length; i++) {
        if (players[i]._id === creator) {
          isCreatorInGame = true;
          break;
        }
      }

      if (!isCreatorInGame) {
        game["creator"] = players[0]._id;
      }

      game["players"] = players;

      game["numberPlayers"] -= 1;
      // console.log(
      //   "REMOVED PLAYER FROM LOBBY IN BACKEND, HERE'S NEW GAME POJO:    ",
      //   game
      // );
      Game.updateOne(
        { roomId: gameId },
        {
          $set: game
        },
        function(err, result) {
          console.log(err);
          // console.log(result);
        }
      ).then(() => res.json(game));
    } else {
      return res.status(400).json({ error: "User is not in game" });
    }

    // if (!game.players) {
    //   // delete
    //   CurrentGameQuestions.deleteOne({ roomId: roomId });
    //   Game.deleteOne({ roomId: roomId });
    // }
  });
});

router.patch(
  "/:gameId/startGame",
  //  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let gameId = req.params.gameId;

    //  let requesterId = req.user.id;
    //  console.log(requesterId);

    Game.findOne({ roomId: gameId }).then(game => {
      let creatorId = game["creator"];

      //  console.log(creatorId);
      //  res.json({ msg: [requesterId, creatorId]})
      //  if (creatorId === requesterId) {

      game["hasStarted"] = true;

      Game.updateOne(
        { roomId: gameId },
        {
          $set: game
        },
        function(err, result) {
          console.log(err);
          // console.log(result);
        }
      ).then(updated => res.json(updated));

      // }
      /*
      else {
        return res.status(400).json({ error: "Only game creator can start game" });
      }
      */
    });
  }
);

router.delete("/:gameId/endGame", (req, res) => {
  let gameId = req.params.gameId;

  // Game.findOne({ roomId: gameId}).then( game =>
  Game.deleteOne({ roomId: gameId });

  //   )

  // may need other parameters, but does not seem necessary as of the moment
});

router.get("/getAllGames", (req, res) => {
  Game.find({}, (err, games) => {
    var gameMap = {};

    games.forEach(game => {
      gameMap[game.roomId] = game;
    });

    res.send(gameMap);
  });
});

router.delete("/deleteAllGames", (req, res) => {
  Game.find({}, (err, games) => {
    var gameMap = {};

    games.forEach(game => {
      game.remove();
    });

    // res.send(gameMap);
  });
});

router.get("/getGame/:gameId", (req, res) => {
  let roomId = req.params.gameId;
  Game.findOne({ roomId }).then(game => res.json(game));
});

module.exports = router;
