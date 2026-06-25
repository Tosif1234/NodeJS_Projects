import morgan from 'morgan';

morgan.token('body', (req) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const bodyCopy = { ...req.body };
    if (bodyCopy.password) bodyCopy.password = '***';
    if (bodyCopy.token) bodyCopy.token = '***';
    if (bodyCopy.refreshToken) bodyCopy.refreshToken = '***';
    return JSON.stringify(bodyCopy);
  }
  return '';
});

const loggerMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');
  }
  return morgan(':method :url :status :response-time ms - body: :body');
};

export default loggerMiddleware;
