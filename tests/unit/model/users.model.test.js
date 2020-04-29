const jwt = require('jsonwebtoken');
const config = require('config');

describe('tokenGenerator', () => {
    it('should return a valid jwt', ()=> {
        const id = '1234';
        const tokenGenerator = function(id) {
            const token = jwt.sign( {_id: id} ,config.get('jwtPrivateKey'));
            return token;
        }
        const token = tokenGenerator(id);
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(id).toBe(decoded._id);
    })
})

// const {User} = require('../../../model/users.model');
// const jwt = require('jsonwebtoken');
// const config = require('config');

// describe('user.generateAuthToken', () => {
//     it('should return valid jwt', ()=> {
//         const payload = {_id: 3};
//         const user = new User(
//             payload
//         );
//         const token = user.generateAuthToken();
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
//         expect(decoded).toMatchObject(payload);
//     })
// })