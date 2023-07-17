import React from "react";
import classes from "./Answers.module.css";

const Answers = (props) => {
  return (
    <>
      <div className={classes.container}>
      <h1 className={classes.title}>Check Your Asnwers!</h1>
        {props.data.map((item) => (
          <div key={item.name} className={classes.item}>
            <h1>
              Word <span className={classes.question}>{item.name}</span> is a?
            </h1>
            <h1>
              <span className={classes.answer}>- {item.answer}</span>
            </h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Answers;
