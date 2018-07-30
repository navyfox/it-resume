import axios from 'axios';

const baseUrl = 'http://cms.it-resume.local:8080/api_v2/';

export class Api {

    static getResumeItem = (id) => {
        const url = `${baseUrl}resume/${id}`;
        return axios.get(url).then(response => {
            return response.data.item;
        });
    };

    static login = (name, pass) => {
        return axios({
            method: 'post',
            url: 'http://cms.it-resume.local:8080/user/login?_format=json',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            xsrfHeaderName: 'X-CSRF-Token',
            withCredentials: true,
            data: {
                name: name,
                pass: pass,
            }
        }).then(response => {
            return response;
        });
    };

    static logout = () => {
        return axios({
            method: 'post',
            url: 'http://cms.it-resume.local:8080/user/logout',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            xsrfHeaderName: 'X-CSRF-Token',
            withCredentials: true,
            data: {}
        }).then(response => {
            return response.status === 200;
        });
    };

    static register = (name, pass, email) => {
        return axios({
            method: 'post',
            url: 'http://cms.it-resume.local:8080/user/register?_format=json',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            xsrfHeaderName: 'X-CSRF-Token',
            data: {
                name: { value: name },
                mail: { value: email },
                pass: { value: pass },
            }
        }).then(response => {
            return response.data;
        });
    };

}
