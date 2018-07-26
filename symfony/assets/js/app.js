import React from 'react';
import {Switch, Route} from 'react-router-dom';
import MenuBar from './Components/MenuBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from './Main';


class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <MenuBar/>
                    <Main/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
