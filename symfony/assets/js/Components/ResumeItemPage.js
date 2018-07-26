import React from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import {Card, CardHeader, CardTitle, CardText, CardActions} from 'material-ui/Card';
import Chip from '@material-ui/core/Chip';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getResumeItem} from "../reducers/resumeItem";

class ResumeItemPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            title: '',
            text: '',
            name: '',
            image: '',
            field_tags: [],
        };
        this.id = parseInt(props.match.params.number, 10);
    };

    componentDidMount() {
        const url = `http://cms.it-resume.local:8080/api_v2/resume/${this.id}`;

        this.props.getResumeItem(this.id);

        return axios.get(url).then(response => {
            return response.data.item;
        }).then(item => {
            this.setState({
                id: item.id,
                title: item.title,
                text: item.text,
                name: item.name,
                image: item.image,
                field_tags: item.field_tags,
            });
        });
    }


    render() {
        return (
            <Grid item xs={12}>
                <Grid container justify="center" spacing={16}>
                    <Grid item xs={3} zeroMinWidth>
                        <Card>
                            <CardHeader title={this.state.name} avatar={this.state.image}/>
                            <CardTitle title={this.state.title}/>
                            <CardText>{this.state.text}</CardText>
                            {this.state.field_tags.map(({id, name}) => (
                                <Chip className="chip" key={id} label={name}/>
                            ))}
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({resume: state.resumeItem});
const mapDispatchToProps = (dispatch) => (bindActionCreators({
    getResumeItem,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(ResumeItemPage);
