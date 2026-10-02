/* ==========================================================================
   NOURA: media registry
   Every photograph on the site is referenced by key, for example
   "hero.primary" or "recipes.lemonChicken". No page hardcodes an image path.

   How to add photography
     1. Save the file at the path shown in `src` (folders sit inside /media).
        JPG, about 1800px on the long edge, is ideal. Or change `src` here.
     2. Reload. Until a file exists the site shows an intentional tonal
        placeholder, so nothing ever breaks or looks unfinished.

   Fields
     src       path to the image file
     alt       description for screen readers (empty for decorative images)
     tone      placeholder colour: sage, cream, stone, terracotta, olive
     label     caption shown on the placeholder while the file is missing
     position  CSS object-position, the focal point when cropping
     usage     where the image appears, shown in the dashboard media manager
     source    photographer or licence. "Preview" means a watermarked stock comp that
               needs a licensed copy before launch
   ========================================================================== */

const MEDIA = {};

function reg(key, folder, file, alt, tone, label, opts = {}) {
  MEDIA[key] = Object.assign({
    key, folder, src: `media/${folder}/${file}`, alt, tone, label,
    position: "50% 50%", usage: "", source: "Supplied", flags: [],
  }, opts);
}
const PREVIEW = (who) => ({ source: who + " preview, licence needed", flags: ["preview"] });

/* Brand and hero */
reg("brand.og", "brand", "social_share.jpg", "A shared table of colourful dishes seen from above", "cream", "Share image", { usage: "Social sharing previews" });
reg("hero.primary", "hero", "primary.jpg", "A woman enjoying a bowl of cereal with fruit at her bright kitchen counter", "sage", "Hero portrait", { usage: "Home hero", position: "60% 40%" });
reg("hero.wide", "hero", "approach_banner.jpg", "A dietitian reviewing a plan with an older client across a bright desk", "cream", "Approach banner", { usage: "Approach page banner", position: "50% 38%" });

/* Dietitian and team */
reg("dietitian.portrait", "dietitian", "amara_vale.jpg", "Dr. Amara Vale, Registered Dietitian, in a sunlit consulting room", "terracotta", "Dr. Amara Vale", { usage: "Home, About, Team", position: "58% 30%", ...PREVIEW("Shutterstock") });
reg("dietitian.consultation", "dietitian", "consultation.jpg", "A dietitian discussing a nutrition plan with a client beside a bowl of fresh vegetables", "sage", "Consultation", { usage: "Services, Intelligence", position: "40% 50%" });
reg("dietitian.workspace", "dietitian", "workspace.jpg", "A dietitian's desk with a laptop, fresh produce, citrus and a dumbbell", "stone", "Workspace", { usage: "About" });
reg("dietitian.leila", "dietitian", "leila.jpg", "Leila Haddad, Registered Dietitian", "sage", "Leila Haddad", { usage: "About, Booking", position: "50% 22%" });
reg("dietitian.daniel", "dietitian", "daniel.jpg", "Daniel Okafor, Registered Dietitian", "stone", "Daniel Okafor", { usage: "About, Booking", position: "50% 30%", ...PREVIEW("Shutterstock") });
reg("dietitian.sofia", "dietitian", "sofia.jpg", "Sofia Marin, Client Care Director", "terracotta", "Sofia Marin", { usage: "About", position: "50% 30%", ...PREVIEW("Shutterstock") });

/* Clinic */
reg("clinic.reception", "clinic", "reception.jpg", "The NOURA reception with warm timber panelling and a pale counter", "cream", "Reception", { usage: "About", ...PREVIEW("Dreamstime") });
reg("clinic.consultRoom", "clinic", "consultation_room.jpg", "A quiet consultation room with two soft chairs and a plant", "stone", "Consultation room", { usage: "About", ...PREVIEW("Dreamstime") });
reg("clinic.kitchen", "clinic", "demonstration_kitchen.jpg", "The demonstration kitchen with copper pans and fresh vegetables", "sage", "Demonstration kitchen", { usage: "About" });

