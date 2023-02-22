import "../../App.css";
import "../style/Home.css";

function Home() {
  return (
    <>
      <div className="home-container">
        <video
          className="home-video"
          src="/videos/backgroudVideo2.mp4"
          autoPlay
          loop
          muted
        />
        <h1 className="home-title">Play Challenge Me Today WITH Friends</h1>
        <p className="home-paragraph">Create a play room</p>
        <p className="home-paragraph">OR</p>
        <p className="home-paragraph">Enter play code to join in a play room</p>
      </div>
      <div></div>
    </>
  );
}

export default Home;
