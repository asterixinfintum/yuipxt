import jwt from 'jsonwebtoken';

import TokenTracker from '../models/tokentracker';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.secretKeyJWT, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    if (user.username) {
      const validtoken = await TokenTracker.findOne({ unid: user._id, token });

      if (validtoken) {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }

      return
    }

    req.user = user;
    next();
  });
}

export default authenticateToken