import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/*
const handleUpdate = (x) => {
  const data = {'status': 'Food is ready.'};
  fetch(`/update_status/${x.orderid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => {
    if(res.ok){
      console.log("Status Updated");
    }
  })

  return(
    <Button disabled>Robot Coming</Button>
  )
}
const handleRobotToTable = (x) => {
  const data = {'status': 'Going to Table '+ x.tableno};
  fetch(`/update_status/${x.orderid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(res => {
    if(res.ok){
      console.log("Status Updated");
    }
  })
}
*/

const check = activite => {
  return (
      <ul>
        {activite ? 'Yes': 'No'}
      </ul>
  )
}

const row = (x,i,props) => {
  //temp, overwrite in Order.js 
  const header = props.header 
  //temp, overwrite in Order.js 
  const handleRemove = props.handleRemove;

  return (
    <TableRow key={`tr-${i}`}>
      {header.map((y, k) => (
      <TableCell key={`trc-${k}`}>
        {console.log(x[y.prop])}
        {y.prop === 'active' ? check(JSON.parse(x[y.prop])) : x[y.prop]/*test if is food. Yes ->test()*/}
      </TableCell>
    ))}
      <TableCell>
      </TableCell>
    </TableRow>
  );
};



export default function SimpleTable(props) {

  const [robot_id, setRobot] = useState('');

  const handleRobotTo = (x) => {
    const data = {'mission': x};
    fetch(`/robotTo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => {
      if(res.ok){
        console.log("Status Updated"+ JSON.stringify(data));
      }
    })
  }

  const handleThisRobotTo = (robot_id_inp, location_id) => {
    const data = {'robot':robot_id_inp, 'mission': location_id,'record': false,};
    fetch(`/thisRobotTo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(res => {
      if(res.ok){
        console.log("Status Updated"+ JSON.stringify(data));
      }
    })
  }

  const handleRobotToButton = (location_id) => {
    if (robot_id == -1){
      handleRobotTo(location_id)
    }else{
      handleThisRobotTo(robot_id, location_id)
    }

  }

  const handleChange = (event) => {
    setRobot(event.target.value);
  };
  const classes = useStyles();
  const header  = props.header;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
          {header.map((x, i) => (
          <TableCell key={`thc-${i}`}>{x.name}</TableCell>
        ))} 
          <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((x, i) =>row(x,i,props))}
          <TableRow>
            <TableCell>
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-filled-label">Robot</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={robot_id}
                  onChange={handleChange}
                >
                  <MenuItem value={-1}>Auto</MenuItem>
                  <MenuItem value={7}>KettyBots1</MenuItem>
                  <MenuItem value={6}>KettyBots2</MenuItem>
                  <MenuItem value={5}>Flash Bot</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(-1)}
              >Picking Area
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(0)}
              >Waiting Dish
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(1)}
              >Table 1
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(2)}
              >Table 2
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(3)}
              >Table 3
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(4)}
              >Table 4
              </Button>
            </TableCell>
            <TableCell>
              <Button 
                variant="contained" 
                style={{backgroundColor: 'pink', margin: 15,color: "white"}}
                onClick={() => handleRobotToButton(5)}
              >Table 5
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

