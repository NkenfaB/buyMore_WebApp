# BuyMore storefront

A responsive React product catalog backed by `buyMore_Backend`. Browse live products, filter by category, search names/descriptions/tags, and save a selection during your visit. The original static storefront is preserved in `src/LegacyStorefront.js` and its component files.

```sh
npm ci --legacy-peer-deps
cp .env.example .env
npm start
npm test -- --watchAll=false
npm run build
```

Start MongoDB and the BuyMore API first. Set REACT_APP_API_URL before building if the API is not at http://localhost:5000/api. Add products through `buyMore_Dashboard` on port 3001. Both frontends must target the same API; the backend must allow their origins.

The catalog includes loading, empty, error/retry and no-search-results states. Selections stay in memory for the visit. Prices, checkout, payment, orders and customer authentication are not implemented; this iteration is a catalog demonstration. Product details/images come from your configured database, not fabricated seed sales or stock counts.
