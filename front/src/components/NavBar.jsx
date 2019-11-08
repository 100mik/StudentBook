import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

class NavBar extends React.Component {
  state = {
    loggedIn: true
  };

  logout = () => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.status === "success") this.setState({ loggedIn: false });
      });
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className="navItem active">Home</div>
        <div className="navItem">Link</div>
        <div className="navItem right" onClick={this.logout}>
          Logout
        </div>
        {this.state.loggedIn || <Redirect to="/login" />}
      </div>
    );
  }
}

export default styled(NavBar)`
  display: flex;
  flex-flow: row nowrap;
  background-color: #333;
  position: sticky;
  top: 0;

  .navItem {
    color: white;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
    cursor: pointer;

    &.right {
      margin-left: auto;
    }

    &.active {
      background-color: #666;
      color: white;
    }

    &:hover {
      background-color: #ddd;
      color: black;
    }
  }
`;
