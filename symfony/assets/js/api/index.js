import axios from 'axios';

const baseUrl = 'http://cms.it-resume.local:8080/api_v2/';

export class Api {

    static getResumeItem = (id) => {
        const url = `${baseUrl}resume/${id}`;
        return axios.get(url).then(response => {
            return response.data.item;
        });
    };

}
