import React from "react";
import styled from "styled-components";

const Footer = ({ className }) => (
  <footer className={className}>
    <h2>Footer</h2>
  </footer>
);

export default styled(Footer)`
  position: relative;
  margin-top: 20px;
  width: 100%;
  bottom: 0;
  padding: 20px;
  text-align: center;
  background: #ddd;
`;
