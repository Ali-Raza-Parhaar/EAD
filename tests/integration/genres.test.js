const request = require('supertest');
const {Genre} = require('../../model/genres.model');
let server;

describe('/api/genres', ()=> {
    
    beforeEach(()=> { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
        await Genre.remove({}); 
    });

    describe('GET /', ()=> {
        it('should return all genres', async () => {

            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);


            const res = await request(server).get('/api/genres');
            expect(res.body.length).toBe(2);
            expect(res.body.some(c=>c.name === 'genre1')).toBeTruthy();
            expect(res.body.some(c=>c.name === 'genre2')).toBeTruthy();
            expect(res.status).toBe(200);
        })
    })

    describe('GET/:id', ()=> {
        it('should return a genre if valid id is passed', async () => {
            const genre =  new Genre({
                name: 'genre1'
            })
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.body).toMatchObject({name: 'genre1'});
            expect(res.status).toBe(200);
        })


        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + 1234);
            expect(res.status).toBe(404);
        })

    })


})