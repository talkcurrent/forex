import React from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const Result = () => {
    const location = useLocation()

    const amount = location.state.amount;
    const outcome = location.state.outcome
    const position = location.state.position
    const createdAt = location.state.createdAt
    const addition = location.state.addition

  return (
    <div>
      <p>Result</p>
      <div>
        <div>${amount}</div>
        <div>{outcome === "Win" ? "Won" : "Lost"}</div>
        <div>{position}</div>
        <div>{moment(createdAt).format("MMMM Do YYYY, hh:mm A")}</div>
        <div>{outcome === "Win" ? `+ $${addition.toFixed(2)}` : `- $${addition.toFixed(2)}`}</div>
      </div>
    </div>
  );
}

export default Result