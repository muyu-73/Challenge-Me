// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookie = require("cookie");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const session = require("express-session");
const http = require("http");
const sharedsession = require("express-socket.io-session");

// DB
const db = require("./util/database");
const sequelize = require("./models").sequelize;
const { users, topics, questions, rooms, usersinrooms } = require("./models");
/*
  ******* Data types *******
  User:
    Attributes:
      - (string) username
      - (string) password
      - (string) userprofilephoto
      - (number) totalscore
  Usersinrooms:
    Attributes:
      - (uuid) roomid
      - (string) username
      - (string) pid
      - (number) userstatus
      - (number) score
  Rooms:
    Attributes:
      - (uuid) roomid
      - (string) username
      - (pid) string
      - (number) status
      - (number) numofuser
      - (string) host
      - (string) topicname
      - (number) type
      - (number) currquestion
      - (number) numofuser
      - (uuid) q1
      - (uuid) q2
      - (uuid) q3
      - (uuid) q4
      - (uuid) q5
  Questions:
    Attributes:
      - (uuid) qid
      - (string) questionphoto
      - (string) questiontext
      - (char) answerletter
      - (string) topicname
      - (string) optiona
      - (string) optionb
      - (string) optionc
      - (string) optiond
  Topic:
    Attributes:
      - (string) topicname
      - (string) topicphoto
*/

// Test DB connection
db.authenticate()
  .then(() =>
    console.log(
      "Postgres DB sequelize connection has been established successfully."
    )
  )
  .catch((err) =>
    console.log("Unable to connect to Postgres DB sequelize:", err)
  );

const app = express();

const httpServer = http.createServer(app);

const config = { origin: true, credentials: true };
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);
app.options(process.env.ORIGIN || "*", cors(config));

const io = require("socket.io")(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080; // If need change backend port, change it at .env file.

const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true, // When deploy, uncomment secure, cuz it becomes https, rn it is http.
    httpOnly: true,
    sameSite: true,
  },
});

app.use(sessionMiddleware);

let isAuthenticated = function (req, res, next) {
  if (!req.session.username)
    return res.status(401).end({ error: "access denied" });
  next();
};

/**
 * Return seesion cookie if create account sucessfully
 * @param {string} username
 * @param {string} password
 */
app.post(
  "/api/v1/signup",
  body("username").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim().escape(),
  body("confirmPassword").not().isEmpty().trim().escape(),
  async (req, res, next) => {
    let errors = [];
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!username || !password || !confirmPassword) {
      errors.push({ message: "Fileds are missing" });
    }
    const length = password.length;

    const usernameReg = new RegExp(/^[A-z0-9-_]{5,12}$/);
    if (!usernameReg.test(username)) {
      errors.push({ message: "Username doesn't not meet the requriement" });
    }

    if (length > 24 || length < 8) {
      errors.push({
        message: "Password's length must in the range of 6 to 16 ",
      });
    }

    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    if (!isContainsUppercase.test(password)) {
      errors.push({
        message: "Password must have at least one Uppercase Character",
      });
    }

    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    if (!isContainsLowercase.test(password)) {
      errors.push({
        message: "Password must have at least one Lowercase Character",
      });
    }

    const isContainsNumber = /^(?=.*[0-9]).*$/;
    if (!isContainsNumber.test(password)) {
      errors.push({ message: "Password must contain at least one Digit" });
    }

    const isContainsSymbol = /^(?=.*[!@#\$%\^&\*]).*$/;
    if (!isContainsSymbol.test(password)) {
      errors.push({
        message: "Password must contain at least one Special Symbol",
      });
    }

    if (errors.length > 0) {
      return res.status(400).send({ message: errors });
    } else {
      try {
        let alreadyIn = await users.findByPk(username);
        if (alreadyIn != null) {
          return res.status(404).send({ message: "User already exist" });
        } else {
          const avaPath = "./profile/userDefault.png";
          const hashedPassword = await bcrypt.hash(password, 10);
          try {
            let newUser = await users.create({
              username: username,
              password: hashedPassword,
              userprofilephoto: avaPath,
            });
            req.session.username = username;
            res.setHeader(
              "Set-Cookie",
              cookie.serialize("username", username, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: true,
                sameSite: true,
              })
            );
            return res.json(username);
          } catch (err) {
            return res.status(500).send(err.message);
          }
        }
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  }
);

/**
 * Return seesion cookie if username match paaword in db
 * @param {string} username
 * @param {string} password
 */
app.post(
  "/api/v1/login/",
  body("username").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim().escape(),
  async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(400).send({ message: "Fileds are missing" });
    }
    try {
      let currUser = await users.findByPk(username);
      if (currUser === null) {
        return res.status(404).send({ message: "User not find" });
      } else {
        bcrypt.compare(password, currUser.password, (err, isMatch) => {
          if (isMatch) {
            req.session.username = username;
            res.setHeader(
              "Set-Cookie",
              cookie.serialize("username", username, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: true,
                sameSite: true,
              })
            );
            return res.json(username);
          } else {
            return res
              .status(401)
              .send({ message: "Username and password doesn't match" });
          }
        });
      }
    } catch (err) {
      return res.status(500).end(err);
    }
  }
);

