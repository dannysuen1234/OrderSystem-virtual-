import React , {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import {deleteTokens} from './auth';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import MainNavBar from './MainNavBar';
/*
export default class Updateitem extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: '',
    }
    const queryParams = new URLSearchParams(window.location.search);
    this.idx = queryParams.get('id')

    render() {
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
        <Paper />
          <Container maxWidth="sm">
            <h1>Update Item</h1>
              <TextField
                placeholder="Enter Id of Item"
                label="Item Id"
                value={idx}
                onChange={event => setId(event.target.value)}
                variant="outlined"
                fullWidth="true"
                margin="normal"
              /> 
            <br />
            <TextField
              placeholder="Enter Name of Item"
              label="Name"
              value={name}
              onChange={event => setName(event.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth="true"
            />
            <br />
            <TextField
                placeholder="Enter Description"
                label="Description"
                value={description}
                onChange={event => setDescription(event.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth="true"
            />
            <br />
            <TextField
                placeholder="Enter Price"
                label="Amount"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth="true"
            />
            <br />
            <br/>
            <br/>
            <Button
                color="primary"
                variant="contained"
                onClick={onSubmit}
            >Update
            </Button>   
          </Container>
        </div>
      </main>
    }
  }
}
*/

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));
 

export default function ClippedDrawer() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [data1, setData] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const id_lookup = queryParams.get('id');
  useEffect(() => {
    // Run! Like go get some data from an API.
    fetch('/menu_select/'+id_lookup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(id_lookup)
    }).then( res => res.json()).then(data =>{
      setName(data.food_items.name)
      setDescription(data.food_items.description)
      setAmount(data.food_items.amount)
      setImagePath(data.food_items.imagePath)
      console.log(data.food_items)
    })
  }, []);

  //table
  const [name , setName] = useState("");
  const [idx , setId] = useState(id_lookup);
  const [description , setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [imagePath , setImagePath] = useState("");


  const onSubmit = (e) => {
    e.preventDefault();
    const data = {idx, name, description, amount, imagePath }
    console.log(data)
    fetch(`/menu_update/${id_lookup}`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(data)
   }).then( res => {
       if(res.ok){
           window.location.replace("/menu")
       }
   })
 };

  return (
    <div className={classes.root}>
      <MainNavBar/>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
        <Paper />
          <Container maxWidth="sm">
            <h1>Update Item</h1>
              <TextField
                placeholder="Enter Id of Item"
                label="Item Id"
                value={idx}
                onChange={event => setId(event.target.value)}
                variant="outlined"
                fullWidth="true"
                margin="normal"
              /> 
            <br />
            <TextField
              placeholder="Enter Name of Item"
              label="Name"
              value={name}
              onChange={event => setName(event.target.value)}
              variant="outlined"
              margin="normal"
              fullWidth="true"
            />
            <br />
            <TextField
                placeholder="Enter Description"
                label="Description"
                value={description}
                onChange={event => setDescription(event.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth="true"
            />
            <br />
            <TextField
                placeholder="Enter Price"
                label="Amount"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth="true"
            />
            <TextField
                placeholder="Enter Image Path"
                label="Image Path"
                value={imagePath}
                onChange={event => setAmount(event.target.value)}
                variant="outlined"
                margin="normal"
                fullWidth="true"
            />
            <br />
            <br/>
            <br/>
            <Button
                color="primary"
                variant="contained"
                onClick={onSubmit}
            >Update
            </Button>   
          </Container>
        </div>
      </main>
    </div>
  );
}