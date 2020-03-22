import React from 'react';
import './App.css';
import { isUri } from 'valid-url';
import { debounce, omit } from 'underscore';
import {
  Button,
  Card,
  Checkbox,
  Container,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary, 
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';

/* global chrome */

const styles = theme => ({
  newUrlCard: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  cardFlexContainer: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    '& div': {
      padding: theme.spacing(1),
    }
  },
  saveButton: {
    alignSelf: 'flex-end'
  },
  expansionPanel: {
    border: '1px solid rgba(0, 0, 0, .15)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
  accordion: {
    margin: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  accordionDayLabel: {
    marginLeft: theme.spacing(1),
    marginBottom: -8,
  },
  deleteButton: {
    paddingRight: theme.spacing(2),
  },
  expansionPanelDetails: {
    paddingLeft: theme.spacing(8),
    paddingBottom: theme.spacing(2),
  },
  title: {
    textDecoration: 'underline',
    textAlign: 'center'
  },
  subtitle: {
    padding: theme.spacing(2),
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.defaultDays = {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    }
    this.state = {
      newUrlValue: '',
      newUrlDays: this.defaultDays,
      newUrlInvalid: false,
      newUrlUnresponsive: false,
      urlExpanded: null,
      homeTabs: {},
    };
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'production') {
      chrome.storage.sync.get(['homeTabs'], ht => {
        this.setState( ht );
      });
    } else {
      this.setState({
        homeTabs: {
          'https://www.reddit.com': {
            Sunday: false,
            Monday: true,
            Tuesday: true,
            Wednesday: true,
            Thursday: true,
            Friday: true,
            Saturday: false,
          },
          'https://www.lds.org': {
            Sunday: true,
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
          }
        }
      });
    }
  }

  onCheckChange(e, url) {
    this.setState({homeTabs: {
      ...this.state.homeTabs, 
      [url]: { 
        ...this.state.homeTabs[url], 
        [e.target.value]: e.target.checked
      }}});
  }

  onExpandChange = url => (event, isExpanded) => {
    this.setState({urlExpanded: isExpanded ? url : null})
  }

  onTextFieldChange(e) {
    this.setState({ newUrlValue: e.target.value, newUrlInvalid: false, newUrlUnresponsive: false });
    this.validateUrl(e.target.value);
  }

  validateUrl = debounce(url => {
    this.isUnresponsive(url).then(unrsp => {
      this.setState({
        newUrlInvalid: url !== '' && !isUri(url),
        newUrlUnresponsive: unrsp
      })
    })
  }, 1500);

  isUnresponsive(url) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const request = new Request(proxyurl+url, {method: 'GET', mode: 'cors'});
    return fetch(request)
      .then(response => {
        console.log(response);
        return !response.ok;
      });
  }

  handleSave() {
    let newHomeTabs = this.state.homeTabs;
    newHomeTabs[this.state.newUrlValue] = this.state.newUrlDays;
    console.log(newHomeTabs);
    this.setState({
      homeTabs: newHomeTabs, 
      newUrlValue:'', 
      newUrlDays: this.defaultDays
    }, () => {
      if (process.env.NODE_ENV === 'production')
      chrome.storage.sync.set({homeTabs: this.state.homeTabs});
    });
  }

  handleDelete(url) {
    const newHomeTabs = { homeTabs: omit(this.state.homeTabs, url)};
    this.setState(newHomeTabs);
    chrome.storage.sync.set(newHomeTabs);
  }

  render() {

    const { homeTabs, newUrlValue, newUrlDays, newUrlInvalid, newUrlUnresponsive } = this.state;
    const { classes } = this.props;
    return (
      <Container className={classes.root}>
        <Typography className={classes.title} componenet='h1' variant='h2' gutterBottom>
          Startup Page of the Day
        </Typography>
        <Card className={classes.newUrlCard}>
          <Typography variant='subtitle2' className={classes.subtitle}>
            Enter a new page, and the days on which you want it to launch on startup
          </Typography>
          <Container className={classes.cardFlexContainer}>
          <TextField className={classes.newUrlTextField}
            variant="outlined"
            label="URL"
            value={newUrlValue}
            placeholder='https://...'
            onChange={e => this.onTextFieldChange(e)}
            error={newUrlInvalid || newUrlUnresponsive}
            helperText={newUrlInvalid ? "Please input valid url ('https://...')" : (newUrlUnresponsive ? "Can't reach "+newUrlValue : '')}
          />
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Days of the week</FormLabel>
              <FormGroup>
                {Object.keys(newUrlDays).map(day => 
                  <FormControlLabel 
                    key={day}
                    label={day}
                    control={<Checkbox 
                      value={day} 
                      checked={newUrlDays[day]} 
                      onChange={e => {
                        this.setState({ 
                          newUrlDays: {
                            ...this.state.newUrlDays, 
                            [e.target.value]: e.target.checked
                        }})
                      }} 
                      color='primary'
                      />}
                  />
                )}
              </FormGroup>
            </FormControl>
          </div>
          <Button className={classes.saveButton}
            variant='contained'
            color='primary'
            size='large'
            onClick={() => this.handleSave()}
          >
            Save
          </Button>
          </Container>
        </Card>

        <div className={classes.accordion}>
          <Typography className={classes.subtitle} variant='subtitle2'>
            Your saved startup pages
          </Typography>
          {Object.keys(homeTabs).map(url => 
            <ExpansionPanel 
              classes={{
                root: classes.expansionPanel,
                expanded: classes.expanded,
              }}
              key={url}
              expanded={this.state.urlExpanded === url}
              onChange={this.onExpandChange(url)}
            >
              <ExpansionPanelSummary>
                <IconButton className={classes.deleteButton}
                  component='span'
                  size='small'
                  variant='outlined'
                  onClick={() => this.handleDelete(url)}
                >
                  <DeleteIcon/>
                </IconButton>
                {url}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                <FormControl component='fieldset'>
                  <FormLabel component="legend">Days of the week</FormLabel>
                  <FormGroup>
                    {Object.keys(homeTabs[url]).map(day => 
                      <FormControlLabel
                        className={classes.accordionDayLabel}
                        key={day}
                        label={day}
                        control={
                          <Checkbox 
                            value={day} 
                            checked={homeTabs[url][day]} 
                            onChange={e => this.onCheckChange(e, url)}
                            size='small'
                          />
                        }
                      />
                    )}
                  </FormGroup>
                </FormControl>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(App);
