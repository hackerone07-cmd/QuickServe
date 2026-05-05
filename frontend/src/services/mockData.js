export const mockServices = [
  {
    _id: 'svc-101',
    providerId: {
      _id: 'provider-1',
      name: 'Rohan Nair',
      email: 'rohan@quickserve.app',
      phone: '+91 98765 43210',
    },
    category: 'Plumber',
    title: 'Emergency pipe repair and leak fixing',
    description:
      'Rapid home plumbing support for burst pipes, low pressure lines, and kitchen leaks.',
    price: 799,
    availability: ['Mon 9-11 AM', 'Tue 2-5 PM', 'Sat 10-1 PM'],
    location: 'Bengaluru',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    _id: 'svc-102',
    providerId: {
      _id: 'provider-2',
      name: 'Anita Verma',
      email: 'anita@quickserve.app',
      phone: '+91 98111 22334',
    },
    category: 'Cleaner',
    title: 'Deep cleaning for flats and family homes',
    description:
      'Room-by-room sanitizing, kitchen degreasing, and bathroom deep cleans with flexible slots.',
    price: 1299,
    availability: ['Wed 10-2 PM', 'Thu 3-7 PM'],
    location: 'Mumbai',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    _id: 'svc-103',
    providerId: {
      _id: 'provider-3',
      name: 'Kabir Singh',
      email: 'kabir@quickserve.app',
      phone: '+91 98989 11223',
    },
    category: 'Electrician',
    title: 'Home wiring checks and appliance installation',
    description:
      'Trusted diagnostics for short circuits, switchboards, ceiling fans, and lighting upgrades.',
    price: 999,
    availability: ['Mon 1-4 PM', 'Fri 9-12 AM'],
    location: 'Delhi',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    _id: 'svc-104',
    providerId: {
      _id: 'provider-4',
      name: 'Maya Das',
      email: 'maya@quickserve.app',
      phone: '+91 98222 33445',
    },
    category: 'Carpenter',
    title: 'Furniture repair, fitting, and custom shelving',
    description:
      'From squeaky cabinets to new wall-mounted storage, delivered with tidy finishing.',
    price: 1499,
    availability: ['Tue 11-3 PM', 'Sun 10-2 PM'],
    location: 'Hyderabad',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    _id: 'svc-105',
    providerId: {
      _id: 'provider-5',
      name: 'Sana Ali',
      email: 'sana@quickserve.app',
      phone: '+91 98444 55667',
    },
    category: 'Other',
    title: 'Handyman support for small home fixes',
    description:
      'Mixed support for curtain rods, mirrors, TV mounts, and simple repair jobs around the home.',
    price: 699,
    availability: ['Daily 8-10 PM'],
    location: 'Pune',
    rating: 4.5,
    images: [],
  },
];

export const mockReviews = {
  'provider-1': [
    {
      _id: 'review-1',
      customerId: { name: 'Isha' },
      providerId: 'provider-1',
      serviceId: { _id: 'svc-101', title: 'Emergency pipe repair and leak fixing' },
      rating: 5,
      comment: 'Reached quickly and explained the repair clearly.',
    },
  ],
  'provider-2': [
    {
      _id: 'review-2',
      customerId: { name: 'Rahul' },
      providerId: 'provider-2',
      serviceId: { _id: 'svc-102', title: 'Deep cleaning for flats and family homes' },
      rating: 5,
      comment: 'The team was punctual and the kitchen looked brand new.',
    },
  ],
  'provider-3': [
    {
      _id: 'review-3',
      customerId: { name: 'Meera' },
      providerId: 'provider-3',
      serviceId: { _id: 'svc-103', title: 'Home wiring checks and appliance installation' },
      rating: 4,
      comment: 'Fast work and helpful advice for future maintenance.',
    },
  ],
};
