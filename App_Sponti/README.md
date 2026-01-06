
#  Sponti
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Status: Production-Ready](https://img.shields.io/badge/Status-Production--Ready-success)]()

Online version of the app: https://sponti-879131163810.us-west1.run.app/

---

## About the Project

In the restaurant industry, an empty table is lost revenue that can never be recovered. **Sponti** provides an infrastructure where owners can launch flash deals in seconds. Customers receive push notifications and see live pins on a map, encouraging them to visit *now*.

The platform uses Gemini API to help owners craft the perfect deal based on their current situation (e.g., "It's raining and I have 20 portions of soup left") and provides customers with an AI search tool to find exactly the best deal tailored to their need.

---

##  Key Features

###  For Customers
- ** Live Discovery Map:** Interactive Leaflet-based map with custom "Glow Pins" for active flash deals.
- ** AI Food Concierge:** A Gemini-powered chat assistant that recommends restaurants based on mood, craving, and live discounts.
- ** Flash Claim System:** One-tap deal claiming with dynamic countdown timers and automatic QR code generation.
- ** Intelligent Categories:** Claymorphic category selection for rapid browsing of Pizza, Sushi, Burgers, and more.
- ** Digital Wallet & Favorites:** Securely manage payment methods and keep track of top-rated local spots.

###  For Restaurant Owners
- ** Performance Dashboard:** Real-time tracking of redemptions, revenue analytics, and weekly activity charts via Recharts.
- ** Magic Deal Creator:** Describe a situation in plain English, and Gemini AI generates the title, description, and discount logic automatically.
- ** QR Scanner:** Integrated `html5-qrcode` scanner with environment-sensing camera controls to validate customer deals instantly.
- ** Revenue Insights:** Visualized data showing peaks in customer activity to optimize staffing.

---

##  Built With

*   **Frontend:** React 19 (Hooks, Context)
*   **Styling:** Tailwind CSS (Custom "Cyber" design tokens)
*   **Mapping:** React Leaflet & Leaflet.js
*   **Charts:** Recharts (SVG-based responsive analytics)
*   **Icons:** Lucide React
*   **Utilities:** date-fns, react-qr-code, html5-qrcode

---

##  Getting Started

### Prerequisites
*   **Node.js:** v18.0.0 or higher
*   **NPM:** v9.0.0 or higher
*   
### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/sponti.git
    cd sponti
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```

### Configuration
Create a `.env` file in the root directory:
```env
API_KEY=your_google_gemini_api_key_here
```

---

## 🖥 Usage

To run the development server:
```bash
npm start
```
The app will be available at https://sponti-879131163810.us-west1.run.app/

### Navigation Guide
1.  **Select Role:** On the landing screen, choose **Customer Access** or **Owner Portal**.
2.  **Owner:** Tap the "Create Flash Deal" button. Use the "Magic Creator" to see AI in action.
3.  **Customer:** Use the Map tab to find glowing pins. Click "Get Offer" to generate a QR code.
4.  **Redemption:** As an Owner, use the "Scan" tab and point the camera at a Customer's QR code to validate the deal!

---

##  Project Structure

```text
.
├── components/
│   └── Sidebar.tsx         # Global navigation drawer
├── services/
│   └── geminiService.ts    # AI Logic (Concierge & Magic Creator)
├── views/
│   ├── CustomerHome.tsx    # Feed & Hero discovery
│   ├── CustomerMap.tsx     # Leaflet integration
│   ├── OwnerDashboard.tsx  # Analytics & Stats
│   ├── DealCreator.tsx     # AI-assisted form
│   ├── QRScanner.tsx       # Hardware-accelerated scanning
│   └── ...                 # Profile, Wallet, Help Center
├── App.tsx                 # View Routing & Global State
├── constants.ts            # Mock data (Munich focus)
└── types.ts                # TypeScript Interfaces
```

---

##  Roadmap
- [ ] **Real-time Notifications:** Integrate WebSockets for instant deal alerts.
- [ ] **Staff Accounts:** Allow owners to create sub-accounts for waiters to scan codes.
- [ ] **Image Generation:** Use Imagen 3 to generate appetizing deal banners automatically.
- [ ] **Multi-Language:** Add support for German and Italian localizations.

--
Thanks for giving our app a try! 
BR 
Hossam
