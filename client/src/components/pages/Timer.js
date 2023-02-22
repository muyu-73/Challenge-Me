import { useContext, useEffect, useState } from "react";
import { TimerContext } from "../../userConetext";

function Timer() {
  const { questionTimer, setQuestionTimer } = useContext(TimerContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRemainingTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [questionTimer]);

  function updateRemainingTime() {
    let newTime = questionTimer - 1;
    if (questionTimer !== 0) {
      setQuestionTimer(newTime);
    }
  }

  return (
    <div className="timer">
      <span>{questionTimer}</span>
    </div>
  );
}
export default Timer;
