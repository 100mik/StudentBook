import React from "react";
import styled from "styled-components";

const Header = ({ className }) => (
  <div className={className}>
    <h1>StudentBook</h1>
    <p>
      <b>Created by Students for Students.</b>
    </p>
  </div>
);

export default styled(Header)`
  padding: 80px;
  text-align: center;
  background: #1abc9c;
  color: white;

  & h1 {
    font-size: 40px;
  }
`;
