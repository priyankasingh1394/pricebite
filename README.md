# Grocery Price Compare

A web application that compares grocery prices across popular quick-commerce delivery platforms in India (Zepto, Blinkit, and Instamart).

## Features

- **Price Comparison**: Compare prices for grocery items across multiple platforms
- **Auto-complete Suggestions**: Get product suggestions as you type
- **Best Price Highlighting**: Automatically highlights the cheapest option
- **Savings Calculator**: Shows how much you save by choosing the cheapest option
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages with helpful suggestions

## Available Products

The app currently supports price comparison for:
- Dairy: Milk, Butter, Eggs
- Bakery: Bread
- Staples: Rice, Sugar, Oil
- Beverages: Tea, Coffee
- Vegetables: Tomatoes, Onions, Potatoes

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **CORS** for cross-origin requests
- In-memory data storage (mock data)

### Frontend
- **React 18** with hooks
- **React Scripts** for development and build
- Modern CSS with inline styles
- Responsive design principles

## Project Structure

```
grocery-price-compare/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── App.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3000`

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser and navigate to `http://localhost:3000`
3. Start typing a product name in the search box
4. Select from auto-complete suggestions or type the full name
5. Click "Search" to see price comparisons across platforms
6. The cheapest option will be highlighted in green
7. View your savings at the bottom of the results

## API Endpoints

### GET `/products?name={productName}`
Returns price comparison data for a specific product.

**Example:**
```
GET /products?name=milk
```

**Response:**
```json
[
  { "platform": "Zepto", "price": 52 },
  { "platform": "Blinkit", "price": 55 },
  { "platform": "Instamart", "price": 54 }
]
```

### GET `/products/list`
Returns a list of all available products.

**Response:**
```json
["milk", "bread", "eggs", "butter", "rice", "oil", "sugar", "tea", "coffee", "tomatoes", "onions", "potatoes"]
```

## Development

### Backend Development
For development with auto-reload:
```bash
npm run dev
```

### Frontend Development
The frontend runs in development mode with hot reloading by default:
```bash
npm start
```

To build for production:
```bash
npm run build
```

## Future Enhancements

- Real-time price data integration
- User authentication and saved preferences
- Price history and trends
- Product categories and filters
- Mobile app version
- Integration with more delivery platforms
- Price alerts and notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
