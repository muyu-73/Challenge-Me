import React, { useContext } from "react";
import "../style/Profile.css";
import IMAGES from "./images.json";
import axios from "../../api/axios";
import { UserContext, AvaPath } from "../../userConetext";

const UPDATEAVA_PATH = "/api/v1/updateAvatar";

function Popup(props) {
  const { user, setUser } = useContext(UserContext);
  const { avaPath, setAvaPath } = useContext(AvaPath);

  function updateAva(avaPath) {
    axios
      .patch(UPDATEAVA_PATH, {
        avaPath: avaPath,
      })
      .then(function (res) {
        props.setTrigger(false);
        setAvaPath(avaPath);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popup-container">
        <h1>Choose you avatar today</h1>
        <div className="popup-inner">
          {IMAGES.map((image, i) => {
            return (
              <div key={image.name} className="image-container">
                <img
                  key={image.name}
                  src={image.path}
                  className="avatar"
                  alt="avatarImage"
                  onClick={() => {
                    updateAva(image.path);
                  }}
                ></img>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
