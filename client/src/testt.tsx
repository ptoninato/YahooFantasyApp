/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'


class MyForm extends React.Component<{}, { id: any, loading: string, players: any, shouldOpenList: boolean }> {
  constructor(props:any) {
     super(props);
     this.state = {
      id : null,
      loading : 'initial',
      players : '',
      shouldOpenList: false
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
  }

  handleChange = (event: { target: { value: any; }; }) => {
     this.setState({id: event.target.value});
  }
  handleSubmit = async (event: { preventDefault: () => void; }) => {
    console.log('here');
    await this.fetchPlayers();
    // fetch('/getPlayers');
     event.preventDefault();
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

  async componentWillMount() {
      await this.fetchPlayers();
  }

  onUpdateInput(event: any, values: any, reason: any) {
    if( values && values.length >= 3) {
      this.setState({shouldOpenList: true})
    } else {
      this.setState({shouldOpenList: false})
    }
  }
  

  render() {
    

    if (this.state.loading === 'initial') {
        return <div>Loading....</div>
    }

     return(    
            <Container maxWidth="sm">
              
      <Grid  spacing={3}>
        <form> 
          <Autocomplete
        multiple
        id="tags-standard"
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
          <Button onClick={this.handleSubmit}>Default</Button>
        </form>
        </Grid>
        </Container>
    )
  }
}

export default MyForm;
