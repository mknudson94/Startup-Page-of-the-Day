import React from 'react';

import { 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  TextField 
} from '@material-ui/core';

class UrlBox extends React.Component {
  


  render() {
    const { url, days, onCheckChange} = this.props;
    return (
      <>
        <TextField
          variant="outlined"
          label="Url"
          value={url}
          {...this.props.textFieldProps}
        />
  
        <div id={url+'-box-container'}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Days of the week</FormLabel>
          <FormGroup>
            {Object.keys(days).map(day => 
              <FormControlLabel 
                key={day}
                label={day}
                control={<Checkbox value={day} checked={days[day]} onChange={onCheckChange} />}
              />
            )}
          </FormGroup>
        </FormControl>
        </div>
    </>
    );
  }
}

export default UrlBox;