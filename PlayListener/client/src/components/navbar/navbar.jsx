import React, { Component } from "react";
import "./navbar.scss";

class Navbar extends Component {
  state = {};

  generateRandomString(length) {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  handleLogInWithSpotify = () => {
    const client_id = "d012bd21b13848478730be3037c449d1";
    const scope = "playlist-modify-public";
    const redirect_uri = "http://localhost:3000/"; 
    const state = this.generateRandomString(16);

    let url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(client_id);
    url += "&scope=" + encodeURIComponent(scope);
    url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url += "&state=" + encodeURIComponent(state);
    window.location = url;
  };
  
  render() {
    return (
      <div className="navbar">
        <div className="container">
          <img className="logo" src="/PlayListener.png" alt="PlayListener" />
          <div className="logged">
            {this.props.isLoggedIn ? (
              <div className="logged-in">
                <h3>{this.props.UserName}</h3>
                <button
                  className="btn btn-primary"
                  onClick={this.props.handleLogOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="logged-out">
                <button
                  className="btn btn-primary"
                    onClick={this.handleLogInWithSpotify}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
