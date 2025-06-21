# Real Estate Mobile App

A modern, feature-rich real estate mobile application built with React Native and Expo. This app allows users to browse property listings, view detailed property information, filter properties by various criteria, and contact property agents.

## Features

- **Property Listings:** Browse through available properties with image thumbnails, pricing, and key details
- **Detailed Property View:** Expand property cards with swipe gestures to see full property information
- **Property Details:** View comprehensive information including photos, descriptions, features, and more
- **Contact Agents:** Send inquiries directly to property agents from within the app
- **Filtering System UI:** Filter properties by type, price range, bedrooms, bathrooms, and amenities
- **Animations:** Smooth animations for property card expansion, form interactions, and notifications
- **Modern UI Components:** Includes blur effects, expandable cards, and interactive form elements

## Technologies Used

- [React Native](https://reactnative.dev/) - Mobile application framework
- [Expo](https://expo.dev/) - Development platform and tools
- [Expo Router](https://docs.expo.dev/router/introduction/) - Navigation system
- [NativeWind](https://www.nativewind.dev/) - Tailwind CSS for React Native
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animation library
- [Expo Blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) - UI blur effects

## Project Structure

- `/app` - Main application screens and navigation
  - `/home` - Home screen with property listings
  - `/property` - Property details screen with expandable card
  - `/modal` - Filter modal for property search
- `/components` - Reusable UI components
- `/constants` - Application constants and mock data
- `/assets` - Images, fonts and other static assets

## Key Features Implementation

### Expandable Property Card

The property details screen features an expandable card that users can drag up to reveal more information:

- Uses `Animated` and `PanResponder` for gesture handling
- Card height animates between partial and full view
- Property image resizes dynamically as the card expands/collapses

### Contact Form with Visual Feedback

- Interactive form with focus states and proper keyboard handling
- Toast notifications with blur effect and animations for user feedback
- Form input validation and submission handling

### Filtering System

- Advanced filtering modal with multiple criteria
- Interactive components like range sliders and category selectors
- Filters persist during the app session

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI
- iOS or Android simulator (or physical device with Expo Go app)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```
4. Follow the instructions to open the app on your device or simulator

## License

This project is licensed under the MIT License.
