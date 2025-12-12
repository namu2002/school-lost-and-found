
module.exports = (req, res, next) => {
  const password = req.headers['x-password']; 
  const ADMIN_PASSWORD = '5000'; 
  if (!password) {
    return res.status(401).json({ message: 'Password required!' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ message: 'Invalid password!' });
  }

  next(); 
};
