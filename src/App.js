import React from "react";
import axios from "axios";
import "./App.css";
import clsx from "clsx";
import dotenv from 'dotenv'


import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const API_KEY = "lbC8bDiXTMX44453DpF69ehH1voKUL8V";
const API_URL = 'https://api.fullcontact.com/v3/person.enrich';
// console.log(process.env.ENRICH_API_KEY)

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
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    dotenv.config()
    this.state = { searchItem: "", userData: "" }
    this.fetchDetails = this.fetchDetails.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (e) => {
    this.setState({
      searchItem: e.target.value
    })
  }

  fetchDetails = () => {
    const header = {
      'Authorization': `Bearer ${API_KEY}`
    }
    const email = {
      "email" : "bart.lorang@fullcontact.com"
    }

    let search = {};
    
    let emailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$"; 
    let phoneNumPattern = "/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im";
    let facebookProfilePattern = "(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?";
    let linkedInProfilePattern = "/(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(val)";
    let twitterProfilePattern = "/http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/";

    if(this.state.searchItem.match(emailPattern)) {
      search = {
        "email": this.state.searchItem
      }
    } else if(this.state.searchItem.match(phoneNumPattern)) {
      search = {
        "phone": this.state.searchItem
      }
    } else if(this.state.searchItem.match(twitterProfilePattern)) {
      search = {
        "profiles" : [{
          "service": "twitter",
          "url": "bartlorang"
        }]
      }
    } else if(this.state.searchItem.match(linkedInProfilePattern)) {
      search = {
        "profiles": [{
          "service": "linkedin",
          "url": ""
        }]
      }
    } else if(this.state.searchItem.match(facebookProfilePattern)) {
      search = {
        "profiles": [{
          "service": "facebook",
          "url": ""
        }]
      }
    }

    axios.post(API_URL, search, {headers: header})
      .then(({ data }) => {
        this.setState({
          userData: data
        })
    })
  }
  
  render () {
    const { classes } = this.props;
    console.log(this.state.userData)
    return (
      <div className="App">
        <form className={classes.container} noValidate autoComplete="off">
          <React.Fragment>
            <TextField
              id="outlined-search"
              label="Search field"
              type="search"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value = {this.state.searchItem}
              onChange={this.handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            
  
          <Button variant="contained" color="primary" className={classes.button} onClick={this.fetchDetails}>
            Search
          </Button>
          { this.state.userData && 
            <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>{this.state.userData.fullName}</Paper>
              </Grid>
              {/* <Grid item xs={6}>
                <Paper className={classes.paper}>{this.state.userData.avatar}</Paper>
              </Grid> */}
              <Grid item xs={6}>
                <Paper className={classes.paper}>{this.state.userData.title}</Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}>{this.state.userData.email}</Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper className={classes.paper}>{this.state.userData.phones}</Paper>
              </Grid>
            </Grid>
          </div>
          
          }
          </React.Fragment>
        </form>
      </div>
    );
  }
  
}

export default withStyles(useStyles)(App);