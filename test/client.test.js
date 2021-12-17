const axios = require('axios');
const tequilaClient = require( "../flightClient/tequilaClient");


jest.mock('axios');

test('success client request', () => {
    const search = {
        "Example": [
            {
                "id": "foo",
                "int_id": "foo",
                "active": true,
                "code": "FOO",
                "name": "fooN",
                "slug": "fooS",
                "alternative_names": [],
                "rank": "0",
                "timezone": "foo"
            }
        ]
    };
    const resp = {data: search, status: 200};
    const bodyParams = {
        locale: 'en-US',
        location_types: 'airport',
        limit: 20,
        sort: 'name'
    }
    const path = '/test';

    axios.request.mockResolvedValue(resp);

    tequilaClient(bodyParams, path).then(response => {
        expect(axios.request).toHaveBeenCalled();
        expect(axios.request).toHaveBeenCalledWith({
            method: 'GET',
            url: 'https://tequila-api.kiwi.com/test',
            params: bodyParams,
            headers: {'apikey': process.env.API_KEY_TEQUILA}
        });
            expect(response.status).toEqual(200);
            expect(response.data).toEqual(search);
        })
        .catch(error => console.log(error));
});

test('failed client request server down', () => {
    const resp = {
        params: {},
        status: 500,
        headers: {},
        config: {},
    };
    const bodyParams = {
        locale: 'en-US',
        location_types: 'airport',
        limit: 20,
        sort: 'name'
    }
    const path = '/test';

    axios.request.mockResolvedValue(resp);
    tequilaClient(bodyParams, path).then(response => {
        expect(response.status).toEqual(resp.status);
    }).catch(error => console.log(error));
});
