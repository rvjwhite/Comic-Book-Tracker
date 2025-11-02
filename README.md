# Comic Book Tracker

A comprehensive web application for tracking comic book collections, appraising their value, and minting them as NFTs for digital ownership proof.

## Features

### Collection Management
- Add, edit, and delete comic books from your collection
- Track detailed information including:
  - Title, publisher, issue number, variant
  - Condition and professional grading (CGC, CBCS, PGX)
  - Purchase price and current value
  - Publication date and personal notes
- Upload cover images
- Search and filter your collection
- Collection statistics and analytics

### Value Appraisal System
- Automated value estimation based on:
  - Condition multipliers
  - Professional grading premiums
  - Historical purchase data
- Market trend analysis
- Confidence scoring for appraisals
- Update current values based on appraisals
- Track investment performance

### NFT Integration
- Mint ERC-721 NFTs representing comic book ownership
- Connect wallet via MetaMask or WalletConnect
- On-chain verification of ownership
- ERC-721 compliant metadata
- Transfer NFTs between wallets
- View NFT details and provenance

## Technology Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React 18
- Material-UI (MUI)
- Redux Toolkit for state management
- ethers.js for blockchain interaction
- Vite for fast development

### Smart Contracts
- Solidity ^0.8.20
- OpenZeppelin contracts
- Hardhat development framework
- ERC-721 NFT standard

## Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)
- MetaMask browser extension (for NFT features)

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd Comic-Book-Tracker
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)

4. **Configure Frontend**
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- `VITE_CONTRACT_ADDRESS`: Deployed NFT contract address
- `VITE_CHAIN_ID`: Blockchain network chain ID

5. **Configure Smart Contracts**
```bash
cd contracts
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:
- `SEPOLIA_RPC_URL`: RPC URL for Sepolia testnet
- `PRIVATE_KEY`: Your wallet private key for deployment
- `ETHERSCAN_API_KEY`: For contract verification

6. **Compile and Deploy Smart Contracts**
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

Save the deployed contract address and update `frontend/.env`

7. **Start the Application**

In separate terminals:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Or use the root package.json:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage Guide

### Getting Started

1. **Register an Account**
   - Navigate to the registration page
   - Create an account with email and password
   - Login to access your dashboard

2. **Add Comics to Your Collection**
   - Click "Add Comic" in the navigation
   - Fill in comic details:
     - Basic info (title, publisher, issue number)
     - Condition and grading information
     - Purchase price and dates
     - Optional notes
   - Upload a cover image (optional)
   - Submit to add to your collection

3. **View Your Collection**
   - Browse all comics in grid view
   - Search by title, publisher, or issue number
   - Click on any comic to view details

4. **Appraise Comic Values**
   - Open any comic's detail page
   - Click "Appraise Value"
   - Review the estimated value based on condition and grading
   - Click "Update Current Value" to accept the appraisal

5. **Mint NFTs**
   - Connect your MetaMask wallet
   - Navigate to a comic's detail page
   - Click "Mint as NFT"
   - Approve the transaction in MetaMask
   - Your comic is now represented as an NFT!

6. **Dashboard Analytics**
   - View total collection value
   - Track investment performance
   - See collection breakdown by publisher and condition
   - Monitor NFT minting progress

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Collection Endpoints

#### Get All Collections
```
GET /api/collections
Authorization: Bearer <token>
Query Parameters: ?page=1&limit=20&search=term
```

#### Create Collection
```
POST /api/collections
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "publisher": "string",
  "issueNumber": "string",
  "condition": "string",
  "purchasePrice": number,
  ...
}
```

#### Update Collection
```
PUT /api/collections/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Collection
```
DELETE /api/collections/:id
Authorization: Bearer <token>
```

### Appraisal Endpoints

#### Get Appraisal
```
GET /api/appraisal/:id
Authorization: Bearer <token>
```

#### Update Value from Appraisal
```
POST /api/appraisal/:id/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "estimatedValue": number
}
```

### NFT Endpoints

#### Record NFT Mint
```
POST /api/nft/mint/:collectionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "tokenId": number,
  "contractAddress": "string",
  "transactionHash": "string"
}
```

#### Get NFT Metadata
```
GET /api/nft/metadata/:tokenId?contractAddress=0x...
```

## Smart Contract Functions

### Main Functions

- `mintComicNFT(address to, string title, string publisher, string issueNumber, string condition, string uri)` - Mint a new NFT
- `getComicDetails(uint256 tokenId)` - Get details for a specific NFT
- `transferFrom(address from, address to, uint256 tokenId)` - Transfer NFT ownership
- `burn(uint256 tokenId)` - Burn an NFT (owner only)

## Security Considerations

- Never commit `.env` files
- Keep private keys secure
- Use strong JWT secrets
- Validate all user inputs
- Rate limiting enabled on API
- CORS configured for security
- MongoDB injection prevention
- XSS protection enabled

## Development

### Running Tests

Backend tests:
```bash
cd backend
npm test
```

Smart contract tests:
```bash
cd contracts
npx hardhat test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

The build will be in `frontend/dist/`

## Deployment

### Backend Deployment
- Deploy to cloud platforms (AWS, GCP, Azure, Heroku)
- Set up MongoDB Atlas for production database
- Configure environment variables
- Enable HTTPS

### Frontend Deployment
- Build the production bundle
- Deploy to Vercel, Netlify, or similar
- Update API URL in environment variables

### Smart Contract Deployment
- Test thoroughly on testnets first
- Audit contract before mainnet deployment
- Consider using Polygon for lower gas fees
- Verify contract on Etherscan

## Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed
   - Check if you're on the correct network
   - Try refreshing the page

2. **Backend Connection Errors**
   - Verify MongoDB is running
   - Check backend .env configuration
   - Ensure backend server is started

3. **NFT Minting Failures**
   - Ensure wallet is connected
   - Check sufficient ETH/MATIC for gas
   - Verify contract address is correct

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] Integration with external pricing APIs (GoCollect, GPAnalysis)
- [ ] Bulk import from CSV
- [ ] Collection sharing and social features
- [ ] Mobile app (React Native)
- [ ] IPFS integration for decentralized image storage
- [ ] Multi-wallet support
- [ ] Advanced analytics and reporting
- [ ] Marketplace integration

---

Built with ❤️ for comic book collectors and NFT enthusiasts
