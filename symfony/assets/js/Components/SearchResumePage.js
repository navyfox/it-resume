/**
 * Created by rim on 25.07.2018.
 */
import '../../css/app.css';
import React from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/lib/Async';
import Button from '@material-ui/core/Button';
import ItemCard from './ItemCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class SearchResumePage extends React.Component {
    constructor() {
        super();
        this.state = {
            entries: [],
            options: [],
            selectedOption: '',
            searchId: [],
            page: 0,
            next_page: false,
        };
    }

    handleChange = (selectedOption) => {
        let searchId = selectedOption.map(i => i.value);
        this.setState({searchId});
    };

    filterColors = (inputValue, terms) =>
        terms.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase())
        );

    getTerms = inputValue => {
        const url = `http://cms.it-resume.local:8080/api_v2/terms?query=${inputValue}`;
        return axios.get(url).then(response => {
            return response.data.terms;
        }).then((terms) => {
            return this.filterColors(inputValue, terms)
        });
    };

    searchResume = () => {
        this.setState({page: 0});
        const url = `http://cms.it-resume.local:8080/api_v2/search?page=${this.state.page}`;

        let request = {'skills_tags': this.state.searchId};
        return axios.post(url, request).then(response => {
            return response.data;
        }).then((items) => {
            this.setState({next_page: items.next_page});
            this.setState({entries: items.items});
        });
    };

    nextPageResume = () => {
        if (this.state.next_page === false) {
            return undefined;
        }
        const url = `http://cms.it-resume.local:8080${this.state.next_page}`;

        let request = {'skills_tags': this.state.searchId};
        return axios.post(url, request).then(response => {
            this.setState({next_page: response.data.next_page});
            return response.data.items;
        }).then((items) => {
            let newItems = [...this.state.entries, ...items];
            this.setState({entries: newItems});
        });
    };

    render() {
        const buttonMore = this.state.next_page === false ? undefined : (
            <Grid item xs={12}>
                <Grid container justify="center" className="search__div-container-button-more">
                    <Grid item xs={2}>
                        <Button variant="contained" size="medium" color="primary" onClick={this.nextPageResume}>
                            MORE
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
        return (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={16}>
                        <Grid item xs={2} className="search-title">
                            <Typography className="search-title__text" variant="subheading">
                                Find the junior of your dreams
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <AsyncSelect
                                isMulti
                                onChange={this.handleChange}
                                cacheOptions
                                defaultOptions
                                loadOptions={this.getTerms}
                                className="basic-multi-select select"
                                classNamePrefix="select"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Button variant="contained" className="search-button" color="primary"
                                    onClick={this.searchResume}>
                                GO
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={16}>
                        {this.state.entries.map(({id, name, title, text, image}) => (
                            <Grid key={id} item xs={3} zeroMinWidth>

                                <ItemCard
                                    key={id}
                                    id={id}
                                    author={name}
                                    avatarUrl={image}
                                    title={title}
                                    style={{flex: 1, margin: 10}}
                                >
                                    {text}
                                </ItemCard>

                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                {buttonMore}
            </Grid>
        );
    }
}

export default SearchResumePage;
