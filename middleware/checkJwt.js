// Dans checkJwt.js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.TENANT_ID}/discovery/v2.0/keys`,
});

async function checkJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('Invalid token structure');
    }

    const key = await client.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    const verifiedToken = jwt.verify(token, publicKey, {
      audience: process.env.CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${process.env.TENANT_ID}/v2.0`,
    });

    req.user = verifiedToken;
    next();
  } catch (err) {
    console.error('JWT validation error:', err.message);
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

module.exports = { checkJwt };  // Assurez-vous que vous exportez checkJwt
