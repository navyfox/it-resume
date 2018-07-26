import React from 'react';
import {Switch, Route} from 'react-router-dom';
import SearchResumePage from './Components/SearchResumePage';
import ResumeItemPage from './Components/ResumeItemPage';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Switch>
                <Route exact path='/search' component={SearchResumePage}/>
                <Route path='/resume/:number' component={ResumeItemPage}/>
            </Switch>
        );
    }
}

export default Main;
