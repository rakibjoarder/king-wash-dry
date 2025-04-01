import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  // Temporary static data until database is connected
  const locations = [
    {
      id: 1,
      name: 'King Wash & Dry - Dallas Bruton',
      address: '10100 Bruton Rd',
      city: 'Dallas',
      state: 'TX',
      zip: '75217',
      phone: '(214) 555-1001',
      hours: 'Mon-Sun: 6AM-9PM'
    },
    {
      id: 2,
      name: 'King Wash & Dry - Dallas Forest',
      address: '9782 Forest Ln',
      city: 'Dallas',
      state: 'TX',
      zip: '75243',
      phone: '(214) 555-1002',
      hours: 'Mon-Sun: 6AM-9PM'
    },
    {
      id: 3,
      name: 'King Wash & Dry - Garland Saturn',
      address: '3160 Saturn Rd',
      city: 'Garland',
      state: 'TX',
      zip: '75041',
      phone: '(214) 555-1003',
      hours: 'Mon-Sun: 6AM-10PM'
    },
    {
      id: 4,
      name: 'King Wash & Dry - Mesquite Hillcrest',
      address: '1820 Hillcrest St',
      city: 'Mesquite',
      state: 'TX',
      zip: '75149',
      phone: '(214) 555-1004',
      hours: 'Mon-Sun: 6AM-9PM'
    },
    {
      id: 5,
      name: 'King Wash & Dry - Richardson',
      address: '1332 S Plano Rd',
      city: 'Richardson',
      state: 'TX',
      zip: '75081',
      phone: '(214) 555-1005',
      hours: 'Mon-Sun: 6AM-9PM'
    }
  ];

  return json(locations);
}; 