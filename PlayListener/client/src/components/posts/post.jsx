import React, { Component } from "react";
import "./post.scss";
import moment from "moment";
import * as Vibrant from "node-vibrant";

class Post extends Component {
  constructor() {
    super();
    this.state = {
      trackAlbumArtUrl: null,
      trackTitle: null,
      trackArtist: null,
      trackAlbum: null,
      trackPop: null,
      count: 0,
      displayWidget: false
    };
  }

  componentDidMount() {
    fetch(`https://api.spotify.com/v1/tracks/${this.props.song}`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          trackAlbumArtUrl: result.album.images[1].url,
          trackTitle: result.name,
          trackArtist: result.artists[0].name,
          trackAlbum: result.album.name,
          trackPop: result.popularity
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          trackAlbumArtUrl: "/unknownTrack.jpg",
          trackTitle: "[unknown track]",
          trackArtist: "[unkown artist]",
          trackAlbum: "[unknown album]",
          trackPop: "[unknown popularity]"
        });
      });
  }

  increment = () => {
    if (this.state.count <= 0) {
      this.setState((prev) => {
        return {
          count: prev.count + 1,
        };
      });
      fetch(`/api/posts/${this.props.postID}/1`,  {
        method: "PUT"
      }).then(() => {
        this.props.refresh();
      });
    }
  };

  decrement = () => {
    if (this.state.count >= 0) {
      this.setState((prev) => {
        return {
          count: prev.count - 1,
        };
      });
      fetch(`/api/posts/${this.props.postID}/-1`, {
        method: "PUT"
      }).then(() => {
        this.props.refresh();
      });
    }
  };

  handleDelete = () => {
    fetch(`/api/posts/${this.props.postID}`, {
      method: "DELETE"
    }).then(() => {
      this.props.refresh();
    });
  };

  handleFameClick = () => {
    this.setState({ displayWidget: !this.state.displayWidget });
  };

  handlePostClick = () => {
    Vibrant.from(this.state.trackAlbumArtUrl)
  };

  render() {
    return (
      <div onClick={this.handlePostClick}>
        <div className="post">
          <div className="frame" onClick={this.handleFameClick}>
            <img
              src={this.state.trackAlbumArtUrl}
              alt={`album art for ${this.state.trackAlbum}`}
            />
          </div>
          <div className="info">
            <div className="user-info">
              <div className="username-date">
                <p className="username">Posted by {this.props.UserName}</p>
                <p className="date">
                  {moment(this.props.PostDate).format("MMM Do YY, h:mm a")}
                </p>
              </div>
              <h2
                className={
                  this.props.isViewingComments
                    ? "description bigger"
                    : "description"
                }
              >
                {this.props.description}
              </h2>
              <div
                className={
                  this.props.isViewingComments
                    ? "ratingHidden"
                    : "rating"
                }
              >
                <form>
                  <label for="thumbs_up">
                    <div class="thumbs_up">
                      <svg
                        class="bibi-chevron-up"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={this.increment}
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.646 4.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L8 5.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>

                  <label>
                    <h3>&nbsp;{this.props.rating}&nbsp;</h3>
                  </label>

                  <label for="thumbs_down">
                    <div class="thumbs_down">
                      <svg
                        class="bibi-chevron-down"
                        width="2em"
                        height="2em"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={this.decrement}
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>
                </form>
              </div>
            </div>
            <div className="meta">
              <div>
                <h2>{this.state.trackTitle}</h2>
                <h3>
                  {this.state.trackArtist} • {this.state.trackAlbum} •
                  Popularity Value: {this.state.trackPop}
                </h3>
              </div>
            </div>
            {(!this.props.isViewingComments || this.props.Playlist) && (
              <div className="buttons">
                {!this.props.isViewingComments && (
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      this.props.handleViewComments({
                        UserName: this.props.UserName,
                        PostID: this.props.postID,
                        PostSong: this.props.song,
                        PostDescription: this.props.description,
                        pageNumber: this.props.pageNumber,
                        PostDate: this.props.PostDate,
                        Playlist: this.props.Playlist
                      })
                    }
                  >
                    View Comments ({this.props.numComments})
                  </button>
                )}
                {this.props.Playlist && (
                  <button
                    className="btn btn-spotify"
                    onClick={(e) => {
                      window.open(
                        `http://open.spotify.com/user/thelinmichael/playlist/${this.props.Playlist}`,
                        "_blank"
                      );
                    }}
                  >
                    Open Spotify Playlist
                  </button>
                )}
                {this.props.UserName === this.props.currentUserName &&
                  !this.props.isViewingComments && (
                    <button
                      className="btn btn-danger"
                      onClick={this.handleDelete}
                    >
                      DELETE
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
        {this.state.displayWidget && (
          <iframe
            src={`https://open.spotify.com/embed/track/${this.props.song}`}
            title={this.props.song}
            width="100%"
            height="80"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        )}
      </div>
    );
  }
}

export default Post;