/**
 * Destory user session cookie
 * @param {string} username
 * @param {string} password
 */
app.get("/api/v1/signout/", async function (req, res, next) {
  req.session.destroy();
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("connect.sid", "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: true,
      sameSite: true,
    })
  );
  return res.send({ message: "Successfully Logout" });
});

/**
 * Return the peerIDs in a room
 *
 * @param {uuid} roomID: the roomID you are currently on
 * @param {name} name: your name in the room so won't return your own peerID
 */
async function findPeersID(roomID, name) {
  let peersID = [];
  await usersinrooms
    .findAll({
      wehre: {
        roomid: roomID,
      },
    })
    .then(function (res) {
      res.map((row) => {
        if (row.dataValues.username !== name) {
          peersID.push(row.dataValues.pid);
        }
      });
    });
  return peersID;
}

/**
 * Return the peerIDs in a room
 *
 * @param {number} question: the number of questions you want
 * @param {string} topicName: the topic name for questions
 */
async function getQuestions(num, topicName) {
  let pickedquestions = [];
  await questions
    .findAll({
      order: sequelize.random(),
      limit: num,
      where: {
        topicname: topicName,
      },
    })
    .then(function (res) {
      res.map((row) => {
        pickedquestions.push(row.dataValues);
      });
    });
  return pickedquestions;
}

/**
 * Return the the roomID and number of user in room in sucess
 * or return error message
 *
 * @param {string} name: your username
 * @param {string} peerID: your peerID
 * @param {topicName} topicName: use to the question related to the topic
 * @param {number} type: 1 for private room, 2 for public room
 * @param {socket} socket: socket to emit event back to user
 */
async function createRoom(name, peerID, topicName, type, socket) {
  try {
    const pickedquestions = await getQuestions(5, topicName);
    let a, b, c, d, e;
    [a, b, c, d, e] = pickedquestions.values();
    const newRoom = await rooms.create({
      numofuser: 1,
      topicname: topicName,
      host: name,
      type: type,
      q1: a.qid,
      q2: b.qid,
      q3: c.qid,
      q4: d.qid,
      q5: e.qid,
    });
    if (newRoom) {
      usersinrooms
        .create({
          roomid: newRoom.roomid,
          username: name,
          pid: peerID,
        })
        .then(async function (res) {
          await socket.join(newRoom.roomid);
          io.in(newRoom.roomid).emit("joined room", newRoom.roomid, 1);
          io.to(socket.id).emit("new player");
        });
    }
  } catch (e) {
    console.log(e);
    io.to(socket.id).emit(
      "unable to join",
      "something went wrong when created room"
    );
  }
}

/**
 * Return the the roomID and number of user in room in sucess, add player to a socket room
 * or return error message
 *
 * @param {uuid} roomID: your room
 * @param {string} name: your username
 * @param {string} peerID: your peerID
 * @param {socket} socket: socket to emit event back to user
 */
async function joinRoom(roomID, name, peerID, socket) {
  try {
    let room = await rooms.findOne({
      where: {
        roomid: roomID,
      },
    });
    const length = room.numofuser;
    if (length >= 4) {
      io.to(socket.id).emit("unable to join", "room is full");
      return;
    } else if (room.status === 1) {
      io.to(socket.id).emit("unable to join", "game is in progress");
      return;
    } else {
      const peersID = await findPeersID(room.roomid, name);
      usersinrooms
        .create({
          roomid: roomID,
          username: name,
          pid: peerID,
        })
        .then(async function (res) {
          await socket.join(roomID);
          io.in(roomID).emit("joined room", roomID, length + 1);
          rooms.update(
            { numofuser: length + 1 },
            {
              where: {
                roomid: roomID,
              },
            }
          );
          io.to(socket.id).emit("new player", peersID);
        });
    }
  } catch (e) {
    console.log(e);
    io.to(socket.id).emit(
      "unable to join",
      "something went wrong when joined room"
    );
  }
}

/**
 * Return a list of username and corrsopding avatar in a room
 * or return error message
 *
 * @param {uuid} roomID: your room
 */
