import React, { useState,useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import RobotTable from "./RobotTable";


export default function Robot (){
  
  const [robotData, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
        fetch("/robot").then( res => res.json()).then(data =>{
            setData(data.robot_items)
        })
    }, 2000);
    return () => clearInterval(interval);
  }, []);


 const handleRemove = i => {
    let deletedata = robotData.filter((row, j) => j === i)
    let temp = JSON.stringify(deletedata);
    fetch('/robot_delete', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(deletedata)
    })
    setData(robotData.filter((row, j) => j !== i));
  };



    return (
      <MuiThemeProvider>
        <div>
          <RobotTable
           handleRemove={handleRemove}
           data={robotData}
           header={[
            {
              name: "Robot ID",
              prop: "robotid"
            },
            {
              name: "Robot Name",
              prop: "robot_name"
            },
            {
              name: "Robot Type",
              prop: "robot_type"
            },
            {
              name: "Control Methoods",
              prop: "robot_control_methoods"
            },
            {
              name: "Path",
              prop: "robot_control_path"
            },
            {
              name: "Status",
              prop: "status"
            },
            {
              name: "Active",
              prop: "active"
            }
          ]}
          />
        </div>
      </MuiThemeProvider>
    );
}
