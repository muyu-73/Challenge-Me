import "../style/Rank.css";


//get dicts of {user: score} and {uesr: name}, sort user by score
function Rank(props) {
  let playersScore = Object.keys(props.playersScore).map(function (player) {
    return [player, props.playersScore[player]];
  });

  playersScore.sort(function (first, second) {
    return second[1] - first[1];
  });

  return (
    <div className="rank">
      <div className="player">
        <div className="ava div-form">AVATAR</div>
        <div className="name div-form">NAME</div>
        <div className="score div-form">SCORE</div>
      </div>
      {playersScore.map(function (player) {
        return (
          <div className="player" key={player[0]}>
            <img
              className="ava div-form"
              alt="avantar"
              src={props.playersAva[player[0]]}
            ></img>
            <div className="name div-form">{player[0]}</div>
            <div className="score div-form">{player[1]}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Rank;
