# ShopEase Nepal — Weekly Progress Logs

## Week 1: Project Initialization & Core Routing
**Status:** 15% Complete

### Tasks Completed
- Project Setup: Initialized React project with Vite, setting up the foundational environment.
- Routing Basics: Configured initial routes for HomePage and AboutPage.
- Navigation: Created basic Header and Navbar components.
- Cleanup: Removed unnecessary boilerplate code (index.css, old App.jsx contents).

### Challenges
- Configuration: Setting up initial project structure and dependencies.
- Boilerplate: Removing unwanted parts without breaking the Vite setup.

### Solutions
- Clean Slate: Established a clean starting point by methodically clearing out default Vite assets.
- Component Structure: Created a structured src/components directory from day one.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Project setup and initialization. |
| **Sahil Tuladhar** | Backend Developer | Configured initial routing. |
| **Sarang Limbu** | Frontend Developer | Created initial Header component. |
| **Sanskriti Maharjan** | UI Component Developer | Basic CSS setup and cleanup. |
| **Smriti Tamang** | QA & Testing | Initial project build verification. |

---

## Week 2: Dashboard Layouts & Navigation
**Status:** 30% Complete

### Tasks Completed
- Dashboards: Developed basic UI scaffolding for Admin and User Dashboards.
- Navigation: Updated links and structure in Header/Navbar for better flow.
- Styling: Implemented responsive CSS updates across the application.
- Consistency: Standardized basic UI elements.

### Challenges
- Layout Consistency: Ensuring consistent styling across different dashboard views.
- Responsiveness: Making the initial Navbar work well on different screen sizes.

### Solutions
- Shared Classes: Centralized CSS classes and established a common layout structure.
- Flexbox/Grid: Utilized modern CSS layout techniques for responsive design.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Coordinated dashboard requirements. |
| **Sahil Tuladhar** | Backend Developer | Admin Dashboard scaffolding. |
| **Sarang Limbu** | Frontend Developer | Navbar enhancements and responsiveness. |
| **Sanskriti Maharjan** | UI Component Developer | User Dashboard initial UI design. |
| **Smriti Tamang** | QA & Testing | Navigation link testing. |

---

## Week 3: Authentication UI & Documentation
**Status:** 45% Complete

### Tasks Completed
- Login UI: Enhanced User Login page UI with a visually appealing banner image.
- Documentation: Drafted initial project documentation and README files.
- Team Structure: Finalized development team roles and documented them.
- Forms: Set up basic input structures for authentication.

### Challenges
- Design Aesthetics: Designing an attractive login page that fits the premium e-commerce theme.
- Documentation: Ensuring all team roles and initial project specs were accurately captured.

### Solutions
- Visual Assets: Added a high-quality banner image and refined the form layout for better user experience.
- Markdown: Created structured markdown files to track progress and team assignments.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Drafted initial project documentation. |
| **Sahil Tuladhar** | Backend Developer | Prepared forms for future login state management. |
| **Sarang Limbu** | Frontend Developer | Implemented Login UI layout. |
| **Sanskriti Maharjan** | UI Component Developer | Integrated banner and form styling. |
| **Smriti Tamang** | QA & Testing | Form layout and responsiveness testing. |

---

## Week 4: Theming, Maps, & QA Framework
**Status:** 60% Complete

### Tasks Completed
- Dark Mode: Implemented dark mode variants across the application.
- Map Integration: Added and fixed bugs related to the delivery coverage map.
- QA Setup: Added formal QA bug report templates and processes.
- FAQ Page: Implemented the FAQ Page UI.

### Challenges
- State Management: Ensuring dark mode applies consistently across all components.
- Version Control: Resolving merge conflicts resulting from parallel development tracks.

### Solutions
- Context API: Used React Context (AuthContext) to manage global theme state.
- Communication: Improved team coordination to reduce complex merge conflicts.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Merge conflict resolution and team coordination. |
| **Sahil Tuladhar** | Backend Developer | Map functionality integration and fixes. |
| **Sarang Limbu** | Frontend Developer | Developed the FAQ Page UI. |
| **Sanskriti Maharjan** | UI Component Developer | Implemented global dark mode styles. |
| **Smriti Tamang** | QA & Testing | Created QA bug report templates. |

---

## Week 5: Product Catalog & User Profile
**Status:** 75% Complete

### Tasks Completed
- Product Data: Added Traditional Apparel products and improved sorting logic.
- User Profile: Redesigned the User Profile UI for better usability.
- Footer: Created a global footer component and added it to multiple pages.
- Image Optimization: Addressed image loading and referrer policy issues.

