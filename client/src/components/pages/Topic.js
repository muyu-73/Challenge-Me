import React from "react";
import "../style/Select.css";
import CardItem from "../CardItem";
import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios.js";

const TOPIC_URL = "api/v1/topics";

function Topic() {
  let [topics, setTopics] = useState([]);
  let [topicId, setTopicId] = useState(null);
  useEffect(() => {
    axios
      .get(TOPIC_URL)
      .then(function (res) {
        setTopics(res.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);
  return (
    <div className="cards">
      <h1>Choose a topic that you want to play</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          {topics.map((topic) => {
            const topicPath = `/gameroom`;
            const topicName = topic.topicname;
            const topicPhoto = topic.topicphoto;
            const t = 1;
            return (
              <CardItem
                src={topicPhoto}
                text={topicName}
                label="Topic"
                key={topic.topicname}
                id={topic.topicname}
                path={topicPath}
                char="host"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Topic;
