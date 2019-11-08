import React from "react";
import styled from "styled-components";

class Register extends React.Component {
  state = {
    formData: {
      name: "",
      username: "",
      password: "",
      email: "",
      mobile: "",
      college: ""
    }
  };

  onFieldChange = field => e => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: e.target.value
      }
    });
  };

  register = () => {
    console.log(this.state.formData);
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.formData)
    })
      .then(res => res.json())
      .then(console.log);
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className="loginForm">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.formData.name}
            onChange={this.onFieldChange("name")}
          />
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
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.formData.email}
            onChange={this.onFieldChange("email")}
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile No."
            value={this.state.formData.mobile}
            onChange={this.onFieldChange("mobile")}
          />
          <input
            type="text"
            name="college"
            placeholder="College"
            value={this.state.formData.college}
            onChange={this.onFieldChange("college")}
          />
          <button onClick={this.register}>Register</button>
        </div>
      </div>
    );
  }
}

export default styled(Register)`
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
