import React from "react";
import { Home, Login, Register } from "./pages";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { NavBar, Header, Footer, GlobalStyle } from "./components";

const App = ({ className }) => (
  <>
    <GlobalStyle />
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </Router>
  </>
);

export default App;