async function getPlayerInfo(roomID) {
  const players = await usersinrooms.findAll({
    where: {
      roomid: roomID,
    },
  });
  if (players) {
    let player_info = await Promise.all(
      players.map(async function (player) {
        const user = await users.findByPk(player.username);
        if (user) {
          return [user.username, user.userprofilephoto, player.score];
        } else {
          return ["unknown", "unknown", 0];
        }
      })
    );
    return player_info;
  }
}

/**
 * Return the the roomID, number of user, peersID,
 * ,playerInfo in room, add player to a socket room  in sucess
 * or return error message
 *
 * @param {uuid} roomID: your room
 * @param {string} name: your username
 * @param {string} peerID: your peerID
 * @param {socket} socket: socket to emit event back to user
 */
async function rejoinRoom(roomID, name, peerID, socket) {
  try {
    usersinrooms
      .update(
        { pid: peerID },
        {
          where: {
            username: name,
          },
        }
      )
      .then(async function (res) {
        const room = await rooms.findByPk(roomID);
        if (room) {
          await socket.join(room.roomid);
          const peersID = await findPeersID(room.roomid, name);
          io.to(socket.id).emit("new player", peersID);
          io.in(roomID).emit("joined room", room.roomid, room.numofuser);
          //get player avatar and socre if game is in progress
          if (room.status === 1) {
            const player_info = await getPlayerInfo(roomID);
            io.to(socket.id).emit("players info", player_info);
          }
        }
      });
  } catch (e) {
    io.to(socket.id).emit(
      "unable to join",
      "something went wrong when joined room"
    );
    console.log(e);
  }
}

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, socket.request.res || {}, next);

io.use(wrap(sessionMiddleware));

