import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import "./forms.css";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import './customer.css'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

export default class QRScan extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 500,
      result: '',
    }
    this.tableNo = "-1"
    const queryParams = new URLSearchParams(window.location.search);
    this.tableNo = queryParams.get('table')
    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    if(data){
      this.setState({ result: data })
      if (sessionStorage.getItem("customer_access_token") !== null && sessionStorage.getItem("customer_access_token")!=="undefined") {
        const sessionidx = sessionStorage.getItem("customer_access_token")
         fetch(`/add_table/${sessionidx}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.state.result)
        }).then( res => {
            if(res.ok){
                window.location.replace("/place_order")
            }
            else{
              console.log("data not sent")
            }
        })
      }
      else{
        alert("Customer details not entered")
      }
    }
    else{
      console.log("Not working")
    }
  }

  handleError(err){
    console.error(err)
  }

  //send table number to backend
  sendTableNumber(){
    const sessionidx = sessionStorage.getItem("customer_access_token")
    this.setState({ result: this.tableNo })
    fetch(`/add_table/${sessionidx}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.result)
    }).then( res => {
      if(res.ok){
        window.location.replace("/place_order")
      }else{
        console.log("data not sent")
      }
    })
  }
  
  //creat and send Customer Token
  createAndSendCusToken = async() => {
      const name = "Table "+this.tableNo + "'s Customer"
      const email = "table"+this.tableNo+"@W311.com";
      const mobile = "8888";
      const guests = "-1";
      const user = {name, email, mobile, guests};
      const isValid = true;
      if(isValid){
        fetch('/customer_details', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }).then( res => res.json())
        .then(data=>{
           sessionStorage.setItem('customer_access_token', data.customer_access_token);
          
           sessionStorage.setItem('customer_email', data.email);
    
          if (sessionStorage.getItem("customer_access_token") !== null && sessionStorage.getItem("customer_access_token")!=="undefined") {
            console.log("Customer token ok!")
            this.sendTableNumber()
          }
          else{
              alert(data.error)
          }
        }).catch(err => console.log(err));
  
      }
      else{
        console.log("bye")
      }
  }


  // when click the "Place Order buttom"
  clickButtom(){
    if (sessionStorage.getItem("customer_access_token") !== null && sessionStorage.getItem("customer_access_token")!=="undefined") {
      this.createAndSendCusToken()
    }else{
      this.createAndSendCusToken()
    }
  }

  render(){
    const previewStyle = {
      height: 500,
      width: 800,
      margin: "auto"
    }

    return(
      <div className="bg">
        {/*<QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
          <p style={{textAlign:"center"}}>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h1>Result: {this.state.result}</h1>
          </p>
        */}
        <MuiThemeProvider>
          <div className="cuss">
            <h1 style={{textAlign: "center"}} >Your Table is {this.tableNo}</h1><br/>
            <button 
              style={{display:"block", width: "100%", padding:" 15px 32px",fontSize:"20px", backgroundColor:'purple', color: "white", pointerEvents: "cursor"}}
              onClick={() =>  this.clickButtom()}
            >
              Place Order Now!
            </button>
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}
 