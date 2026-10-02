# NOURA

A private dietetics practice website, client portal and dietitian dashboard.
Plain HTML, CSS and JavaScript with no build step and no external requests.
Fonts are self hosted. Open `index.html`, or serve the folder with any static
server, for example `python3 -m http.server`.

## What is in the box

**Public site (17 pages)**
Home, Approach, Services, Programs, Program detail (4), Recipes, Recipe detail
(12), Journal, Article (8), About, Nutrition Assessment, NOURA Intelligence,
Booking, Sign in, Privacy, Terms and a 404.

**Client portal** (`portal.html`): Today, Meal plan, Shopping list, Food log
with photo estimate, Weekly check in, Progress charts, Ask NOURA, Messages,
Appointments with a camera test, Documents, Profile and privacy with data
export and delete.

**Dietitian dashboard** (`dashboard.html`): Overview, Clients and CRM pipeline,
Client 360 with notes, Appointments, Messages, Assessments, Nutrition plan
builder, Food logs, Recipe library, Programs, NOURA Intelligence drafts,
Automations builder, Content and media manager, Analytics, Billing and Settings.

## How the pieces connect

The portal, dashboard and public site share the browser's local storage, so the
whole journey can be followed in one browser. Complete the assessment, book a
consultation, submit a weekly check in or request a swap, then open the
dashboard to see each one arrive. Edit a meal plan in the dashboard and the
portal shows the new version.

## Photography

All 52 image slots are filled. Every photo is referenced by key in
`js/imageRegistry.js` with alt text and a focal point, and `media/README.md`
lists each file, where it is used, which ones are watermarked stock previews
(13, needing licensed copies) and which ones are low resolution. To replace a
photo, save the new file over the old one and reload. The dashboard Content and
media tab shows each image's source and status.

The recipes and journal articles were written to match the supplied photos, so
a recipe's text and its picture describe the same dish.

## Editing content

- `js/data.js`: team, services, programs, journal articles, client stories, FAQs
- `js/recipes.js`: recipes, nutrition, allergens, swaps and the shopping list logic
- `js/imageRegistry.js`: every photograph
- `css/style.css` and `css/app.css`: design tokens sit at the top of `style.css`

## Honest limits of this build

This is a front end demonstration. These need a real backend before launch:

- **Accounts and security.** Sign in, two step verification, role checks and the
  audit trail are designed in the interface but not enforced. Local storage is
  not a database and is not safe for real health information.
- **Payments.** The card form is a demonstration and takes no money. Use a
  payment provider's hosted fields in production so card data never touches
  your servers.
- **Email, text and video.** Confirmations, reminders and video links are
  previewed, not sent.
- **NOURA Intelligence.** Responses are written and matched by topic. Connect a
  model through a server side endpoint, give it the client's plan and
  restrictions as context, and keep clinical suggestions in a review queue.
- **Legal and compliance.** `privacy.html` and `terms.html` are plain language
  templates. Have a lawyer review them, and confirm the obligations that apply
  to health information in your jurisdiction.
- **Fictional practice.** NOURA, its practitioners, credentials and client
  stories are invented. Replace them before publishing for a real practice.
- **Domain.** `noura.example` appears in canonical links, the sitemap and
  robots.txt. Replace it with your domain.
