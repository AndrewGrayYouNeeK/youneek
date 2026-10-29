# YouNeeK

YouNeeK is a crypto-powered donation and emergency assistance platform focused on helping animals get urgent veterinary care.

## What the app does

- Accepts crypto donations and explains that card checkout is not connected in this standalone build
- Lets people apply for emergency veterinary assistance
- Shows public impact and transparency across funded cases
- Includes admin tools for reviewing applications and tracking platform activity
- Supports YouNeeK token utility features like staking and swap simulation

## Main sections

- **Home** — landing page with mission, roadmap, transparency, impact, and donation sections
- **Apply** — veterinary emergency assistance application flow
- **Admin** — dashboard for reviewing and managing applications
- **Payments** — treasury and payment tracking
- **Whitepaper** — project overview and token information
- **Thank You** — confirmation page after a completed donation flow

## Tech stack

Built with:

- React
- Tailwind CSS
- Vite
- Browser `localStorage` for applications, staking positions, and charity payment records

## Local development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```

Applications, staking positions, and charity wallet records are stored in this browser only. Wallet activity on the home page is read from the public Plasma explorer. GitHub commit stats on the admin page are read from the public GitHub API.

## Notes

This repository is the standalone YouNeeK app source code.
