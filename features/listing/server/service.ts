import { insertListing } from './dao';

export type NewListingInput = {
  host_id: string;
  title: string;
  location: string;
  description?: string;
  price_per_night: number;
  photos?: string[];
  amenities?: string[];
};

export async function createListing(input: NewListingInput) {
  return await insertListing(input);
}
