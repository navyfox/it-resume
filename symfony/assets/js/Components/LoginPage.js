import React from 'react';
import Grid from '@material-ui/core/Grid';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import MenuBar from "./MenuBar";
import {loginUser} from "../reducers/user";


class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pass: '',
        };
    };

    handleLogin = () => {
        this.props.loginUser(this.state.name, this.state.pass);
        this.props.history.push("/");
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        return (
            <div>
                <MenuBar history={this.props.history}/>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container spacing={16} alignItems="center" direction="column" justify="center">
                            <Grid item className="text-field-login__container">
                                <TextField
                                    id="name"
                                    label="Name"
                                    className="text-field-login"
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-login__container">
                                <TextField
                                    id="password-input"
                                    className="text-field-login"
                                    label="Password"
                                    type="password"
                                    onChange={this.handleChange('pass')}
                                    autoComplete="current-password"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" size="medium" color="primary" onClick={this.handleLogin}>
                                    LOGIN
                                </Button>
                            </Grid>
                            <Grid item>
                                <Link to="/signup" className="link-button">
                                    <Button size="small" color="primary">sign up</Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({user: state.user});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
    loginUser,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
