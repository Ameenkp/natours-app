// Define the interface for the start location
export interface StartLocation {
  description: string;
  type: string;
  coordinates: [number, number];
  address: string;
}

// Define the interface for a location
export interface Location {
  _id: string;
  description: string;
  type: string;
  coordinates: [number, number];
  day: number;
}

// Define the interface for a tour
export interface Tour {
  startLocation: StartLocation;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  startDates: string[];
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  guides: string[];
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  locations: Location[];
}

export class TourClass implements Tour {
  startLocation: StartLocation;
  ratingsAverage: number;
  ratingsQuantity: number;
  images: string[];
  startDates: string[];
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  guides: string[];
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  locations: Location[];

  constructor(
    startLocation: StartLocation,
    ratingsAverage: number,
    ratingsQuantity: number,
    images: string[],
    startDates: string[],
    id: string,
    name: string,
    duration: number,
    maxGroupSize: number,
    difficulty: string,
    guides: string[],
    price: number,
    summary: string,
    description: string,
    imageCover: string,
    locations: Location[],
  ) {
    this.startLocation = startLocation;
    this.ratingsAverage = ratingsAverage;
    this.ratingsQuantity = ratingsQuantity;
    this.images = images;
    this.startDates = startDates;
    this._id = id;
    this.name = name;
    this.duration = duration;
    this.maxGroupSize = maxGroupSize;
    this.difficulty = difficulty;
    this.guides = guides;
    this.price = price;
    this.summary = summary;
    this.description = description;
    this.imageCover = imageCover;
    this.locations = locations;
  }
}

// Define the class implementing the Tour interface
