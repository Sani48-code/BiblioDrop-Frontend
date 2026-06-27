# BiblioDrop — Client

An online book delivery management platform connecting readers with local libraries and independent book owners.

## 🔗 Live URL
[Add your Netlify/Vercel URL here]

## 🚀 Key Features
- Browse, search, and filter books by category, price, and availability
- Secure delivery fee payment via Stripe Checkout
- Role-based dashboards for Users, Librarians, and Admins
- Verified review system — only users who received a book can review it
- Book image hosting via imgBB API
- Wishlist system with persistent storage
- Dark mode toggle with localStorage persistence
- Framer Motion animations throughout
- Recharts data visualizations in dashboards
- Fully responsive — mobile, tablet, and desktop

## 📦 NPM Packages Used
- react, react-dom — UI framework
- react-router-dom — client-side routing
- axios — HTTP requests
- framer-motion — animations
- recharts — charts and graphs
- react-hook-form — form management
- react-hot-toast — notifications
- @stripe/stripe-js, @stripe/react-stripe-js — payment integration
- better-auth — authentication client
- lucide-react — icons
- tailwindcss, daisyui — styling

## ⚙️ Environment Variables
```
VITE_API_URL=
VITE_IMGBB_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## 🛠️ Local Development

```bash
npm install
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── main.jsx              # App entry — sets theme from localStorage before render
├── App.jsx               # All routes
├── index.css             # Tailwind + Google Fonts
├── contexts/
│   └── AuthContext.jsx   # Auth state, session restoration, login/logout/register
├── hooks/
│   └── useAxiosSecure.js # Authenticated Axios instance with 401/403 interceptor
├── utils/
│   └── uploadImage.js    # imgBB image upload utility
├── components/           # Shared UI components
│   ├── Navbar.jsx        # Responsive nav with dark mode + auth dropdown
│   ├── Footer.jsx        # 3-column footer with newsletter
│   ├── BookCard.jsx      # Reusable book card
│   ├── SkeletonCard.jsx  # Loading skeleton
│   ├── StarRating.jsx    # Read/write star rating
│   ├── LoadingSpinner.jsx
│   └── PrivateRoute.jsx  # Role-based route guard
└── pages/
    ├── Home.jsx           # Animated hero, featured books, categories, newsletter
    ├── BrowseBooks.jsx    # Search + filter + paginated book grid
    ├── BookDetails.jsx    # Book info, payment, wishlist, reviews
    ├── Login.jsx          # Email/password + Google OAuth
    ├── Register.jsx       # Multi-step form with role selection
    ├── PaymentSuccess.jsx # Stripe redirect landing page
    ├── NotFound.jsx       # 404 page
    └── dashboard/
        ├── DashboardLayout.jsx  # Sidebar + outlet
        ├── user/          # Overview, history, reading list, reviews, wishlist
        ├── librarian/     # Overview, add book, inventory, deliveries
        └── admin/         # Overview, approval, users, books, transactions
```
