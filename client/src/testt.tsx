/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

let classes: any;

class MyForm extends React.Component<{}, { responseData: any, inputValue: any, filterSelectedOptions: boolean, ids: any, loading: string, players: any, shouldOpenList: boolean, classes: any, value: any }> {
  constructor(props:any) {
     super(props);
     this.state = {
      ids : null,
      loading : 'initial',
      players : '',
      shouldOpenList: false,
      classes : '',
      value : [],
      filterSelectedOptions: true,
      inputValue : '',
      responseData : []
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

fetchPlayers = async() => {
  try {
    let response = await fetch('/api/transactionSearch/getAllPlayers');
    const data = await response.json();
    this.setState({loading: 'false', players: data});
  } catch(err) {
    // catches errors both in fetch and response.json
    console.log(err);
  }
}

setStyles = async() => { 
classes = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    table: {
      minWidth: 650,
    },
  }),);
}

  async componentWillMount() {
    await this.setStyles();
      await this.fetchPlayers();

  }

  onUpdateInput(event: any, values: any, reason: any) {
    if( values && values.length >= 3) {
      this.setState({shouldOpenList: true})
    } else {
      this.setState({shouldOpenList: false})
    }
  }

  handleChange = async (event: any, newValue: any) => {
    const selectedIDs = newValue.map((value:any) => value.id);
    this.setState({ids: selectedIDs});
  }



 fetchData = async (url: string) => {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json'
    },
     body: JSON.stringify(this.state.ids) // body data type must match "Content-Type" header
  });
  const data = await response.json();
  this.setState({responseData: data});
  return data; 
 }

 handleSubmit = async (event: { preventDefault: () => void; }) => {
  const url = '/api/transactionSearch/getCountById';
  this.fetchData(url);
}
  
render() {
    const responseData = this.state.responseData;
    let table;
    if (this.state.loading === 'initial') {
        return <Container maxWidth="sm"><CircularProgress /></Container>
    }

    if(responseData.length > 0 ) {
      table = <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">League</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Rank</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {responseData.map((row: any) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.leaguename}</TableCell>
              <TableCell align="right">{row.ct}</TableCell>
              <TableCell align="right">{row.rank_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> 
    }

    return(    
            <Container maxWidth="md">
              
        <FormControl className={classes.root} fullWidth={true} margin={'normal'}> 
          <Autocomplete
        multiple
        id="id"
        onChange={this.handleChange}
        filterSelectedOptions={this.state.filterSelectedOptions}
        onInputChange={this.onUpdateInput}
        open={this.state.shouldOpenList}
        options={this.state.players}
        getOptionLabel={(option:any) => option.name}
        renderInput={(params:any) => (
          <TextField
            {...params}
            variant="standard"
            label="Multiple values"
            placeholder="Favorites"
          />
        )}
      />     
        </FormControl>
        <Button onClick={this.handleSubmit}>Search</Button>
        <Button onClick={this.handleSubmit}>The League Top 100</Button>
        <Button onClick={this.handleSubmit}>Cerveza Mesa Top 100</Button>
        { table }
        </Container>
    )
  }
}

export default MyForm;
