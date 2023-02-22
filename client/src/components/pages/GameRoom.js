import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { UserContext, TimerContext } from "../../userConetext";
import { io } from "socket.io-client";
import { BACKEND_SOCKET } from "./constants";
import { Peer } from "peerjs";
import PeerVedio from "../pages/PeerVedio.js";
import "../style/GameRoom.css";
import Rank from "./Rank";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

function GameRoom(props) {
  const topicName = useLocation().state.topicId;
  const { user, setUser } = useContext(UserContext);
  const [char, setChar] = useState(useLocation().state.char);
  const playerRoomID = useRef(useLocation().state.topicId);
  const type = useRef(useLocation().state.type);
  const socket = useRef();
  const userVedio = useRef();
  const [peersVedio, setPeersVedio] = useState([]);
  const [numOfUser, setNumofUser] = useState(0);
  const [disPlayer, setDisplayer] = useState(null);
  const [gameStatus, setGameStatus] = useState("wait");
  const optionARef = useRef(null);
  const optionBRef = useRef(null);
  const optionCRef = useRef(null);
  const optionDRef = useRef(null);
  const [playersScore, setPlayersScore] = useState({});
  const [playersAva, setPlayersAva] = useState({});
  const myPeer = new Peer();
  const [question, setQuestion] = useState(null);
  const [questionTimer, setQuestionTimer] = useState(null);
  const navigate = useNavigate();
  const providerTimer = useMemo(
    () => ({ questionTimer, setQuestionTimer }),
    [questionTimer, setQuestionTimer]
  );
  const [rank, setRank] = useState(null);
  const CreateRoom = () => {
    if (char === "host") {
      return "";
    } else {
      return playerRoomID.current;
    }
  };
  const [roomID, setRoomID] = useState(CreateRoom());

  useEffect(() => {
    if (!roomID && !topicName) {
      navigate("/select");
    }
    socket.current = io(BACKEND_SOCKET, { withCredentials: true });
    myPeer.on("open", (id) => {
      socket.current.emit(
        "join room",
        roomID,
        user,
        id,
        topicName,
        type.current
      );
      
      //when a a play join the room open the camera
      //(peersID) is a list player peer_id generate by peer.js
      socket.current.on("new player", function (peersID) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(function (stream) {
            userVedio.current.srcObject = stream;
            myPeer.on("call", function (call) {
              call.answer(stream);
              call.once("stream", function (peerStream) {
                if (!peersVedio.includes(peerStream)) {
                  const pid = call.peer;
                  let dict = {};
                  dict[pid] = peerStream;
                  setPeersVedio((current) => [...current, dict]);
                }
              });
            });
            if (peersID) {
              peersID.forEach(function (peerID) {
                call(peerID);
              });
            }
          });
      });
    });

    socket.current.on("joined room", function (room, numofuser) {
      setRoomID(room);
      setNumofUser(numofuser);
    });

    socket.current.on("player left", function (peerID, length) {
      setDisplayer(peerID);
      setNumofUser(length);
    });

    socket.current.on("new host", function (username) {
      if (user === username) {
        setChar("host");
      }
    });

    socket.current.on("question", async function (question) {
      setQuestion(question);
      setQuestionTimer(10);
    });

    socket.current.on("players info", function (players) {
      setGameStatus("in game");
      players.map(function (player) {
        const name = player[0];
        const avaPath = player[1];
        const score = player[2];
        setPlayersAva((prev) => {
          return { ...prev, [name]: avaPath };
        });
        setPlayersScore((prev) => {
          return { ...prev, [name]: score };
        });
      });
    });

    socket.current.on("add score", function (score, username) {
      setPlayersScore((prev) => {
        return { ...prev, [username]: score };
      });
    });

    socket.current.on("end", function (scores) {
      let score = Object.values(scores);
      score.sort(function (fst, sec) {
        return sec - fst;
      });

      for (let i = score.length - 1; i >= 0; i--) {
        if (score[i] === scores[user]) {
          setRank(i + 1);
        }
      }

      setGameStatus("end");
    });

    socket.current.on("new host", function (username) {
      if (user === username) {
        setChar("host");
      }
    });

    socket.current.on("unable to join", function () {
      quitRoom();
    });

    socket.current.on("error", function () {
      quitRoom();
    });
  }, []);

  window.onbeforeunload = function (e) {
    socket.current.emit(socket.current.emit("dis", user, roomID));
  };

  useEffect(() => {
    setPeersVedio((current) =>
      current.filter((stream) => Object.keys(stream)[0] !== disPlayer)
    );
  }, [disPlayer]);

  useEffect(() => {
    if (optionARef.current) {
      optionARef.current.disabled = false;
      optionBRef.current.disabled = false;
      optionCRef.current.disabled = false;
      optionDRef.current.disabled = false;
    }
  }, [question]);
  

  //call peer bt thier peer id
  function call(peerID) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (stream) {
        const call = myPeer.call(peerID, stream);
        call.once("stream", function (peerStream) {
          const pid = call.peer;
          let dict = {};
          dict[pid] = peerStream;
          setPeersVedio((current) => [...current, dict]);
        });
      });
  }

  function startGame() {
    socket.current.emit("start game", roomID);
  }

  function answer(option) {
    optionARef.current.disabled = true;
    optionBRef.current.disabled = true;
    optionCRef.current.disabled = true;
    optionDRef.current.disabled = true;
    if (option === question.answerletter) {
      socket.current.emit("answer", roomID, questionTimer, user);
    }
  }

  function quitRoom() {
    socket.current.emit("dis", user, roomID);
    socket.current.disconnect();
    myPeer.destroy();
    navigate("/select", { replace: true });
  }

  return (
    <>
      <div className="gameroom-body">
        <video
          className="gameroom-backgroud-video"
          src="/videos/playroomBackgroudVideo.mp4"
          autoPlay
          loop
          muted
        />
        <div className="gameroom-vedio">
          <video className="myVedio" key="self" ref={userVedio} autoPlay />
          {peersVedio.map(function (stream) {
            return (
              <PeerVedio
                key={Object.values(stream)[0]}
                stream={Object.values(stream)[0]}
              ></PeerVedio>
            );
          })}
        </div>
        <div className="gameroom-container">
          {gameStatus === "wait" ? (
            <>
              <h1>PLAYROOM</h1>
              <div className="gameroom-code-container">
                <p className="gameroom-code">
                  PLAYROOM CODE:&nbsp;&nbsp; {roomID}
                </p>
              </div>
              <h2 className="numPlayers">
                Current number of player :&nbsp; {numOfUser}
              </h2>
              {char === "host" ? (
                <button
                  className="play-button-position button button-white button-animated"
                  onClick={() => {
                    startGame();
                  }}
                >
                  Start Game
                </button>
              ) : (
                <h2 className="wait-text numPlayers">
                  waiting host to start the game
                </h2>
              )}
              <button
                className="leave-button-position button button-white button-animated"
                onClick={() => {
                  quitRoom();
                }}
              >
                Leave Room
              </button>
            </>
          ) : (
            <>
              <div className="countdown-container">
                <div className="countdownSpinner"></div>
                <TimerContext.Provider className="timer" value={providerTimer}>
                  <Timer></Timer>
                </TimerContext.Provider>
              </div>
              <div className="during-questions">
                <Rank
                  playersScore={playersScore}
                  playersAva={playersAva}
                ></Rank>
                {question ? (
                  <div className="question">
                    <h1> {question.questiontext}</h1>

                    <div className="question-options">
                      <button
                        className="question-option"
                        ref={optionARef}
                        onClick={() => {
                          answer("A");
                        }}
                      >
                        A. {question.optiona}
                      </button>
                      <button
                        className="question-option"
                        ref={optionBRef}
                        onClick={() => {
                          answer("B");
                        }}
                      >
                        B. {question.optionb}
                      </button>
                      <button
                        className="question-option"
                        ref={optionCRef}
                        onClick={() => {
                          answer("C");
                        }}
                      >
                        C. {question.optionc}
                      </button>
                      <button
                        className="question-option"
                        ref={optionDRef}
                        onClick={() => {
                          answer("D");
                        }}
                      >
                        D. {question.optiond}
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </div>
        {gameStatus === "end" ? (
          <>
            <div className="gameover">
              <div className="gameover-title">GAME OVER</div>
              <div className="gameover-score">
                Your score: {playersScore[user]}
              </div>
              <div className="gameover-rank">Your rank: {rank}</div>

              <button
                className="quit-botton-position button button-animated"
                onClick={() => {
                  quitRoom();
                }}
              >
                {" "}
                back to lobby
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default GameRoom;
