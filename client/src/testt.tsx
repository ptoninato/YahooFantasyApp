/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';


let classes: any;


class MyForm extends React.Component<{}, { inputValue: any, filterSelectedOptions: boolean, ids: any, loading: string, players: any, shouldOpenList: boolean, classes: any, value: any }> {
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
      inputValue : ''
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

fetchPlayers = async() => {
  try {
    let response = await fetch('/getPlayers');
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
    console.log(newValue);
    const selectedIDs = newValue.map((value:any) => value.id);
    console.log(selectedIDs);
    await this.setState({ids: selectedIDs});
    console.log(`ids: ${this.state.ids}`);
  }

  handleSubmit = async (event: { preventDefault: () => void; }) => {
    console.log(this.state.ids);
    event.preventDefault();
 }
  
  render() {
    if (this.state.loading === 'initial') {
        return <Container maxWidth="sm"><CircularProgress /></Container>
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
        <Button onClick={this.handleSubmit}>Default</Button>

        </Container>
    )
  }
}

export default MyForm;
