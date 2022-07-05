export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.status || 500).send({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}
