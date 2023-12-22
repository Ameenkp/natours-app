import { Document, Query, QueryOptions } from 'mongoose';

export class APIFeatures<T extends Document> {
  private query: Query<T[], T>;

  private readonly options: QueryOptions;

  constructor(query: Query<T[], T>, options: QueryOptions) {
    this.query = query;
    this.options = options;
  }

  filter(): this {
    const filteredOptions: QueryOptions = { ...this.options };
    const excludedFields = ['fields', 'sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete filteredOptions[el]);
    let queryString = JSON.stringify(filteredOptions);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryString));
    return this;
  }

  sort(): this {
    if (this.options.sort) {
      const sortOrder = this.options.sort.split(',').join(' ');
      this.query = this.query.sort(sortOrder);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.options.fields) {
      const fields = this.options.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate(): this {
    const page = this.options.page || 1;
    const limit = this.options.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  execute(): Query<T[], T> {
    return this.query;
  }
}
