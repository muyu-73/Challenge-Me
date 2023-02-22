import { useEffect, useRef } from "react";
import "../style/GameRoom.css";

function PeerVedio(props) {
  const peerVedio = useRef();
  useEffect(() => {
    peerVedio.current.srcObject = props.stream;
  }, []);

  return (
    <video
      className="myVedio"
      key={props.stream}
      ref={peerVedio}
      autoPlay
    ></video>
  );
}

export default PeerVedio;
