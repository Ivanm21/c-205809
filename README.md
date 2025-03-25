# Playtech AI Chat Assistant

An interactive chat application that allows users to communicate with an AI assistant about Playtech-related topics. The application features both text and voice input capabilities.


## Technology Stack

- **Frontend Framework**
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - shadcn/ui for UI components

- **Backend Services**
  - Supabase for database and authentication
  - n8n for workflow automation
  - Web Audio API for voice recording

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/Ivanm21/c-205809.git
   cd c-205809
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up local SSL for voice recording**
   ```sh
   # Install mkcert
   brew install mkcert
   # Set up certificates
   mkcert -install
   mkcert localhost
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

## Security

- HTTPS is required for voice recording functionality
- API endpoints are protected with appropriate authentication
- Sensitive data is handled securely through environment variables

## License

This project is private and confidential. All rights reserved.

---