/* Nutrition, ingredients, meal prep, food */
reg("nutrition.balancedPlate", "nutrition", "balanced_plate.jpg", "A balanced plate of salmon, brown rice, greens and berries on a wooden table", "sage", "Balanced plate", { usage: "Approach", position: "50% 50%" });
reg("nutrition.ingredients", "nutrition", "ingredients_flat_lay.jpg", "Wraps, salads, hummus and raw vegetables arranged on a white table", "cream", "Ingredients flat lay", { usage: "Intelligence" });
reg("nutrition.morning", "nutrition", "morning_table.jpg", "A quiet breakfast table with tea, bread and fruit in morning light", "terracotta", "Morning table", { usage: "Assessment", position: "50% 60%" });
reg("ingredients.produce", "ingredients", "produce.jpg", "A market stall piled with tomatoes, citrus and fresh greens", "sage", "Produce", { usage: "Portal shopping list" });
reg("ingredients.pantry", "ingredients", "pantry.jpg", "Pantry shelves with glass jars of dry goods and fresh fruit", "stone", "Pantry staples", { usage: "Approach" });
reg("mealPrep.containers", "meal_prep", "containers.jpg", "Glass containers of prepared meals and green juices lined up for the week", "cream", "Meal prep", { usage: "Recipes", position: "50% 40%" });
reg("food.photoAnalysis", "food", "sample_meal.jpg", "A bowl of grilled chicken, brown rice, broccoli and carrots", "terracotta", "Sample meal", { usage: "Client portal photo log demo" });

/* Lifestyle, editorial, education */
reg("lifestyle.travel", "lifestyle", "travelling.jpg", "A traveller in a camel coat pulling a suitcase through a bright terminal", "stone", "Travelling", { usage: "Home", position: "50% 40%" });
reg("lifestyle.cooking", "lifestyle", "cooking_at_home.jpg", "Someone cooking at a steaming stove in a warm home kitchen", "terracotta", "Cooking at home", { usage: "Home", position: "40% 50%" });
reg("lifestyle.outdoors", "lifestyle", "outdoor_walk.jpg", "A walker on an autumn forest path in low golden sun", "sage", "Outdoor walk", { usage: "Home", position: "45% 50%", ...PREVIEW("Dreamstime") });
reg("editorial.journalHero", "editorial", "banner.jpg", "Colourful plates of roasted food and drinks seen from above", "cream", "Journal banner", { usage: "Journal page", position: "50% 55%" });
reg("education.guide", "education", "printed_guide.jpg", "A blank printable recipe card with lines for ingredients and instructions", "stone", "Printable recipe card", { usage: "Journal newsletter", position: "50% 30%" });

/* Programs */
reg("programs.reset", "programs", "reset.jpg", "A fresh salad bowl of mixed leaves, tomato, cucumber and feta", "cream", "Reset", { usage: "Programs", position: "50% 55%" });
reg("programs.balance", "programs", "balance.jpg", "Seared salmon with roasted cauliflower and quinoa on a white plate", "sage", "Balance", { usage: "Programs", position: "50% 50%" });
reg("programs.metabolic", "programs", "metabolic.jpg", "A wooden table covered in colourful whole vegetables and legumes", "stone", "Metabolic", { usage: "Programs", position: "50% 50%" });
reg("programs.private", "programs", "private.jpg", "A dietitian and a client talking in a sunlit living room beside a bowl of fruit", "olive", "Private", { usage: "Programs", position: "40% 50%", ...PREVIEW("123RF") });

/* Client stories and portal */
reg("testimonials.client1", "testimonials", "client_1.jpg", "A smiling man in a plaid shirt standing in a green field", "stone", "Client", { usage: "Client stories", position: "75% 30%", ...PREVIEW("Shutterstock") });
reg("testimonials.client2", "testimonials", "client_2.jpg", "A warmly smiling woman in a softly lit room", "terracotta", "Client", { usage: "Client stories", position: "58% 30%" });
reg("testimonials.client3", "testimonials", "client_3.jpg", "A smiling older woman among green plants", "sage", "Client", { usage: "Client stories", position: "38% 30%" });
reg("clients.maya", "clients", "maya.jpg", "Maya Johnson", "terracotta", "Maya Johnson", { usage: "Client portal and dashboard", position: "50% 35%", ...PREVIEW("Dreamstime") });

