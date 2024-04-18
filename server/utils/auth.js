
const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
const expiration = '2h';
module.exports = {
  authMiddleware: function (req, res, next) {

   
      const operationName = req.body.operationName
      
      if (operationName === 'addUser' || operationName === 'loginUser' ) {
        return next();
      }
    

      const authorizationHeader = req.headers.authorization || '';
      const token = authorizationHeader.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ message: 'You have no token!' });
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (err) {
      console.log('Invalid token:', err);
      return res.status(401).json({ message: 'Invalid token!' });
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
