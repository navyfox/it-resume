import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Select from 'react-select';
import axios from 'axios'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import AsyncSelect from 'react-select/lib/Async';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ItemCard from './Components/ItemCard';
import CssBaseline from '@material-ui/core/CssBaseline';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            entries: [],
            options: [],
            selectedOption: '',
            searchId: [],
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

    componentDidMount() {
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
    }

    searchResume = () => {
        const inputValue = 0;
        const url = `http://cms.it-resume.local:8080/api_v2/search?page=${inputValue}`;

        let request = {'skills_tags': this.state.searchId};
        return axios.put(url, request).then(function (response) {
            // handle success
            console.log('RESP', response.data);
            return response.data.items;
        }).then((items) => {
            this.setState({entries: items});
        });
    };

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <CssBaseline />
                    <AsyncSelect
                        //defaultValue={[colourOptions[2], colourOptions[3]]}
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
                    <div style={{ display: 'flex' }}>
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
                </div>
            </MuiThemeProvider>
        );
    }
}
export default withStyles(styles)(App);
