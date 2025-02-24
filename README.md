# Nilo - 2D Multiplayer Game

A real-time multiplayer 2D web game built with Next.js and TypeScript. Players can join the game and move around in a shared space, seeing each other's movements in real-time.

## Features

- Real-time multiplayer gameplay
- Smooth player movement using mouse control
- Unique colored avatars for each player
- Player identification system
- Automatic player join/leave handling
- Responsive canvas that adjusts to window size

## Tech Stack

- Next.js 14
- TypeScript
- Socket.IO for real-time communication
- HTML5 Canvas for rendering
- CSS Modules for styling
- Custom server setup for WebSocket support

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Git

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nilo2d
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test multiplayer functionality, open multiple browser windows pointing to the same URL.

## Production

To build and run in production:

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

- `app/` - Next.js app directory containing all pages and components
  - `page.tsx` - Main game page with canvas rendering
  - `layout.tsx` - Root layout component
  - `globals.css` - Global styles
  - `page.module.css` - Styles specific to the main page
  - `game/` - Game logic and state management
- `server.js` - Custom server setup for Next.js and Socket.IO

## Game Controls

- Move your mouse cursor anywhere on the screen to control your player
- Your player is represented by a colored circle
- You can see other players moving in real-time
- Each player has a unique color and ID displayed above their avatar

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SOCKET_URL`: The URL where your Socket.IO server is running (default: http://localhost:3000)

Make sure to create a `.env.local` file with these variables before running the development server. 