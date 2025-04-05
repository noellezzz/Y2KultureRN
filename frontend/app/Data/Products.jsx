import model2 from '../../assets/images/model2.jpg'
import model3 from '../../assets/images/model3.jpg'
import model4 from '../../assets/images/model4.jpg'
import model5 from '../../assets/images/model5.jpg'
import model6 from '../../assets/images/model6.jpg'

const additionalImages = [model4, model5, model6]

const shuffleArray = array => {
  return array.sort(() => Math.random() - 0.5)
}

const shuffledImages = shuffleArray([...additionalImages])

const Products = [
  {
    id: 1,
    name: 'Casual T-Shirt',
    description: 'Comfortable cotton t-shirt with a relaxed fit.',
    price: 19.99,
    type: 'Casual Wear',
    status: 'Active',
    image: model2,
    reviews: [],
    stock: [
      {
        size: 'S',
        color: 'white',
        quantity: 10,
      },
      {
        size: 'M',
        color: 'black',
        quantity: 20,
      },
      {
        size: 'L',
        color: 'orange',
        quantity: 30,
      },
    ],
  },
  {
    id: 2,
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket with button closure.',
    price: 49.99,
    type: 'Casual Wear',
    status: 'Inactive',
    image: model3,
    reviews: [],
    stock: [
      {
        size: 'S',
        color: 'white',
        quantity: 10,
      },
      {
        size: 'M',
        color: 'orange',
        quantity: 20,
      },
      {
        size: 'L',
        color: 'black',
        quantity: 30,
      },
    ],
  },
  ...[
    {
      name: 'Athletic Joggers',
      description: 'Slim-fit joggers made from breathable fabric.',
      price: 34.99,
      type: 'Sportswear',
      status: 'Active',
    },
    {
      name: 'Formal Blazer',
      description: 'Elegant blazer perfect for business and formal occasions.',
      price: 79.99,
      type: 'Formal Wear',
      status: 'Active',
    },
    {
      name: 'Hooded Sweatshirt',
      description: 'Soft fleece hoodie with a kangaroo pocket.',
      price: 29.99,
      type: 'Casual Wear',
      status: 'Deleted',
    },
    {
      name: 'Running Shorts',
      description:
        'Lightweight and breathable shorts for running and workouts.',
      price: 24.99,
      type: 'Sportswear',
      status: 'Active',
    },
    {
      name: 'Slim Fit Suit',
      description: 'Modern slim fit suit for formal occasions.',
      price: 149.99,
      type: 'Formal Wear',
      status: 'Inactive',
    },
  ].map((product, index) => ({
    id: index + 3,
    reviews: [],
    stock: [
      {
        size: 'S',
        color: 'white',
        quantity: 10,
      },
      {
        size: 'M',
        color: 'orange',
        quantity: 20,
      },
      {
        size: 'L',
        color: 'black',
        quantity: 30,
      },
    ],
    ...product,
    image: shuffledImages[index % shuffledImages.length], // Randomized images
  })),
]

export default Products
