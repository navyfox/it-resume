import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import '../../css/menu-bar.css';

class ButtonAppBar extends React.Component {
    constructor() {
        super();
        this.state = {};
    };


    render() {
        return (
            <div className="menu-bar__div-container">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className="menu-bar__button-icon-menu" color="inherit" aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" className="menu-bar__tittle" color="inherit">
                            IT-resume
                        </Typography>
                        <Button className='menu-bar__button-login' color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default ButtonAppBar;
