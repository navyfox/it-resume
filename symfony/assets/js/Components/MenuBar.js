import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import '../../css/menu-bar.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {logoutUser, reload} from "../reducers/user";

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    };

    handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    handleLogout = () => {
        this.props.logoutUser();
        this.forceUpdate();
        this.props.history.push("/");
    };

    componentDidMount() {
        this.props.reload();
    }

    render() {
        const {anchorEl} = this.state;
        const menuList = this.props.user.auth === true ? (
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => this.props.history.push("/")}>Search</MenuItem>
                <MenuItem onClick={() => this.props.history.push("/edit")}>Edit</MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
        ) : (
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => this.props.history.push("/")}>Search</MenuItem>
                <MenuItem onClick={() => this.props.history.push("/login")}>Login</MenuItem>
                <MenuItem onClick={() => this.props.history.push("/signup")}>Sign up</MenuItem>
            </Menu>
        );
        return (
            <div className="menu-bar__div-container">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            aria-owns={anchorEl ? 'fade-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            className="menu-bar__button-icon-menu"
                            color="inherit" aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        {menuList}
                        <Typography variant="title" className="menu-bar__tittle" color="inherit">
                            IT-resume
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({user: state.user});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
    logoutUser,
    reload,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
