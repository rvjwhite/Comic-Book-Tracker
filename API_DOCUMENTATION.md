# API Documentation - Comic Book Tracker

## Base URL

```
http://localhost:5000/api
```

For production, replace with your deployed API URL.

## Authentication

Most endpoints require authentication using JWT Bearer tokens.

### Headers

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message here"
}
```

## Endpoints

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "walletAddress": "0x..." // Optional
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "email": "john@example.com",
    "username": "johndoe",
    "walletAddress": "0x..."
  }
}
```

**Errors:**
- `400` - User already exists
- `400` - Validation error

---

### Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "email": "john@example.com",
    "username": "johndoe",
    "walletAddress": "0x..."
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "64abc123...",
    "email": "john@example.com",
    "username": "johndoe",
    "walletAddress": "0x...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Wallet Address

Update user's blockchain wallet address.

**Endpoint:** `PUT /api/auth/wallet`

**Authentication:** Required

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Collections

### Get All Collections

Retrieve all comics in user's collection with pagination and search.

**Endpoint:** `GET /api/collections`

**Authentication:** Required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (default: -createdAt)
- `search` - Search term (searches title, publisher, issueNumber)

**Example:**
```
GET /api/collections?page=1&limit=10&search=spider-man
```

**Response:** `200 OK`
```json
{
  "success": true,
  "collections": [
    {
      "_id": "64abc123...",
      "userId": "64abc000...",
      "title": "Amazing Spider-Man",
      "publisher": "Marvel",
      "issueNumber": "1",
      "variant": "Regular Edition",
      "publicationDate": "1963-03-01T00:00:00.000Z",
      "condition": "Near Mint",
      "gradingCompany": "CGC",
      "grade": 9.6,
      "purchasePrice": 100,
      "currentValue": 5000,
      "lastAppraised": "2024-01-15T00:00:00.000Z",
      "imageUrl": "/uploads/comic-123456.jpg",
      "nftTokenId": null,
      "nftContractAddress": null,
      "isMintedAsNFT": false,
      "notes": "First appearance of Spider-Man",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z",
      "valueChange": 4900,
      "valueChangePercent": 4900
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 47
}
```

---

### Get Single Collection

Get details of a specific comic.

**Endpoint:** `GET /api/collections/:id`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "collection": { ... }
}
```

**Errors:**
- `404` - Collection not found

---

### Create Collection

Add a new comic to collection.

**Endpoint:** `POST /api/collections`

**Authentication:** Required

**Content-Type:** `multipart/form-data` (if uploading image)

**Request Body:**
```json
{
  "title": "Amazing Spider-Man",
  "publisher": "Marvel",
  "issueNumber": "1",
  "variant": "Regular Edition",
  "publicationDate": "1963-03-01",
  "condition": "Near Mint",
  "gradingCompany": "CGC",
  "grade": 9.6,
  "purchasePrice": 100,
  "currentValue": 5000,
  "notes": "First appearance"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "collection": { ... }
}
```

---

### Update Collection

Update an existing comic.

**Endpoint:** `PUT /api/collections/:id`

**Authentication:** Required

**Request Body:** Same as Create Collection

**Response:** `200 OK`
```json
{
  "success": true,
  "collection": { ... }
}
```

**Errors:**
- `404` - Collection not found

---

### Delete Collection

Remove a comic from collection.

**Endpoint:** `DELETE /api/collections/:id`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Collection deleted successfully"
}
```

**Errors:**
- `404` - Collection not found

---

### Get Collection Statistics

Get summary statistics of user's collection.

**Endpoint:** `GET /api/collections/stats/summary`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "stats": {
    "totalItems": 47,
    "totalValue": 125000,
    "totalInvested": 50000,
    "nftMinted": 12,
    "byPublisher": {
      "Marvel": 25,
      "DC": 18,
      "Image": 4
    },
    "byCondition": {
      "Mint": 5,
      "Near Mint": 20,
      "Very Fine": 15,
      "Fine": 7
    }
  }
}
```

---

## Appraisal

### Get Appraisal

Get automated value appraisal for a comic.

**Endpoint:** `GET /api/appraisal/:id`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "appraisal": {
    "collectionId": "64abc123...",
    "title": "Amazing Spider-Man",
    "issueNumber": "1",
    "condition": "Near Mint",
    "grade": 9.6,
    "gradingCompany": "CGC",
    "purchasePrice": 100,
    "currentValue": 5000,
    "estimatedValue": 6500,
    "conditionMultiplier": 1.6,
    "gradingPremium": 1.48,
    "marketTrend": "rising",
    "lastAppraised": "2024-01-15T00:00:00.000Z",
    "confidence": 85
  }
}
```

