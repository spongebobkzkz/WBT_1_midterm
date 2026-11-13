# Cargo/Pulse

A front-end website for a cargo delivery service in Kazakhstan and Central Asia.
Web Technologies 1, Final project.

Website: https://spongebobkzkz.github.io/WBT_1_midterm/
Repository: https://github.com/spongebobkzkz/WBT_1_midterm

## Team

| Member | Pages |
| --- | --- |
| Estai Beisenbai | Home, Services, Tracking, Get a price, Sign Up / Log In, Profile |
| Byerdikhajy Yesyentai | Pickup, Packing shop, the menu, light and dark mode, shared styles |

## What a visitor can do

- Home: track a parcel from the first screen, read the questions and see the numbers count up.
- Services: open the details of a service and compare up to 3 services.
- Tracking: find a shipment by its code and see its journey; filter the table by status.
- Get a price: see the price for air, rail and road, save the quote and book a pickup for it.
- Pickup: choose a courier time window, see the price, book a pickup and see "My pickups".
- Packing shop: search and sort supplies, use the saved cart and find the right box size.
- Sign Up / Log In / Profile: a demo account with saved quotes (do not use a real password).
- Every page: a simple menu, a cart counter and a light / dark mode button.

## Saved data (localStorage, JSON)

| Key | What it keeps |
| --- | --- |
| `cargoPulseTheme` | `"light"` or `"dark"` |
| `cargoPulseCart` | the packing shop cart: `[{ id, name, price, quantity }]` |
| `cargoPulseBookings` | pickups: `[{ number, dateText, time, driver, address, total }]` |
| `cargoPulseUsers` | demo accounts |
| `cargoPulseCurrentUser` | the email of the logged-in user |
| `cargoPulseQuotes` | saved quotes |

## Folders

- `css/` – `style.css` for every page and one file per page
- `js/` – `theme.js` and `main.js` for every page and one file per page
- `images/` – SVG drawings

## Credits

- Bootstrap 5.3 (layout, menu, dropdown, form components), jQuery 3.7 (effects and animations)
- Fonts: Space Grotesk and DM Sans from Google Fonts
- The drawings (truck, boxes, menu icons) and most of the JavaScript and CSS were made with the help of the AI assistant Claude (Anthropic); we tested every feature and checked the code ourselves
