const { setupDB } = require('./test-setup');
const {Location} = require('../database/models/create_location_table');
const locationController = require( "../controllers/locationController");
const saveLog = require("../util/saveLog");
const axios = require("axios");
jest.mock("../util/saveLog");
jest.mock('axios');

let queryParams = {
    locale: 'en-US',
    location_types: 'airport',
    limit: 20,
    sort: 'name'
}
let path = '/locations/dump';


describe("Location Test", () => {
    setupDB();
    test('success location api call and save file on DB', async () => {
        const search = {
            "locations": [
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
        const location = resp.data.locations;
        await axios.request.mockResolvedValue(resp);
        await locationController(queryParams, path)
        .then( async response => {
            await expect(response.status).toBe(resp.status);
            await expect(response.data).toBe(resp.data);

            // Todo IMPLEMENT BETTER METHOD
            // SLEEP THE PROCESS BECAUSE THE PROGRAM SAVE THE DATA AFTER THE Location.find
            await sleep(300);
            await Location.find({}, function (err, data) {
                if (!err) {
                     expect(data.length).toEqual(location.length);
                     expect(data[0].code).toEqual(location[0].code);
                }
            });
        });

        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
    });

    test('error location api call with wrong url path', async () => {
        path = '/test';
        await saveLog.mockReturnValue(true);
        await locationController(queryParams, path)
            .then(response => {
                expect(response).toBe(true);
            });
        path = '/locations/dump';
    });

    test('fail location api call wrong params', async () => {
        queryParams = {
            locale: 'en-US',
            location_types: 'airport',
            limit: 5,
            sort: 'name',
            foo: 'foo'
        }
        const resp = {status: 400};
        await axios.request.mockResolvedValue(resp);
        await locationController(queryParams, path)
            .then(response => {
                expect(response.status).toBe(resp.status);
            });
        queryParams = {
            locale: 'en-US',
            location_types: 'airport',
            limit: 20,
            sort: 'name'
        }
    });

    test('server down location api call', async () => {
        const resp = {status: 400};
        await axios.request.mockResolvedValue(resp);
        await locationController(queryParams, path)
        .then(response => {
            expect(response.status).toBe(resp.status);
        });
    });

    test('Failed validation', async () => {
        queryParams = {
            locale: 'en-US',
            location_types: 12332,
            limit: 'someText',
            sort: 1234
        }
        path = '/locations/dump';
        const resp = {data: 'error'};
        await axios.request.mockResolvedValue(resp);
        await locationController(queryParams, path)
            .then(response => {
                console.log(response);
                expect(response).toBe(resp.data);
            });
    });
});
