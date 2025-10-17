# UK Childcare Costs Calculator

A modern web application to help UK parents estimate annual childcare costs, including government benefits such as 30 hours funded childcare and Tax-Free Childcare. The calculator provides a clear breakdown of gross costs, savings, and net costs, making it easy to understand your financial commitment and eligibility for support.

## Features

- **Interactive Cost Calculator**: Adjust weeks per year, days per week, hours per day, and hourly rate to see real-time cost estimates.
- **Government Benefits Integration**: Calculates savings from 30 hours funded childcare and Tax-Free Childcare, with eligibility checks.
- **Responsive Design**: Optimized for desktop and mobile, with a scrollable cost breakdown table on small screens.
- **Modern UI**: Built with React 18, Vite, Tailwind CSS, and Sass for a fast and beautiful experience.
- **Global State Management**: Uses Zustand for efficient state handling.
- **Extensible Architecture**: Modular components and styles for easy customization and future enhancements.

## How It Works

1. **Input Your Details**: Set your childcare schedule and hourly rate.
2. **Review Eligibility**: Indicate if both parents earn under £100k to enable government benefits.
3. **View Breakdown**: Instantly see gross cost, government savings, tax-free savings, and your net cost per week, month, and year.
4. **Mobile Friendly**: On mobile, the cost table scrolls horizontally and hides monthly columns for clarity.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Sass
- Zustand (state management)

## Getting Started

1. **Install dependencies**:
	```sh
	pnpm install
	# or
	npm install
	# or
	yarn install
	```
2. **Run the development server**:
	```sh
	pnpm dev
	# or
	npm run dev
	# or
	yarn dev
	```
3. **Open in browser**: Visit `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

- `src/components/` — UI components
- `src/styles/` — Global and component styles (Sass)
- `src/assets/` — Images and icons
- `src/App.tsx` — Main application logic

## API & Data Fetching

Sample endpoints for testing:
- https://jsonplaceholder.typicode.com/users
- https://jsonplaceholder.typicode.com/posts

## Contributing

Pull requests and suggestions are welcome! Please open an issue to discuss major changes.

## License

MIT