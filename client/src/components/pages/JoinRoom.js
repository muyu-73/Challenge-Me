import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../style/JoinRoom.css";

function JoinRoom(props) {
  const [topicID, setTopicID] = useState("");

  return (
    <>
      <div className="joiningroom-body">
        <div className="joiningroom-container joiningroom-image">
          <div className="joiningroom-text">
            <h3 className="joiningroom-context">
              Ask your friend about room code.
              <br></br>
              <br></br>
              They shoud see it on their playroom page.
            </h3>
          </div>
          <div className="form-container">
            <h1 className="joiningroom-title">What is play room code?</h1>
            <form className="joiningroom-form">
              <input
                className="joiningroom-input"
                type="text"
                placeholder="PLAY ROOM CODE"
                onChange={(e) => {
                  setTopicID(e.target.value);
                }}
                required
              />
              <Link
                className="joiningroom-button"
                to="/gameroom"
                state={{ topicId: topicID, char: "player" }}
              >
                Join Now
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default JoinRoom;
