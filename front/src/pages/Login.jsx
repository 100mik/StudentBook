import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

class Login extends React.Component {
  state = {
    formData: {
      username: "",
      password: ""
    },
    loggedIn: false
  };

  onFieldChange = field => e => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: e.target.value
      }
    });
  };

  login = () => {
    console.log(this.state.formData);
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.formData)
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === "success") this.setState({ loggedIn: true });
      });
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className="loginForm">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.formData.username}
            onChange={this.onFieldChange("username")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.formData.password}
            onChange={this.onFieldChange("password")}
          />
          <button onClick={this.login}>Login</button>
          {this.state.loggedIn && <Redirect to="/home" />}
        </div>
      </div>
    );
  }
}

export default styled(Login)`
  .loginForm {
    margin: auto;
    margin-top: 25px;
    max-width: fit-content;
    display: flex;
    flex-flow: column nowrap;

    input {
      margin: 5px;
      padding: 5px;
    }

    button {
      margin-top: 5px;
      border: none;
      padding: 5px;
    }
  }
`;
