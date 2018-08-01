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
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import {Api} from '../api';

class ChangeResumePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            text: '',
            name: '',
            image: '',
            selectedOption: undefined,
            optionalID: [],
            load: false,
            isEdit: false
        };
    };

    componentDidMount() {
        const url = `http://cms.it-resume.local:8080/api_v2/resume_by_user`;

        axios.get(url, {withCredentials: true}).then(response => {
            return response.data;
        }).then(data => {
            if (data.isFind) {
                const item = data.items[0];
                this.setState({
                    id: item.id,
                    title: item.title,
                    text: item.text,
                    name: item.name,
                    image: item.image,
                    field_tags: item.field_tags,
                    optionalID: item.field_tags.map(i => i.value),
                    isEdit: true,
                });
            } else {
                this.setState({isEdit: false});
            }
            return data;
        }).then(data => {
            this.setState({
                load: true,
            });
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSelectChange = (option) => {
        this.setState({selectedOption: option, optionalID: option.map(i => i.value)});
    };

    handleSave = () => {
        if (!this.state.isEdit) {
            Api.postResume(this.state);
        } else {
            Api.editResume(this.state);
        }
        this.props.history.push("/");
    };

    filterColors = (inputValue, terms) =>
        terms.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase())
        );

    getTerms = (inputValue) => {
        const url = `http://cms.it-resume.local:8080/api_v2/terms?query=${inputValue}`;
        return axios.get(url).then(response => {
            return response.data.terms;
        }).then((terms) => {
            return this.filterColors(inputValue, terms)
        });
    };

    isValidNewOption = (inputValue, selectValue, selectOptions) => {
        return !(inputValue.trim().length === 0 || selectOptions.find(option => option.name === inputValue));
    };

    render() {
        console.log('id', this.state.optionalID);
        if (!this.state.load) {
            return (<div>
                <MenuBar history={this.props.history}/>
                <Grid container>
                </Grid>
            </div>);
        }
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
                                <input accept="image/*" className="field-image" id="icon-button-file" type="file"/>
                                <label htmlFor="icon-button-file">
                                    <IconButton color="primary" component="span">
                                        <PhotoCamera/>
                                    </IconButton>
                                </label>
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <TextField
                                    id="title"
                                    label="Title"
                                    className="text-field-edit"
                                    value={this.state.title}
                                    onChange={this.handleChange('title')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <TextField
                                    id="multiline-flexible"
                                    label="Description"
                                    multiline
                                    rowsMax="8"
                                    value={this.state.text}
                                    className="text-field-edit"
                                    onChange={this.handleChange('text')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item className="text-field-edit__container">
                                <AsyncCreatableSelect
                                    isMulti
                                    onChange={this.handleSelectChange}
                                    isValidNewOption={this.isValidNewOption}
                                    cacheOptions
                                    defaultOptions
                                    defaultValue={this.state.field_tags}
                                    loadOptions={this.getTerms}
                                    className="basic-multi-select select"
                                    classNamePrefix="select"
                                    placeholder="My skills..."
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" size="medium" color="primary"
                                        onClick={this.handleSave}>
                                    SAVE
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
