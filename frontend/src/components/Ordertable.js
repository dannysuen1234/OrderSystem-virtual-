import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const test = fooditem => {
  return (
      <ul>
        {fooditem.map((x,i) => {
          const totalprice = x.quantity*x.price;
        return <li>{x.name} x{x.quantity}: HKD:{totalprice}</li>
        })}
      </ul>
  )
}

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
      console.log("Status Updated"+ data);
    }
  })
}

const handleUpdate = (x) => {
  const data = {'status': 'Food is ready.'};
  const tempRobot = {'robot_no': '','tableno':0};
  fetch(`/update_status/${x.orderid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then( res => res.json()).then(data =>{
    if(data.robotid != -1){
      tempRobot.robot_no = data.robotid
      tempRobot.tableno = 0
      handleThisRobotToTable(tempRobot)
    }
  })
}


const handleThisRobotToTable = (x) => {
  const data = {'robot':parseInt(x.robot_no), 'mission': parseInt(x.tableno),'record': false};
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
      handleThisRobotToTable(x)
    }
  })
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
          {/*console.log(x['food'])*/}
           {
           y.prop === 'food' ? test(JSON.parse(x[y.prop])) : x[y.prop]/*test if is food. Yes ->test()*/}
        </TableCell>
      ))}
        <TableCell>
          {x.status === 'Food is being prepared.' ? 
            <Button 
              variant="contained" 
              style={{backgroundColor: 'blue', margin: 15,color: "white"}}
              onClick={() => handleUpdate(x)}
            >Order Ready
            </Button> 
          : <Button disabled>Robot Coming</Button>
          }
          {x.status === 'All Robot are Buzy' ? 
            <Button 
              variant="contained" 
              style={{backgroundColor: 'blue', margin: 15,color: "white"}}
              onClick={() => handleUpdate(x)}
            >Call Robot Again
            </Button> 
          : <Button disabled></Button>
          }
          {x.status === 'Food is ready.' ?  
            <Button variant="contained" 
              style={{backgroundColor: 'green', margin: 15,color: "white"}}
              onClick={() => handleRobotToTable(x)}
            >Send to Table {x.tableno}
            </Button>
          : <Button disabled>Going to Table</Button>
          }
          <Button variant="contained" 
            style={{backgroundColor: 'red', margin: 15,color: "white"}}
            onClick={() => handleRemove(i)}
          >Delete
          </Button>
        </TableCell>
      </TableRow>
    );
  };



export default function SimpleTable(props) {
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
        </TableBody>
      </Table>
    </TableContainer>
  );
}

