import React from "react";
import axios from "axios";
import "./App.css";
import clsx from "clsx";
import dotenv from "dotenv";
import {
  emailPattern,
  phoneNumPattern,
  twitterProfilePattern,
  linkedInProfilePattern,
  facebookProfilePattern
} from "./constants";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const API_KEY = process.env.REACT_APP_ENRICH_API_KEY;
const API_URL = "https://api.fullcontact.com/v3/person.enrich";

const useStyles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    dotenv.config();
    this.state = { searchItem: "", userData: "", isSearched: false };
    this.fetchDetails = this.fetchDetails.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = e => {
    this.setState({
      searchItem: e.target.value
    });
  };

  fetchDetails = () => {
    const header = {
      Authorization: `Bearer ${API_KEY}`
    };
    let search = {};
    let searchItem = this.state.searchItem;

    if (searchItem.match(emailPattern)) {
      search = {
        email: searchItem
      };
    } else if (searchItem.match(phoneNumPattern)) {
      search = {
        phone: searchItem
      };
    } else if (searchItem.indexOf("twitter") > -1) {
      search = {
        profiles: [
          {
            service: "twitter",
            url: searchItem
          }
        ]
      };
    } else if (searchItem.match(linkedInProfilePattern)) {
      if (searchItem.indexOf("linkedin") > -1) {
        search = {
          profiles: [
            {
              service: "linkedin",
              url: searchItem
            }
          ]
        };
      }
    } else if (searchItem.match(facebookProfilePattern)) {
      if (searchItem.indexOf("facebook") > -1) {
        search = {
          profiles: [
            {
              service: "facebook",
              url: searchItem
            }
          ]
        };
      }
    }

    axios
      .post(API_URL, search, { headers: header })
      .then(({ data }) => {
        this.setState({
          userData: data,
          isSearched: true
        });
      })
      .catch(err => {
        this.setState({
          isSearched: true
        });
      });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.userData);
    return (
      <div className="App">
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-search"
            label="Search any user profile"
            placeholder="Enter Email/Phone/Social profile URL"
            type="search"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={this.state.searchItem}
            onChange={this.handleInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.fetchDetails}
          >
            Search
          </Button>
        </form>

        {this.state.userData && this.state.isSearched && (
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Paper className={classes.paper}>
                  <img src={this.state.userData.avatar} />
                </Paper>
              </Grid>
              <Grid item xs={9}>
                <Paper className={classes.paper}>
                  <b>Name: </b>
                  {this.state.userData.fullName}
                </Paper>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <b>Occupation: </b>
                    {this.state.userData.title}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <b>Email: </b>
                    {this.state.userData.details.email
                      ? this.state.userData.details.email
                      : "Not available!"}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <b>Phone Number: </b>
                    {this.state.userData.details.phone
                      ? this.state.userData.details.phone
                      : "Not available!"}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <b>Social Profiles: </b>
                    <ol className="social-list">
                      <li>
                      {this.state.userData.details.profiles.twitter
                      ? this.state.userData.details.profiles.twitter.url
                      : "NIL"}
                      </li>
                      <li>
                      {this.state.userData.details.profiles.facebook
                        ? this.state.userData.details.profiles.facebook.url
                        : "NIL"}
                      </li>
                      <li>
                      {this.state.userData.details.profiles.linkedin
                        ? this.state.userData.details.profiles.linkedin.url
                        : "NIL"}
                      </li>
                    </ol>
                    
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
        {this.state.isSearched && this.state.userData.details === undefined && (
          <div className="not-found-div">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <b>
                    User data not available. Please search any other profile!
                  </b>
                </Paper>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