/* Recipes (one image each) */
const RECIPE_MEDIA = [
  ["yogurtBowl", "yogurt_bowl", "Greek yogurt with blackberries, raspberries, blueberries and granola in a stoneware bowl", "cream", "50% 50%", {}],
  ["eggMuffins", "egg_muffins", "Golden cheesy egg muffins scattered with grated cheese", "sage", "50% 50%", {}],
  ["lemonChicken", "lemon_chicken", "Lemon chicken with asparagus in a cast iron skillet", "stone", "45% 50%", {}],
  ["chickpeaStew", "chickpea_stew", "A bowl of chickpea and spinach stew with a swirl of yogurt and chili oil", "terracotta", "50% 50%", {}],
  ["salmonGreens", "salmon_greens", "Grilled salmon with zucchini and carrots on a sage plate", "stone", "50% 50%", {}],
  ["lentilSalad", "lentil_salad", "A leafy salad with radishes and crisp toppings in a white bowl", "sage", "50% 45%", {}],
  ["overnightOats", "overnight_oats", "Overnight oats layered with strawberries and blueberries in a glass jar", "cream", "50% 40%", {}],
  ["turkeyMeatballs", "turkey_meatballs", "Baked turkey meatballs in tomato sauce under melted mozzarella", "terracotta", "50% 50%", {}],
  ["tomatoSoup", "tomato_soup", "Creamy roasted tomato soup with basil beside a toasted cheese sandwich", "terracotta", "50% 55%", {}],
  ["veggieStirFry", "veggie_stir_fry", "A wok of colourful vegetable stir fry being tossed", "sage", "50% 50%", {}],
  ["chiaPudding", "chia_pudding", "A glass jar of chia pudding layered with berry compote", "stone", "50% 50%", {}],
  ["greenSmoothie", "green_smoothie", "A green apple and spinach smoothie in a tall glass", "sage", "50% 50%", {}],
];
RECIPE_MEDIA.forEach(([k, file, alt, tone, pos, o]) => reg("recipes." + k, "recipes", file + ".jpg", alt, tone, "Recipe", Object.assign({ usage: "Recipe library and detail", position: pos }, o)));

/* Journal covers */
const JOURNAL_MEDIA = [
  ["mindfulEating", "mindful_eating", "A woman savouring a colourful salad bowl with her eyes closed", "terracotta", "55% 40%", PREVIEW("Alamy")],
  ["weightMyths", "weight_myths", "Kitchen scales weighing oats, flour, chocolate and sugar", "stone", "50% 50%", {}],
  ["proteinPower", "protein_power", "A flat lay of protein foods including salmon, chicken, eggs, cheese and legumes", "sage", "50% 42%", PREVIEW("Alamy")],
  ["gutHealth", "gut_health", "Jars of kombucha and kimchi beside a glass of milk", "cream", "50% 50%", {}],
  ["mealTiming", "meal_timing", "A clock on a plate beside a notebook, on a wooden table", "stone", "50% 50%", PREVIEW("Alamy")],
  ["sugarTruths", "sugar_truths", "A small stack of sugar cubes on a dark surface", "olive", "50% 55%", {}],
  ["sleepNutrition", "sleep_nutrition", "A glass cup of herbal tea beside a daisy on a dark bedside table", "olive", "50% 80%", PREVIEW("Dreamstime")],
  ["hydration", "hydration", "A glass of water with a lemon on a pale surface", "cream", "50% 55%", {}],
];
JOURNAL_MEDIA.forEach(([k, file, alt, tone, pos, o]) => reg("journal." + k, "editorial", file + ".jpg", alt, tone, "Journal cover", Object.assign({ usage: "Journal", position: pos }, o)));

/* ---- Rendering ---- */
function escAttr(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

// Returns the inner markup of a .media frame: placeholder first, image above it.
// The image removes itself if the file does not exist yet.
function mediaInner(key, opts = {}) {
  const m = MEDIA[key];
  if (!m) return "";
  const alt = opts.decorative ? "" : escAttr(m.alt);
  const loading = opts.eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<div class="ph" aria-hidden="true"><span>${escAttr(m.label)}</span></div>` +
    `<img src="${m.src}" alt="${alt}" ${loading} style="object-position:${m.position}" onerror="this.remove()">`;
}

// Complete frame markup for use in JavaScript templates.
function mediaFrame(key, cls = "", opts = {}) {
  const m = MEDIA[key];
  if (!m) return "";
  return `<div class="media tone-${m.tone} ${cls}">${mediaInner(key, opts)}</div>`;
}

// Fills every element carrying data-media, for example
// <div class="media ratio-4x5 arch" data-media="hero.primary" data-eager></div>
function hydrateMedia(root = document) {
  root.querySelectorAll("[data-media]").forEach((el) => {
    if (el.dataset.ready) return;
    const m = MEDIA[el.dataset.media];
    if (!m) return;
    el.classList.add("tone-" + m.tone);
    el.insertAdjacentHTML("afterbegin", mediaInner(el.dataset.media, {
      eager: el.hasAttribute("data-eager"),
      decorative: el.hasAttribute("data-decorative"),
    }));
    el.dataset.ready = "true";
  });
}

hydrateMedia();
