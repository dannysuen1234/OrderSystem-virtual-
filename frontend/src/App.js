import React, { Component } from 'react';
import {BrowserRouter , Route , Switch} from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { PrivateRouteCustomer } from './components/PrivateRouteCustomer';
import Registerform  from './components/Registerform';
import Loginform from './components/Loginform';
import Main from './components/Main';
import Menumanagement from './components/Menumanagement';
import Additem from './components/Additem';
import Updateitem from './components/Updateitem';
import Customerform from './components/Customer_details';
import {isLoggedInManager} from './components/auth';
import {isLoggedInCustomer} from './components/auth';
import Example from './components/QRscanner';
import Customermenu from './components/Customermenu';
import Checkout from './components/Checkout';
import Pay from './components/Pay';
import Home from './components/Home';
import QRScan from './components/ScanTable';
import RobotPage from './components/RobotPage';


class App extends Component {
  
  render() {
    return (
          <BrowserRouter>
           <Switch>
             <Route exact path="/" component={Home} />
             
             {/*<Route exact path="/register" component={Registerform} />*/}
             <Route exact path="/login" component={Loginform} />
             <PrivateRoute exact isloggedin={isLoggedInManager()} path="/main" component={Main} />
             <PrivateRoute exact path="/menu" component={Menumanagement} />
             <PrivateRoute exact path="/add" component={Additem} />
             <PrivateRoute exact path="/update" component={Updateitem} />
             <PrivateRoute exact path="/register" component={Registerform} />
             <PrivateRoute exact path="/robot" component={RobotPage} />
             <Route exact  path="/customer" component={Customerform} />
             <PrivateRouteCustomer exact isloggedin={isLoggedInCustomer()} path="/scan" component={QRScan} />
             <PrivateRouteCustomer exact path="/place_order" component={Customermenu} />
             <PrivateRouteCustomer exact path="/pay" component={Pay} />
             <PrivateRouteCustomer exact path="/checkout" component={Checkout} />
             <Route exact path="/scanTable" component={QRScan} />
             
           </Switch>
          </BrowserRouter>
    );
  }
}

export default App;
