import React from 'react';

import { 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Avatar
} from '@material-ui/core';

class UrlCard extends React.Component {
  

  render() {
    const { url, days, onCheckChange} = this.props;
    return (
      <Card>  
        <CardHeader
          title={url}
        />
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
    </Card>
    );
  }
}

export default UrlCard;