---

### Update Value from Appraisal

Update comic's current value based on appraisal.

**Endpoint:** `POST /api/appraisal/:id/update`

**Authentication:** Required

**Request Body:**
```json
{
  "estimatedValue": 6500
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "collection": { ... }
}
```

---

### Batch Appraise

Appraise multiple comics at once.

**Endpoint:** `POST /api/appraisal/batch`

**Authentication:** Required

**Request Body:**
```json
{
  "collectionIds": ["64abc123...", "64abc456...", "64abc789..."]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "appraisals": [
    {
      "collectionId": "64abc123...",
      "title": "Amazing Spider-Man",
      "estimatedValue": 6500
    },
    ...
  ]
}
```

---

### Get Market Data

Get market data for a specific comic (placeholder for external API).

**Endpoint:** `GET /api/appraisal/market/:publisher/:title`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "marketData": {
    "publisher": "Marvel",
    "title": "Amazing Spider-Man",
    "averagePrice": 0,
    "recentSales": [],
    "trend": "stable",
    "note": "External API integration required for real market data"
  }
}
```

---

## NFT Operations

### Record NFT Mint

Record that a comic has been minted as NFT.

**Endpoint:** `POST /api/nft/mint/:collectionId`

**Authentication:** Required

**Request Body:**
```json
{
  "tokenId": 1,
  "contractAddress": "0x...",
  "transactionHash": "0x..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "NFT minting recorded successfully",
  "collection": { ... },
  "transactionHash": "0x..."
}
```

**Errors:**
- `404` - Collection not found
- `400` - Already minted as NFT

---

### Record NFT Transfer

Record NFT ownership transfer.

**Endpoint:** `POST /api/nft/transfer`

**Authentication:** Required

**Request Body:**
```json
{
  "tokenId": 1,
  "contractAddress": "0x...",
  "newOwner": "0x...",
  "transactionHash": "0x..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "NFT transfer recorded",
  "transactionHash": "0x...",
  "note": "Ownership should be verified on blockchain"
}
```

---

### Verify NFT Ownership

Verify ownership of an NFT (public endpoint).

**Endpoint:** `GET /api/nft/verify/:tokenId`

**Authentication:** Not required

**Query Parameters:**
- `contractAddress` - Contract address

**Response:** `200 OK`
```json
{
  "success": true,
  "nft": {
    "tokenId": 1,
    "contractAddress": "0x...",
    "title": "Amazing Spider-Man",
    "publisher": "Marvel",
    "issueNumber": "1",
    "condition": "Near Mint",
    "imageUrl": "/uploads/comic-123.jpg",
    "owner": {
      "username": "johndoe",
      "walletAddress": "0x..."
    },
    "mintedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

---

### Get NFT Metadata

Get ERC-721 compliant metadata for NFT.

**Endpoint:** `GET /api/nft/metadata/:tokenId`

**Authentication:** Not required

**Query Parameters:**
- `contractAddress` - Contract address

**Response:** `200 OK`
```json
{
  "name": "Amazing Spider-Man #1",
  "description": "Marvel - Amazing Spider-Man Issue 1. Condition: Near Mint, Grade: 9.6",
  "image": "http://localhost:5000/uploads/comic-123.jpg",
  "attributes": [
    {
      "trait_type": "Publisher",
      "value": "Marvel"
    },
    {
      "trait_type": "Issue Number",
      "value": "1"
    },
    {
      "trait_type": "Condition",
      "value": "Near Mint"
    },
    {
      "trait_type": "Grade",
      "display_type": "number",
      "value": 9.6
    }
  ]
}
```

---

### Get User's Minted NFTs

Get all NFTs minted by authenticated user.

**Endpoint:** `GET /api/nft/user/minted`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 12,
  "nfts": [ ... ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request / Validation Error |
| 401  | Unauthorized / Invalid Token |
| 404  | Not Found |
| 500  | Internal Server Error |

## Rate Limiting

API is rate limited to:
- 100 requests per 15 minutes per IP address

Exceeded rate limit returns:
```json
{
  "error": "Too many requests, please try again later."
}
```

## Pagination

List endpoints support pagination:
- Default page size: 20
- Maximum page size: 100
- Page numbers start at 1

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Collections Example
```bash
curl -X GET http://localhost:5000/api/collections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Collection Example
```bash
curl -X POST http://localhost:5000/api/collections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Amazing Spider-Man",
    "publisher":"Marvel",
    "issueNumber":"1",
    "condition":"Near Mint",
    "purchasePrice":100
  }'
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads limited to 5MB
- Supported image formats: JPEG, JPG, PNG, WEBP
- Wallet addresses must be valid Ethereum addresses (0x...)
