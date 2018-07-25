//import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import SearchResumePage from './Components/SearchResumePage';


class App extends React.Component {
    //constructor() {
    //    super(props);
    //    this.state = {
    //    };
    //}

    render() {
        return (
            <Switch>
                <Route exact path='/search' component={SearchResumePage}/>
            </Switch>
        );
    }
}
export default App;
