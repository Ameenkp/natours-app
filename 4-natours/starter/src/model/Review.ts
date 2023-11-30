export interface Review {
  _id: number;
  name: string;
  rating: number;
  comment: string;
}

export class ReviewClass implements Review {
  _id: number;
  name: string;
  rating: number;
  comment: string;

  constructor(_id: number, name: string, rating: number, comment: string) {
    this._id = _id;
    this.name = name;
    this.rating = rating;
    this.comment = comment;
  }

  /**
   * Creates a new ReviewClass instance.
   *
   * @param {number} id - The ID of the review.
   * @param {string} name - The name of the review.
   * @param {number} rating - The rating of the review.
   * @param {string} comment - The comment of the review.
   * @return {ReviewClass} The newly created ReviewClass instance.
   */
  static create(_id: number, name: string, rating: number, comment: string) {
    return new ReviewClass(_id, name, rating, comment);
  }

  getId() {
    return this._id;
  }

  setId(_id: number) {
    this._id = _id;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getRating() {
    return this.rating;
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  getComment() {
    return this.comment;
  }

  setComment(comment: string) {
    this.comment = comment;
  }
}
