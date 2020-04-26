class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1 A) FILTERING
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1 B) Advaced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // URL => /api/v1/tours?difficulty=easy&duration=5
    // console.log(req.query) => { difficulty: 'easy', duration: '5' }

    // ==> { difficulty: 'easy', duration: { $gte: '5' } } ---- this is what mongodb query looks like
    // ==> { difficulty: 'easy', duration: { gte: '5' } }  ----- this is console.log(req.query) - so replace gte with $gte
    this.query = this.query.find(JSON.parse(queryStr));
    return this;

    // {difficulty: 'easy', duration: { $gte: 5 }}
  }

  sort() {
    // 2) SORTING
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limit() {
    // 3) FIELD LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      // -__v will not include __v field
    }
    return this;
  }

  pagination() {
    // 4) PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
