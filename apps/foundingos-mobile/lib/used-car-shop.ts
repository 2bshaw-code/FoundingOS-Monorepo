/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

export type CarBodyType = 'Hatchback' | 'SUV' | 'Saloon' | 'Pickup' | 'Van'

export type UsedCar = {
  id: string
  name: string
  price: number
  currency: string
  mileageKm: number
  year: number
  bodyType: CarBodyType
  fuel: string
  transmission: string
  color: string
  image: string
  description: string
  finance: { depositPct: number; monthly: number; termMonths: number }
}

export type CarFilters = {
  maxPrice?: number
  maxMileage?: number
  bodyType?: CarBodyType | 'All'
}

export const BODY_TYPE_FILTERS: Array<CarBodyType | 'All'> = ['All', 'Hatchback', 'SUV', 'Saloon', 'Pickup', 'Van']
export const PRICE_FILTERS: Array<{ label: string; value?: number }> = [
  { label: 'Any price', value: undefined },
  { label: 'Under $15k', value: 15000 },
  { label: 'Under $25k', value: 25000 },
  { label: 'Under $40k', value: 40000 },
]
export const MILEAGE_FILTERS: Array<{ label: string; value?: number }> = [
  { label: 'Any mileage', value: undefined },
  { label: 'Under 40k km', value: 40000 },
  { label: 'Under 80k km', value: 80000 },
  { label: 'Under 120k km', value: 120000 },
]

export const USED_CAR_INVENTORY: UsedCar[] = [
  {
    id: 'car-civic-2021',
    name: 'Honda Civic 1.5 Sport',
    price: 18900,
    currency: 'USD',
    mileageKm: 34200,
    year: 2021,
    bodyType: 'Hatchback',
    fuel: 'Petrol',
    transmission: 'Manual',
    color: 'Rallye Red',
    image: '/assets/demos/retail/cars/civic.png',
    description: 'One-owner Civic Sport with full service history, reverse camera, and lane-keep assist. Fresh MOT and two keys.',
    finance: { depositPct: 10, monthly: 349, termMonths: 48 },
  },
  {
    id: 'car-rav4-2020',
    name: 'Toyota RAV4 Hybrid AWD',
    price: 27400,
    currency: 'USD',
    mileageKm: 56800,
    year: 2020,
    bodyType: 'SUV',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    color: 'Graphite Grey',
    image: '/assets/demos/retail/cars/rav4.png',
    description: 'Efficient hybrid SUV with AWD, adaptive cruise, and heated seats. Ideal family workhorse with strong resale value.',
    finance: { depositPct: 10, monthly: 499, termMonths: 48 },
  },
  {
    id: 'car-3series-2022',
    name: 'BMW 320i M Sport',
    price: 33900,
    currency: 'USD',
    mileageKm: 21900,
    year: 2022,
    bodyType: 'Saloon',
    fuel: 'Petrol',
    transmission: 'Automatic',
    color: 'Portimao Blue',
    image: '/assets/demos/retail/cars/320i.png',
    description: 'M Sport saloon with low mileage, digital cockpit, and parking sensors front and rear. Dealer warranty included.',
    finance: { depositPct: 15, monthly: 589, termMonths: 48 },
  },
  {
    id: 'car-hilux-2019',
    name: 'Toyota Hilux 2.4 Invincible',
    price: 29900,
    currency: 'USD',
    mileageKm: 87400,
    year: 2019,
    bodyType: 'Pickup',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: 'Silver Sky',
    image: '/assets/demos/retail/cars/hilux.png',
    description: 'Work-ready double-cab pickup with tow bar, load liner, and 4x4 low range. Serviced every 10k km.',
    finance: { depositPct: 15, monthly: 539, termMonths: 48 },
  },
  {
    id: 'car-transit-2020',
    name: 'Ford Transit Custom 300',
    price: 21900,
    currency: 'USD',
    mileageKm: 96200,
    year: 2020,
    bodyType: 'Van',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: 'Frozen White',
    image: '/assets/demos/retail/cars/transit.png',
    description: 'Fleet-maintained panel van with ply lining, bulkhead, and dual sliding doors. Ready for immediate work.',
    finance: { depositPct: 10, monthly: 419, termMonths: 48 },
  },
]

export function filterUsedCars(filters: CarFilters): UsedCar[] {
  return USED_CAR_INVENTORY.filter((car) => {
    if (filters.bodyType && filters.bodyType !== 'All' && car.bodyType !== filters.bodyType) return false
    if (filters.maxPrice !== undefined && car.price > filters.maxPrice) return false
    if (filters.maxMileage !== undefined && car.mileageKm > filters.maxMileage) return false
    return true
  })
}

export function formatPrice(car: UsedCar) {
  return `${car.currency} ${car.price.toLocaleString('en-GB')}`
}

export function formatMileage(car: UsedCar) {
  return `${car.mileageKm.toLocaleString('en-GB')} km`
}
