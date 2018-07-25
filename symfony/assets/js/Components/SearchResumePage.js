/**
 * Created by rim on 25.07.2018.
 */
import '../../css/app.css'
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Select from 'react-select';
import axios from 'axios'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import AsyncSelect from 'react-select/lib/Async';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ItemCard from './ItemCard';
import CssBaseline from '@material-ui/core/CssBaseline';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

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
        console.log('inputValue', inputValue);
        //const response = axios.get(url).then(function (response) {
        //    // handle success
        //    console.log('resp', response);
        //    console.log(response.data);
        //    return response.data.terms;
        //});

        return axios.get(url).then(function (response) {
            // handle success
            //console.log('resp', response);
            //console.log(response.data);
            return response.data.terms;
        }).then((terms) => {
            //console.log('terms', terms);
            return this.filterColors(inputValue, terms)
        });
    };

    //componentDidMount() {
    //fetch('/data')
    //  .then(response => response.json())
    //  .then(entries => {
    //    this.setState({
    //      entries
    //    });
    //  });
    //  fetch('/test')
    //      .then(response => response.json())
    //      .then(obj => {
    //          console.log(obj);
    //          this.setState({
    //              options: obj.options
    //          });
    //      });
    //}

    searchResume = () => {
        this.setState({page: 0});
        const url = `http://cms.it-resume.local:8080/api_v2/search?page=${this.state.page}`;

        let request = {'skills_tags': this.state.searchId};
        return axios.post(url, request).then(function (response) {
            // handle success
            console.log('RESP', response.data);
            //console.log('next_page', response.data.next_page);
            //if(response.data.next_page == 0) {
            //    console.log('next_page_search', response.data.next_page);
            //    this.setState({next_page: response.data.next_page});
            //}
            return response.data;
        }).then((items) => {
            this.setState({next_page: items.next_page});
            this.setState({entries: items.items});
        });
    };

    nextPageResume = () => {
        //let nextPage = this.state.page + 1;
        //this.setState({page: nextPage});
        console.log('next_page', this.state.next_page);

        if (this.state.next_page === false) {
            return undefined;
        }
        const url = `http://cms.it-resume.local:8080${this.state.next_page}`;

        let request = {'skills_tags': this.state.searchId};
        return axios.post(url, request).then((response) => {
            // handle success
            console.log('RESP', response.data);
            this.setState({next_page: response.data.next_page});
            return response.data.items;
        }).then((items) => {
            let newItems = [...this.state.entries, ...items];
            //newItems = []
            //newItems.push(items);
            this.setState({entries: newItems});
        });
    };

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <CssBaseline />
                    <AsyncSelect
                        //defaultValue={[colourOptions[2], colourOptions[3]]}
                        className='select'
                        isMulti
                        //name="colors"
                        //labelKey="value"
                        //valueKey="id"
                        onChange={this.handleChange}
                        cacheOptions
                        defaultOptions
                        //options={options}
                        loadOptions={this.getTerms}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                    <Button variant="contained" size="medium" color="primary" onClick={this.searchResume}>
                        GO
                    </Button>
                    <div className="item">
                        {
                            this.state.entries.map(
                                ({ id, name, title, text }) => {
                                    console.log(id);
                                    console.log(name);
                                    console.log(title);
                                    console.log(text);
                                    return (
                                        <ItemCard
                                            key={id}
                                            author={name}
                                            title={title}
                                            style={{ flex: 1, margin: 10 }}
                                        >
                                            {text}
                                        </ItemCard>
                                    );
                                }
                            )
                        }
                    </div>
                    <Button variant="contained" size="medium" color="primary" onClick={this.nextPageResume}>
                        MORE
                    </Button>
                </div>
            </MuiThemeProvider>
        );
    }
}
export default withStyles(styles)(SearchResumePage);