### Challenges
- Security & Performance: Preventing image referrer leakage and optimizing image loading from external CDNs.
- Component Reusability: Building a footer that works consistently across all page layouts.

### Solutions
- Security Policies: Added referrerPolicy='no-referrer' to img tags.
- UX Enhancements: Created an ImageWithSkeleton component for smoother image loading experiences.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Product data management and curation. |
| **Sahil Tuladhar** | Backend Developer | Implemented robust product sorting logic. |
| **Sarang Limbu** | Frontend Developer | Created and integrated the global footer component. |
| **Sanskriti Maharjan** | UI Component Developer | Redesigned the User Profile interface. |
| **Smriti Tamang** | QA & Testing | Verified image loading behaviors and skeleton animations. |

---

## Week 6: Page Refinements & E2E Testing Prep
**Status:** 85% Complete

### Tasks Completed
- Page Updates: Refined Contact, UserLogin, ProductDetails, and AdminLogin pages.
- Shopping Experience: Enhanced overall user shopping experience and order action flows.
- Testing: Added initial Playwright configuration for End-to-End (E2E) testing.
- Cleanup: Removed unnecessary images and files from the repository.

### Challenges
- Complex Flows: Handling complex user flows and ensuring all pages meet high quality standards.
- Testing Setup: Configuring Playwright correctly for a React/Vite environment.

### Solutions
- Iterative Polish: Conducted thorough manual testing and iterative UI refinements.
- Test Infrastructure: Established the foundational setup for automated E2E tests.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Enhanced order actions and user shopping flows. |
| **Sahil Tuladhar** | Backend Developer | Set up initial Playwright configuration. |
| **Sarang Limbu** | Frontend Developer | Updated ProductDetails page functionality. |
| **Sanskriti Maharjan** | UI Component Developer | Refined Contact page UI. |
| **Smriti Tamang** | QA & Testing | E2E test planning and manual page verification. |

---

## Week 7: Final UI/UX Polish & Authentication Flows
**Status:** 95% Complete

### Tasks Completed
- Sign-up UI Redesign: Implemented a new slide-up modal drawer for user registration.
- Login Animation: Added a cinematic store opening animation overlay on login.
- Admin Login Revamp: Refactored Admin Login to a clean card layout with no images.
- Hidden Access: Created a secret 4-corner tap sequence to unlock admin login securely.
- Auth Flow Management: Patched AuthContext to give UserLogin page control over redirect timing.

### Challenges
- Animation Sync: Ensuring complex CSS keyframes timed perfectly with React state and route redirects.
- Security via Obscurity: Implementing a hidden admin trigger without breaking normal user flows.

### Solutions
- Controlled Timeouts: Used setTimeout linked to exact CSS animation durations for routing.
- State Separation: Handled sign-up flow through local states inside UserLoginPage rather than global context.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Managed UI/UX transition and reviewed auth workflow logic. |
| **Sahil Tuladhar** | Backend Developer | Handled localStorage data structures and state persistence. |
| **Sarang Limbu** | Frontend Developer | Developed core React state logic for sign-up modal and Easter eggs. |
| **Sanskriti Maharjan** | UI Component Developer | Designed and implemented custom CSS keyframe animations. |
| **Smriti Tamang** | QA & Testing | Verified visual timing of animations and tested the secret admin trigger. |

---

## Week 8: Coworking Space & UI Polish
**Status:** 100% Complete

### Tasks Completed
- Coworking Space: Designed and implemented a minimal, high-end Coworking Space landing page (/coworking) with space tour modals and specs.
- Cart Booking: Integrated Coworking Pass bookings (Daily, Monthly, and Team Cabin plans) directly into the shopping cart.
- Payment Badges: Replaced static payment placeholders (COD, eSewa, Khalti) in the footer with fully functional hover links.
- Text Polish: Fixed navigation layout alignments on mobile viewports by converting "Log in" -> "Login" and "Sign up" -> "Signup" to prevent text wrapping.

### Challenges
- Visual Balance: Achieving a high-end corporate architectural site layout without using clunky AI-generated templates.
- Seamless Sinks: Wiring up custom non-product items (coworking bookings) to flow seamlessly through the global shopping cart state.

### Solutions
- Minimalist Design: Replaced flashing background neon gradient shapes with precise borders, substantial whitespace, and solid neutral colors.
- Dynamic Schema Mapping: Structured coworking plans to conform to the primary products schema to leverage standard checkout and cart procedures.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Managed clean layout aesthetic guidelines and approved booking integrations. |
| **Sahil Tuladhar** | Backend Developer | Persisted booking items and mapped local storage schemas. |
| **Sarang Limbu** | Frontend Developer | Designed layout preview modals and mobile menu adjustments. |
| **Sanskriti Maharjan** | UI Component Developer | Coded responsive consultation schedule request forms. |
| **Smriti Tamang** | QA & Testing | Executed browser layout consistency checks on multiple screen configurations. |

