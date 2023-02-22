import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
const ROOM_API = "/api/v1/rooms/";

//check if there is a public room with less than 4
//if not create one
//otherwise join it
function MatchMaking() {
  const navigate = useNavigate();
  axios
    .get(ROOM_API)
    .then(function (res) {
      if (res.data.char === "host") {
        navigate("/gameroom", {
          state: { topicId: res.data.topicName, char: res.data.char, type: 0 },
          replace: true,
        });
      } else {
        navigate("/gameroom", {
          state: { topicId: res.data.roomID, char: res.data.char, type: 0 },
          replace: true,
        });
      }
    })
    .catch(function (error) {
      console.log("fail");
    });

  return (
    <>
      <p>matching</p>
    </>
  );
}

export default MatchMaking;
