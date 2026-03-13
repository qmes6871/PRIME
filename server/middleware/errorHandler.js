function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: '입력 데이터가 올바르지 않습니다.',
      details: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: '이미 존재하는 데이터입니다.'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || '서버 오류가 발생했습니다.'
  });
}

module.exports = errorHandler;