---

## Week 9: Profile Picture & Avatar Enhancements, Dashboards (Reviews Tab), and UI Improvements
**Status:** 100% Complete

### Tasks Completed
- Profile Picture & Avatar Enhancements: Added custom avatar upload with Canvas-based compression to 200x200px to stay within localStorage limits.
- Dynamic Preset Avatar Generator: Implemented dynamic color-coded preset generator for letters (A-Z) and numbers (0-9).
- Global Avatar Integration: Displayed avatar pictures across Navbar, Profiles, and Reviews globally.
- Dashboard Enhancements: Added global Reviews tab to the Admin Dashboard and product-specific Reviews tab to the Seller Dashboard.
- UI & Navigation Polish: Relocated Logout button from main Navbar to dashboard sidebars, and fixed Dark Theme contrast issues on UserProfilePage.
- Bug Fixes: Resolved a critical React parsing error in AdminDashboard.jsx.

### Challenges
- LocalStorage Storage Limits: Base64 image uploads can quickly exceed 5MB quota.
- Tab Responsiveness: Dashboards tabs overflowed on small screens.

### Solutions
- Canvas compression: Resized uploaded custom images to exactly 200x200px to maintain minimal footprint.
- Horizontal scrolling: Handled horizontal overflow for dashboard tab lists on mobile viewports.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Project Oversight | Managed UI/UX transition, review tab integration, and logout relocations. |
| **Sahil Tuladhar** | Backend Developer | Handled localStorage schemas and avatar upload compression. |
| **Sarang Limbu** | Frontend Developer | Developed profile preset avatar generator and reviews tabs structure. |
| **Sanskriti Maharjan** | UI Component Developer | Fixed Dark Theme contrast on UserProfilePage and mobile layouts. |
| **Smriti Tamang** | QA & Testing | Tested file upload limits, custom/preset avatars, and verified the build. |

---


## Week 10: Cloud Database and Media Hosting Migration
**Status:** 90% Complete

### Tasks Completed
- Database Migration: Transitioned the entire application from localStorage mock data to live Firebase Firestore.
- Image Hosting: Integrated Cloudinary API to replace Base64 strings with direct, secure image uploads from the Admin and Seller dashboards.
- Refactored contexts: Updated ProductContext and AuthContext to fetch and sync data with Firestore in real-time.
- Updated Data Models: Stripped out unsupported object types (like File objects) before payload submission to Firestore.

### Challenges
- Handling asynchronous operations with Firebase alongside React state updates.
- Ensuring Vite properly loaded .env variables for Cloudinary API integration.

### Solutions
- Enforced strict payload cleaning before database writes.
- Restarted development server environments to ensure variables were successfully injected into the application context.

### Team Contributions
| Member | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Anmol Chhetri (Lead)** | Infrastructure | Managed Firebase NoSQL structure and Cloudinary integration architecture. |
| **Sahil Tuladhar** | Backend Developer | Implemented Cloudinary direct upload utility and Firestore data sync. |
| **Sarang Limbu** | Frontend Developer | Refactored form components for live image previews from Cloudinary URLs. |
| **Sanskriti Maharjan** | UI Component Developer | Rebuilt form loading states during asynchronous uploads. |
| **Smriti Tamang** | QA & Testing | Verified image uploads and confirmed live data fetches from Firestore. |


## Project Outlook & Remaining Tasks

While the frontend and UI/UX flows are 100% complete, there are a few critical milestones left before the final launch of ShopEase Nepal:

### 1. Database Architecture & Setup
- COMPLETED: Transitioned from mock static data and local storage to a live Firebase Firestore NoSQL database.
- COMPLETED: Integrated Cloudinary for secure, direct image uploads across Admin and Seller dashboards.

### 2. Backend REST API Integration
- The frontend is now successfully connected to live cloud services (Firebase and Cloudinary), handling Product CRUD and image hosting. User Auth via Firebase and Google OAuth is also integrated.
- Endpoints to integrate include: User Auth, Admin Product CRUD, Order Processing, and Wishlist syncing.

### 3. Payment Gateway Setup
- Integrating Khalti and e-Sewa payment APIs to process real transactions during the checkout flow.

### 4. Production Deployment
- Configuring GitHub Pages or a dedicated hosting environment (like Vercel/Netlify) for public access.
- Setting up automated CI/CD pipelines via GitHub Actions for continuous deployment.
