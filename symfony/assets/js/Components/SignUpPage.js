import React from 'react';
import Grid from '@material-ui/core/Grid';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import MenuBar from "./MenuBar";
import {signUp} from "../reducers/user";

class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            pass: '',
            email: '',
        };
    };

    handleSignUp = () => {
        this.props.signUp(this.state.name, this.state.pass, this.state.email);
        this.props.history.push('/login');
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
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-login__container">
                                <TextField
                                    id="password-input"
                                    className="text-field-login"
                                    label="Password"
                                    value={this.state.pass}
                                    onChange={this.handleChange('pass')}
                                    type="password"
                                    autoComplete="current-password"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-login__container">
                                <TextField
                                    id="email"
                                    className="text-field-login"
                                    label="Enter your Email"
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.handleChange('email')}
                                    autoComplete="current-email"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" size="medium" color="primary" onClick={this.handleSignUp}>
                                    SIGN UP
                                </Button>
                            </Grid>
                            <Grid item>
                                <Link to="/login" className="link-button">
                                    <Button size="small" color="primary">LOGIN</Button>
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
    signUp,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
