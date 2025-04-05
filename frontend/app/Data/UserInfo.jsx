const mockUser = {
  name: 'John Doe',
  role: 'Standard User',
  phone: '+123456789',
  email: 'johndoe@gmail.com',
  wallet: 1400,
  orders: [
    {
      id: 1,
      date: '2021-09-01',
      total: 100,
      items: [
        {
          id: 1,
          name: 'Item 1',
          category: 'Formal Wear',
          price: 50,
          quantity: 2,
          color: '',
          size: '',
        },
        {
          id: 2,
          name: 'Item 2',
          category: 'Formal Wear',
          price: 25,
          quantity: 2,
          color: '',
          size: '',
        },
      ],
    },
  ],
}

export default mockUser
