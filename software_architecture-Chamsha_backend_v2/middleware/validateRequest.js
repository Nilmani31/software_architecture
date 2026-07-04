const hasValue = (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return true;
};

const validateRequest = ({ body = [], query = [], params = [] } = {}) => {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of body) {
      if (!hasValue(req.body?.[field])) {
        missingFields.push(`body.${field}`);
      }
    }

    for (const field of query) {
      if (!hasValue(req.query?.[field])) {
        missingFields.push(`query.${field}`);
      }
    }

    for (const field of params) {
      if (!hasValue(req.params?.[field])) {
        missingFields.push(`params.${field}`);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    next();
  };
};

module.exports = validateRequest;