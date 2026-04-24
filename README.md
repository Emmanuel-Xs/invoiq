# Invoiq — Invoice Management App

A responsive, full-featured Invoice Management Application built with React 19 and TypeScript, following a provided Figma design. Users can create, view, edit, and delete invoices, manage draft/pending/paid workflows, filter by status, and toggle between light and dark themes — all with data persisted to LocalStorage.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)
![Vite](https://img.shields.io/badge/Vite-8-646CFF)

## 🔗 Links

- **Live URL**: [https://invoiq-sigma.vercel.app/](https://invoiq-sigma.vercel.app/)
- **Repository**: _[Add your GitHub repo URL here]_

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd invoiq

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm preview
```

### Run Tests

```bash
pnpm test
```

---

## 🏗 Architecture

The project follows a **route-centric, component-driven** architecture using file-based routing from TanStack Router.

### Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | React 19 + TypeScript                     |
| Build Tool       | Vite 8                                    |
| Routing          | TanStack Router (type-safe, file-based)   |
| Forms            | TanStack Form + Zod validation            |
| State Management | Zustand (with `persist` middleware)        |
| Styling          | Tailwind CSS 4 + CVA (class-variance-authority) |
| UI Primitives    | Shadcn UI + Vaul (drawer)                 |
| Icons            | Lucide React                              |
| Font             | League Spartan Variable (via Fontsource)  |

### Directory Structure

```
src/
├── assets/              # Static assets (SVGs, images)
├── components/
│   ├── invoice/         # Domain-specific invoice components
│   │   ├── filter-dropdown.tsx    # Status filter with checkbox UI
│   │   ├── invoice-card.tsx       # List item card (mobile + desktop layouts)
│   │   ├── invoice-form-drawer.tsx # Slide-in form for create/edit
│   │   ├── new-invoice-button.tsx # "New Invoice" CTA button
│   │   └── status-badge.tsx       # Colored status indicator badge
│   ├── layouts/
│   │   ├── sidebar.tsx            # Responsive sidebar/navbar
│   │   └── profile-drawer.tsx     # User profile customization drawer
│   ├── ui/              # Reusable UI primitives (Button, Label, Dialog, etc.)
│   ├── avatar-button.tsx
│   ├── site-logo.tsx
│   └── theme-button.tsx
├── lib/
│   ├── invoice.ts       # Business logic helpers (ID generation, formatting)
│   ├── schema.ts        # Zod validation schemas (invoice + draft)
│   └── utils.ts         # General utilities (cn helper)
├── routes/
│   ├── __root.tsx        # Root layout (sidebar + main content area)
│   ├── index.tsx         # Redirects "/" → "/invoices"
│   └── invoices/
│       ├── index.tsx     # Invoice list page with filtering + empty state
│       └── $invoiceId.tsx # Invoice detail page with actions
├── store/
│   ├── invoice-store.ts  # Invoice CRUD state + persistence
│   ├── theme-store.ts    # Light/dark theme state + persistence
│   └── profile-store.ts  # User profile state
├── types/
│   └── invoice.ts        # TypeScript interfaces (Invoice, InvoiceItem, Address)
├── styles.css            # Global styles, CSS variables, typography scale
├── main.tsx              # App entry point
└── router.tsx            # Router configuration
```

### Data Flow

```
User Action → Component → Zustand Store → LocalStorage (persist)
                              ↓
                         Re-render UI
```

All invoice data flows through a single Zustand store (`useInvoiceStore`) which handles CRUD operations and persists state to LocalStorage via the `persist` middleware. The theme preference is stored in a separate `useThemeStore` with the same persistence strategy.

---

## ✨ Features

### CRUD Operations

- **Create**: Open the slide-in drawer form, fill out bill-from/bill-to fields and line items, then save as pending or draft.
- **Read**: View all invoices in a responsive list. Click any invoice to see full details including itemized breakdown and amount due.
- **Update**: Edit existing invoices through the same drawer form, pre-populated with current values.
- **Delete**: Delete with a confirmation modal that prevents accidental data loss.

### Form Validation

- All required fields validated via **Zod schemas** with clear inline error messages positioned below inputs for better UX.
- Client email validated for proper format.
- At least one line item required for submission.
- Quantity must be ≥ 1 and price must be > 0.
- Draft invoices use a relaxed schema (fields can be empty) while pending invoices enforce full validation.
- Profile management migrated to **TanStack Form** for robust state management and field-level validation feedback.

### Status Workflow

- **Draft** → Can be edited and saved again.
- **Pending** → Can be marked as **Paid**.
- **Paid** → Final state; edit button is hidden.
- Status is reflected with color-coded badges (green for Paid, orange for Pending, grey for Draft) on both the list and detail views.

### Filtering

- Filter invoices by status (All, Draft, Pending, Paid) via an intuitive checkbox dropdown.
- The invoice count updates to reflect filtered results.
- An illustrated empty state is displayed when no invoices match the active filter.

### Light & Dark Mode

- Global theme toggle accessible from the sidebar/navbar.
- Both themes use carefully selected HSL color palettes for proper contrast.
- Theme preference persists across page reloads via LocalStorage.
- All components — cards, forms, modals, badges, and inputs — adapt to the active theme.

### Responsive Design

- **Mobile (320px+)**: Top navbar, stacked card layout, full-width form drawer, sticky bottom action bar on detail page.
- **Tablet (768px+)**: Expanded card layout with more detail columns, wider form fields.
- **Desktop (1024px+)**: Fixed left sidebar, horizontal card layout with all columns visible, side-panel drawer.
- No horizontal overflow at any breakpoint.

### Hover & Interactive States

- All buttons have distinct hover color transitions.
- Invoice list cards highlight with a primary-colored border on hover.
- Form inputs show a border color change on hover and focus.
- Filter dropdown toggle, back button, and delete icons all have visible hover feedback.

---

## ⚖️ Trade-offs

| Decision                         | Rationale                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **LocalStorage over IndexedDB**  | Zustand's `persist` middleware integrates seamlessly with LocalStorage. The invoice data size is small enough that LocalStorage is sufficient and simpler to implement. |
| **Custom modal over Dialog primitive** | The delete confirmation modal is implemented as a custom overlay for precise Figma-matching styling. A dedicated `Dialog` component exists in `ui/` for future use. |
| **Single-status filter**         | Implemented as a radio-style selector (one active filter at a time) rather than multi-select checkboxes. This keeps the UX straightforward and matches common invoice app patterns. |
| **TanStack Router over React Router** | Provides type-safe routing with automatic route tree generation, reducing runtime errors and improving DX. |
| **Slide-in drawer form**         | Uses a slide-in panel rather than a separate page for invoice creation/editing, keeping context and reducing navigation friction. |

---

## ♿ Accessibility

### Semantic HTML

- Uses proper heading hierarchy (`<h1>` for page titles, `<h2>` for section headings, `<h3>` for subsections).
- Interactive elements use native `<button>` elements (not `<div>` or `<span>` with click handlers).
- Form fields use `<label>` components for labeling.
- Lists of invoices use semantic `<ul>` and `<li>` (via `Link` components) structure.

### Keyboard Navigation

- All interactive elements (buttons, links, form inputs, filter dropdown) are keyboard-focusable.
- The invoice form drawer closes on `ESC` key press.
- The delete confirmation modal displays as an `alertdialog` with proper `aria-modal` and `aria-labelledby` attributes.
- Theme toggle button has an `aria-label="Toggle theme"` for screen readers.

### Color Contrast

- Both light and dark themes use carefully tuned HSL color values designed to meet WCAG AA contrast ratios.
- Status badges use distinct colors (green, orange, grey/white) that are distinguishable in both themes.
- Error states use a high-contrast red (`hsl(0, 80%, 63%)`) against both light and dark backgrounds.

### ARIA Attributes

- Filter dropdown uses `aria-haspopup="listbox"` and `aria-expanded` to communicate state.
- Form drawer uses `role="dialog"` and `aria-modal="true"` with a descriptive `aria-label`.
- Delete modal uses `role="alertdialog"` to signal the destructive nature of the action.

---

## 🌟 Improvements Beyond Requirements

- **Site Favicon**: Custom SVG favicon using the site's logo for better branding and identification in browser tabs.
- **Gooey Notifications**: Integrated `goey-toast` for smooth, interactive toast notifications when creating, updating, or deleting invoices.
- **View Toggle**: Added a **Grid/List view switcher** on the dashboard, allowing users to toggle between a compact list and a multi-column grid layout.
- **Enhanced Form UX**: Error messages are consistently placed below inputs to prevent UI shifting and improve readability during validation.
- **Figma-Perfect Buttons**: Refined button variants (Edit, Draft, Ghost) using specific hex color values from the design spec to ensure visual accuracy across themes.
- **Profile Customization**: Users can set their name and choose from 6 different avatar styles powered by the DiceBear API. The avatar is displayed in the sidebar.
- **Animated Transitions**: The form drawer uses a cubic-bezier eased slide animation. The overlay fades in/out smoothly.
- **Custom Typography Scale**: A pixel-perfect typography system (Heading L/M/S, Body, Body S) matches the Figma design spec exactly.
- **ID Generation**: Invoice IDs follow the Figma pattern (2 random uppercase letters + 4 random digits, e.g., `XM9141`).
- **Automatic Total Calculation**: Line item totals auto-calculate as quantity and price are entered.
- **Payment Due Calculation**: Payment due date is automatically computed from the invoice date and selected payment terms.

---

## 📄 License

This project was built as part of the HNG Internship Stage 2 task.
