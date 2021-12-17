const saveLog = require("../util/saveLog");
const { unlink } =require( 'fs');


test('save log in a file', async () => {
        const file = './log/test.log';
        const error = 'wrong location url path, expected: "/locations/dump",pass: "'

        await saveLog(error, file).then(async data => {
                expect(data).toBe(true);
        });
        unlink(file, (err) => {});
});