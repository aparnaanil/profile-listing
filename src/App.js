import React from "react";
import "./App.css";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
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
}));

export default function App() {
  const classes = useStyles();
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
              }}
          />

        <Button variant="contained" color="primary" className={classes.button}>
          Search
        </Button>
        </React.Fragment>
      </form>
    </div>
  );
}
