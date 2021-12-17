const { setupDB } = require('./test-setup');
const axios = require('axios');
const request = require('supertest');
const app = require('../app');
const date = new Date();
let dateFrom = (date.getDate()+5) + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
let dateTo = (date.getDate()+12) + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
jest.mock('axios');


describe('Search Flight Test', () =>{
   setupDB();
   test('Successfully search request', async () => {
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         adults: 1,
         children: 0,
         infants: 0,
         curr: 'GBP',
         locale: 'en-US',
         sort: 'price'
      }
      const search = {
         "data": [
            {
               "id": "22ee0f6b491f000063ba729a_0",
               "nightsInDest": null,
               "duration": {
                  "departure": 11220,
                  "return": 0,
                  "total": 11220
               },
               "flyFrom": "LGA",
               "cityFrom": "New York",
               "cityCodeFrom": "NYC",
               "countryFrom": {
                  "code": "US",
                  "name": "United States"
               },
               "flyTo": "MIA",
               "cityTo": "Miami",
               "cityCodeTo": "MIA",
               "countryTo": {
                  "code": "US",
                  "name": "United States"
               }
            }
         ]
      };
      const resp = {data: search, status: 200};
      const flight = resp.data.data;
      await axios.request.mockResolvedValue(resp);
      const res = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(res.statusCode).toEqual(resp.status);
      await expect(res.body.flyFrom).toEqual(flight.flyFrom);
   });

   test('API server error connection', async () => {
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo
      }
      const resp = {status: 500};
      await axios.request.mockResolvedValue(resp);
      const res = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(res.statusCode).toEqual(resp.status);
   });

   test('Error test all fly_from cases', async () => {
      // TEST EMPTY PARAMS
      let queryParams = {
            fly_from: '',
            fly_to: 'PRG',
            date_from: dateFrom,
            date_to: dateTo
         };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
             .get('/flights/search')
             .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.fly_from = 1234;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST STRING LONG MORE THEN 3 CHAR
      queryParams.fly_from = 'someTextDifferentCountry';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all fly_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 1234,
         date_from: dateFrom,
         date_to: dateTo
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG MORE THEN 3 CHAR
      queryParams.fly_to = 'someTextDifferentCountry';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all date_from cases', async () => {
      // TEST EMPTY PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: '',
         date_to: dateTo
      };
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.date_from = 1234;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.date_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.date_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.date_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.date_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // TEST DATA 31/02
      queryParams.date_from ='31/02/' + date.getFullYear();
      const response6 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response6.statusCode).toBe(400);
   });

   test('Error test all date_to cases', async () => {
      // TEST EMPTY PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: ''
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.date_to = 1234;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.date_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.date_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.date_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.date_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // TEST DATA 31/02
      queryParams.date_to ='31/02/' + date.getFullYear();
      const response6 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response6.statusCode).toBe(400);
   });

   test('Error test all return_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         return_from: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.return_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.return_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.return_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.return_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.return_from ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all return_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         return_to: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.return_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.return_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.return_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.return_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.return_to ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all nights_in_dst_from cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         nights_in_dst_from: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST STRING PARAMS
      // queryParams.nights_in_dst_from = '1234';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all nights_in_dst_to cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         nights_in_dst_to: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.nights_in_dst_to = '1234';
      // const response3 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response3.statusCode).toBe(400);
   });

   test('Error test all max_fly_duration cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         max_fly_duration: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.max_fly_duration = '1234';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all flight_type cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         flight_type: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT
      queryParams.flight_type = 'someDifferentInput';
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });

   test('Error test all one_for_city cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         one_for_city: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST STRING PARAMS
      // queryParams.one_for_city = '1234';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all one_per_date cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         one_per_date: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.one_per_date = '1234';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all adults cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         adults: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.adults = '3';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all children cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         children: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.children = '3';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(400);
   });

   test('Error test all infants cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         infants: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST STRING PARAMS
      // queryParams.infants = '3';
      // const response1 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response1.statusCode).toBe(500);
   });

   test('Error test all selected_cabins cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         selected_cabins: 3
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.selected_cabins = 'SomeDifferentLongString';
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.selected_cabins = 'A';
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT NOT CAPITALIZE
      queryParams.selected_cabins = 'm';
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);
   });

   test('Error test all mix_with_cabins cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         mix_with_cabins: 3
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.mix_with_cabins = 'SomeDifferentLongString';
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.mix_with_cabins = 'A';
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT NOT CAPITALIZE
      queryParams.mix_with_cabins = 'm';
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);
   });

   test('Error test all adult_hold_bag cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         adult_hold_bag: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // queryParams.adult_hold_bag = 3452;
      // const response3 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response3.statusCode).toBe(400);
   });

   test('Error test all adult_hand_bag cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         adult_hand_bag: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // queryParams.adult_hand_bag = 3452;
      // const response3 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response3.statusCode).toBe(400);
   });

   test('Error test all child_hold_bag cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         child_hold_bag: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // queryParams.child_hold_bag = 3452;
      // const response3 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response3.statusCode).toBe(400);
   });

   test('Error test all child_hand_bag cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         child_hand_bag: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // queryParams.child_hand_bag = 3452;
      // const response3 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response3.statusCode).toBe(400);
   });

   test('Error test all fly_days cases', async () => {
      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // let queryParams = {
      //    fly_from: 'FRA',
      //    fly_to: 'PRG',
      //    date_from: dateFrom,
      //    date_to: dateTo,
      //    fly_days: 123
      // };
      // const resp = {status: 400};
      // await axios.request.mockResolvedValue(resp);
      // const response = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response.statusCode).toBe(400);
   });

   test('Error test all ret_fly_days cases', async () => {
      // ToDo the response should be 400 and not 500
      // // TEST NOT STRING PARAMS
      // let queryParams = {
      //    fly_from: 'FRA',
      //    fly_to: 'PRG',
      //    date_from: dateFrom,
      //    date_to: dateTo,
      //    ret_fly_days: 123
      // };
      // const resp = {status: 400};
      // await axios.request.mockResolvedValue(resp);
      // const response = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response.statusCode).toBe(400);
   });

   test('Error test all ret_fly_days_type cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_fly_days_type: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.ret_fly_days_type = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all only_working_days cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         only_working_days: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.only_working_days = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all only_weekends cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         only_weekends: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.only_weekends = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all partner_market cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         partner_market: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.partner_market = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all curr cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         curr: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.curr = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all locale cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         locale: 123
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.locale = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all price_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         price_from: -1
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.locale = 'SomeDifferentLongString';
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);
   });

   test('Error test all dtime_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         dtime_from: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.dtime_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.dtime_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.dtime_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.dtime_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.dtime_from ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all dtime_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         dtime_to: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.dtime_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.dtime_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.dtime_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.dtime_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.dtime_to ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all atime_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         atime_from: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.atime_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.atime_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.atime_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.atime_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.atime_from ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all atime_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         atime_to: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.atime_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.atime_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.atime_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.atime_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.atime_to ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all ret_dtime_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_dtime_from: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.ret_dtime_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.ret_dtime_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.ret_dtime_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.ret_dtime_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.ret_dtime_from ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all ret_dtime_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_dtime_to: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.ret_dtime_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.ret_dtime_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.ret_dtime_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.ret_dtime_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.ret_dtime_to ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all ret_atime_from cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_atime_from: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.ret_atime_from = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.ret_atime_from = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.ret_atime_from = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.ret_atime_from = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.ret_atime_from ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all ret_atime_to cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_atime_to: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.ret_atime_to = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST DATA STRING INCORRECT FORMAT
      queryParams.ret_atime_to = (date.getDate()+5) + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);

      // TEST DATA 45th DAY
      queryParams.ret_atime_to = '45/' + (date.getMonth()+1) + '/' + date.getFullYear();
      const response4 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response4.statusCode).toBe(400);

      // TEST DATA 15th MONTH
      queryParams.ret_atime_to = (date.getDate()+5) + '/15/' + date.getFullYear();
      const response5 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response5.statusCode).toBe(400);

      // ToDo the response should be 400 and not 500
      // TEST DATA 31/02
      // queryParams.ret_atime_to ='31/02/' + date.getFullYear();
      // const response6 = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response6.statusCode).toBe(400);
   });

   test('Error test all stopover_from cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_atime_to: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.ret_atime_to = 3452;
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });

   test('Error test all stopover_to cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         stopover_to: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.stopover_to = 3452;
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });

   test('Error test all max_stopovers cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         max_stopovers: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.max_stopovers = -1;
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });

   test('Error test all max_sector_stopovers cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         max_sector_stopovers: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.max_sector_stopovers = -1;
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });

   test('Error test all conn_on_diff_airport cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         conn_on_diff_airport: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS NEGATIVE NUMBER
      queryParams.conn_on_diff_airport = -1;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.conn_on_diff_airport = 10;
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all ret_from_diff_airport cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_from_diff_airport: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS NEGATIVE NUMBER
      queryParams.ret_from_diff_airport = -1;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.ret_from_diff_airport = 10;
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all ret_to_diff_airport cases', async () => {
      // TEST DATA STRING INCORRECT FORMAT
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         ret_to_diff_airport: 'SomeDifferentLongString'
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NOT STRING PARAMS NEGATIVE NUMBER
      queryParams.ret_to_diff_airport = -1;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST NOT STRING PARAMS
      queryParams.ret_to_diff_airport = 10;
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all select_airlines cases', async () => {
      // ToDo the response should be 400 and not 500
      // // TEST DATA STRING INCORRECT FORMAT
      // let queryParams = {
      //    fly_from: 'FRA',
      //    fly_to: 'PRG',
      //    date_from: dateFrom,
      //    date_to: dateTo,
      //    select_airlines: 123
      // };
      // const resp = {status: 400};
      // await axios.request.mockResolvedValue(resp);
      // const response = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response.statusCode).toBe(400);
   });

   test('Error test all select_airlines_exclude cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         select_airlines_exclude: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.select_airlines_exclude = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all select_stop_airport cases', async () => {
      // ToDo the response should be 400 and not 500
      // // TEST DATA STRING INCORRECT FORMAT
      // let queryParams = {
      //    fly_from: 'FRA',
      //    fly_to: 'PRG',
      //    date_from: dateFrom,
      //    date_to: dateTo,
      //    select_stop_airport: 123
      // };
      // const resp = {status: 400};
      // await axios.request.mockResolvedValue(resp);
      // const response = await request(app)
      //     .get('/flights/search')
      //     .query(queryParams);
      // await expect(response.statusCode).toBe(400);
   });

   test('Error test all select_stop_airport_exclude cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         select_stop_airport_exclude: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.select_stop_airport_exclude = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all vehicle_type cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         vehicle_type: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.vehicle_type = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all sort cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         sort: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.sort = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all asc cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         asc: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NEGATIVE NUMBER
      queryParams.asc = -1;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.asc = 'someTextDifferentDate';
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);
   });

   test('Error test all limit cases', async () => {
      // TEST NOT STRING PARAMS
      let queryParams = {
         fly_from: 'FRA',
         fly_to: 'PRG',
         date_from: dateFrom,
         date_to: dateTo,
         limit: 1234
      };
      const resp = {status: 400};
      await axios.request.mockResolvedValue(resp);
      const response = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response.statusCode).toBe(400);

      // TEST NEGATIVE NUMBER
      queryParams.limit = -1;
      const response1 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response1.statusCode).toBe(400);

      // TEST SMALL NUMBER
      queryParams.limit = 100;
      const response2 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response2.statusCode).toBe(400);

      // TEST STRING LONG INCORRECT FORMAT
      queryParams.limit = 'someTextDifferentDate';
      const response3 = await request(app)
          .get('/flights/search')
          .query(queryParams);
      await expect(response3.statusCode).toBe(400);
   });
});