io.on("connection", (socket) => {
  socket.on("join room", async (roomID, name, peerID, topicName, type) => {
    try {
      let gameroom = await usersinrooms.findOne({
        where: {
          username: name,
        },
      });
      if (gameroom) {
        rejoinRoom(gameroom.roomid, name, peerID, socket);
        return;
      } else if (roomID) {
        joinRoom(roomID, name, peerID, socket);
      } else {
        createRoom(name, peerID, topicName, type, socket);
      }
    } catch (e) {
      io.to(socket.id).emit(
        "unable to join",
        "something went wrong when created room"
      );
      console.log(e);
    }
  });

  /**
   * Remove user from gameroom if room is wait to start
   * Emit an event with disconnect player peerID to other user in room
   * Change host in the room if disconnect player is a host in the room
   *
   * @param {string} name: your username
   * @param {uuid} roomID: your room
   */
  socket.on("dis", async function (user, roomID) {
    try {
      if (roomID && user) {
        let room = await rooms.findByPk(roomID);
        const usedRoom = await usersinrooms.findOne({
          where: {
            username: user,
          },
        });

        if (usedRoom) {
          if (room.status === 0 || room.status === 2) {
            usersinrooms
              .destroy({
                where: {
                  username: user,
                },
              })
              .then(async function (res) {
                length = room.numofuser - 1;
                if (length === 0) {
                  rooms.destroy({
                    where: {
                      roomid: roomID,
                    },
                  });
                } else {
                  if (room.host === user) {
                    const newHost = await usersinrooms.findOne({
                      where: {
                        roomid: room.roomid,
                      },
                    });
                    rooms.update(
                      { numofuser: length, host: newHost.username },
                      {
                        where: {
                          roomid: roomID,
                        },
                      }
                    );
                    socket.to(roomID).emit("new host", newHost.username);
                  } else {
                    rooms.update(
                      { numofuser: length },
                      {
                        where: {
                          roomid: roomID,
                        },
                      }
                    );
                  }
                  socket.to(roomID).emit("player left", usedRoom.pid, length);
                }
              });
          } else {
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  /**
   * Set up time to emit question to user
   * Notify user in room game has start
   * Change room status to in game
   *
   * @param {uuid} roomID: your room
   */
  socket.on("start game", async function (roomID) {
    try {
      if (roomID) {
        const player_info = await getPlayerInfo(roomID);
        io.in(roomID).emit("players info", player_info);
      }

      const room = await rooms.findByPk(roomID);
      if (room) {
        rooms.update(
          { status: 1 },
          {
            where: {
              roomid: roomID,
            },
          }
        );
        for (let i = 0; i < 5; i++) {
          const index = "q" + (i + 1);
          const question = await questions.findByPk(room[index]);
          setTimeout(function () {
            io.in(roomID).emit("question", question);
          }, i * 10000);
        }
        setTimeout(async function () {
          const players = await usersinrooms.findAll({
            where: {
              roomid: roomID,
            },
          });
          let score = {};
          players.map(function (player) {
            score[player.username] = player.score;
          });
          rooms.update({ status: 2 }, { where: { roomid: roomID } });
          io.in(roomID).emit("end", score);
        }, 52000);
      } else {
        io.in(roomID).emit("error", "something went wrong");
      }
    } catch (e) {
      io.in(roomID).emit("error", "something went wrong");
      console.log(e);
    }
  });

  /**
   * emit the score to add to user in in room for right answere
   *
   * @param {uuid} roomID: your room
   * @param {number} score: score to add
   * @param {username} username: user to be added score
   */
  socket.on("answer", async function (roomID, score, username) {
    try {
      const gameroom = await usersinrooms.findOne({
        where: {
          username: username,
        },
      });
      if (gameroom) {
        score = gameroom.score + score;
        usersinrooms.update(
          { score: score },
          {
            where: {
              username: username,
            },
          }
        );
        io.in(roomID).emit("add score", score, username);
      }
    } catch (e) {
      console.log(e);
      io.to(socket.id).emit("error", "something went wrong");
    }
  });
});

// get user's avatar
app.get("/api/v1/getAvatar", isAuthenticated, async function (req, res, next) {
  const username = req.session.username;

  try {
    let currAvatar = await users.findByPk(username);
    if (currAvatar === null) {
      return res.status(404).send({ message: "User not find" });
    } else {
      return res.json({ message: currAvatar.userprofilephoto });
    }
  } catch (err) {
    return res.status(500).send({ message: "Fail get avatar." });
  }
});

/**
 * Change user avatar
 *
 * @param {string} avaPath: path for profile
 */
app.patch(
  "/api/v1/updateAvatar",
  isAuthenticated,
  async function (req, res, next) {
    const username = req.session.username;
    const avaPath = req.body.avaPath;
    if (!username || !avaPath) {
      return res.status(400).send({ message: "Fileds are missing" });
    }
    try {
      let currAvatar = await users.findByPk(username);
      if (currAvatar === null) {
        return res.status(404).send({ message: "User not find" });
      } else {
        await users.update(
          { userprofilephoto: avaPath },
          {
            where: {
              username: username,
            },
          }
        );
        return res
          .status(200)
          .send({ message: "Update profile photo successfully" });
      }
    } catch (err) {
      return res.status(500).send({ message: "Fail get avatar." });
    }
  }
);

/**
 * Return all topics names
 *
 * @param {num} number: number of topic you want
 */
app.get("/api/v1/topics", async (req, res) => {
  try {
    let topicsList = await topics.findAll();
    return res.send(topicsList);
  } catch (err) {
    return res.status(500).send({ message: "Fail to get topics." });
  }
});

// add a new topic (ONLY use for develop purpose)
app.post("/api/v1/topics", async (req, res) => {
  const topicName = req.body.topicName;
  const topicPhoto = req.body.topicPhoto;
  try {
    let newTopic = await topics.create({
      topicname: topicName,
      topicphoto: topicPhoto,
    });
    return res.send(newTopic);
  } catch (err) {
    res.status(500).end({ message: err });
  }
});

// add a new questions (ONLY use for develop purpose)
app.post("/api/v1/topics/:topicId/questions", async (req, res) => {
  const topicId = req.params.topicId;
  const questionText = req.body.questionText;
  const questionImage = req.body.questionImage;
  const answerLetter = req.body.answerLetter;
  const optionA = req.body.optionA;
  const optionB = req.body.optionB;
  const optionC = req.body.optionC;
  const optionD = req.body.optionD;

  try {
    let newQuestion = await questions.create({
      questiontext: questionText,
      answerletter: answerLetter,
      optiona: optionA,
      optionb: optionB,
      optionc: optionC,
      optiond: optionD,
      topicname: topicId,
    });
    return res.send(newQuestion);
  } catch (err) {
    res.status(500).end({ message: err });
  }
});

/**
 * Return pulibc room that have less than 4 user
 *
 * @param {uuid} roomID:
 */
app.get("/api/v1/rooms", async (req, res, next) => {
  try {
    const publicRoom = await rooms.findAll({
      where: {
        type: 0,
      },
    });

    if (rooms) {
      const room = await publicRoom.find((room) => room.numofuser < 4);
      if (room) {
        res.status(200).send({ roomID: room.roomid, char: "player" });
      } else {
        const topic = await topics.findOne({
          order: sequelize.random(),
          limit: 1,
        });
        if (topic) {
          res
            .status(200)
            .send({ topicName: topic.topicname, char: "host", type: 0 });
        } else {
          res.status(500).send({ message: "something went wrong" });
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "something went wrong" });
  }
});

httpServer.listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log(`Server started on port ${PORT}`);
});
