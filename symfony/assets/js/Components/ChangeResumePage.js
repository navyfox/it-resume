import React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getResumeItem} from "../reducers/resumeItem";
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MenuBar from "./MenuBar";

class ChangeResumePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            text: '',
            name: '',
            image: '',
            multiline: '',
            field_tags: [],
        };
    };

    componentDidMount() {

    }

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
                            <Grid item className="text-field-edit__container">
                                <TextField
                                    id="name"
                                    label="Name"
                                    className="text-field-edit"
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <input accept="image/*" className="field-image" id="icon-button-file" type="file" />
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary"  component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <TextField
                                    id="title"
                                    label="Title"
                                    className="text-field-edit"
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <TextField
                                    id="multiline-flexible"
                                    label="Description"
                                    multiline
                                    rowsMax="8"
                                    value={this.state.multiline}
                                    className="text-field-edit"
                                    onChange={this.handleChange('multiline')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item >
                                <Button variant="contained" size="medium" color="primary" onClick={() => this.props.history.push("/login")}>
                                    SEND
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({resume: state.resumeItem});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getResumeItem,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(ChangeResumePage);
