import { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert'

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthtoken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

if (localStorage.token) {
  setAuthtoken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, []);

  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar></Navbar>
        <Route exact path='/' component={Landing}></Route>
        <section className="container">
         <Alert/>
          <Switch>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </section>
      </Fragment>
    </Router>
    </Provider>
  )
};



  

export default App;
