import React from "react";
import "../style/Select.css";
import CardItem from "../CardItem";

function Select() {
  return (
    <div className="cards">
      <h1>Welcome to the game, please select the mode</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="images/createPlayroom.png"
              text="Choose a topic and create a playroom for people join."
              label="Host"
              path="/topics"
            />
            <CardItem
              src="images/joinPlayroom.png"
              text="Join others playroom by enter their playroom code."
              label="Player"
              path="/joinroom"
            />
            <CardItem
              src="images/matchmaking.jpeg"
              text="Match Making"
              label="Match Making"
              path="/matchmaking"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Select;
