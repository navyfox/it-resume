import React from 'react';
import {Switch, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SearchResumePage from './Components/SearchResumePage';
import ResumeItemPage from './Components/ResumeItemPage';
import LoginPage from './Components/LoginPage';
import SignUpPage from './Components/SignUpPage';
import ChangeResumePage from "./Components/ChangeResumePage";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return (
            <MuiThemeProvider>
                <Switch>
                    <Route exact path='/' component={SearchResumePage}/>
                    <Route path='/resume/:number' component={ResumeItemPage}/>
                    <Route exact path='/login' component={LoginPage}/>
                    <Route exact path='/signup' component={SignUpPage}/>
                    <Route exact path='/edit' component={ChangeResumePage}/>
                </Switch>
            </MuiThemeProvider>
        );
    }
}

export default App;
