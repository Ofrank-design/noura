/* ==========================================================================
   NOURA: recipe library, meal plan and shopping list helpers
   Ingredient amounts are for the full recipe. `cat` drives shopping list
   grouping. Nutrition is per serving.
   ========================================================================== */

const RECIPE_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks", "High Protein", "Quick Meals", "Family Meals", "Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Budget Friendly", "Travel", "Meal Prep"];

const RECIPES = [
  {
    id: "yogurtBowl", title: "Greek Yogurt Bowl with Mixed Berries and Granola", cats: ["Breakfast", "High Protein", "Vegetarian", "Quick Meals"],
    prep: 5, cook: 0, servings: 2, media: "recipes.yogurtBowl",
    blurb: "Cool, thick yogurt with juicy berries and a crunchy granola topping, ready in five minutes.",
    ingredients: [
      { q: 400, u: "g", item: "Greek yogurt", cat: "Dairy and Eggs" },
      { q: 250, u: "g", item: "Mixed berries", cat: "Produce" },
      { q: 60, u: "g", item: "Granola", cat: "Pantry" },
      { q: 2, u: "tsp", item: "Honey", cat: "Pantry" },
      { q: 1, u: "tbsp", item: "Chia seeds", cat: "Pantry" },
    ],
    steps: [
      "Spoon the yogurt into two wide bowls and smooth the surface with the back of the spoon.",
      "Scatter the berries over the top, reserving a few of the best ones for garnish.",
      "Add the granola and chia seeds just before serving so they stay crisp, then drizzle with honey.",
    ],
    nutrition: { cal: 360, protein: 26, carbs: 42, fat: 10, fiber: 7 },
    allergens: ["Milk", "Wheat", "Tree nuts (check the granola)"],
    swaps: ["For dairy free, use unsweetened soy yogurt, which keeps the protein high.", "Choose a nut free, gluten free granola if you need one.", "Frozen berries work well. Let them thaw for ten minutes first."],
  },
  {
    id: "eggMuffins", title: "Cheesy Spinach Egg Muffins", cats: ["Breakfast", "Meal Prep", "High Protein", "Vegetarian", "Gluten Free", "Travel"],
    prep: 10, cook: 22, servings: 4, media: "recipes.eggMuffins",
    blurb: "Twelve portable egg cups you can bake on Sunday and eat all week, hot or cold.",
    ingredients: [
      { q: 8, u: "each", item: "Eggs", cat: "Dairy and Eggs" },
      { q: 120, u: "g", item: "Baby spinach", cat: "Produce" },
      { q: 100, u: "g", item: "Cheddar", cat: "Dairy and Eggs" },
      { q: 120, u: "g", item: "Cherry tomatoes", cat: "Produce" },
      { q: 3, u: "each", item: "Scallions", cat: "Produce" },
      { q: 1, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 0.5, u: "tsp", item: "Black pepper", cat: "Pantry" },
    ],
    steps: [
      "Heat the oven to 375°F (190°C) and lightly oil a 12 cup muffin tin.",
      "Wilt the spinach in a pan for a minute, squeeze out any excess water and chop it finely. Quarter the tomatoes and slice the scallions.",
      "Whisk the eggs with the pepper. Stir in the spinach, tomatoes, scallions and most of the grated cheddar, then pour evenly into the tin. Top with the remaining cheese.",
      "Bake for 20 to 22 minutes until set and golden. Cool in the tin for five minutes before removing. Keep in the refrigerator for up to four days.",
    ],
    nutrition: { cal: 300, protein: 23, carbs: 5, fat: 21, fiber: 1.5 },
    allergens: ["Egg", "Milk"],
    swaps: ["Use feta or a dairy free cheese if you prefer.", "Use kale, peppers or mushrooms in place of spinach.", "Add diced ham or smoked salmon for extra protein."],
  },
  {
    id: "lemonChicken", title: "Lemon Chicken Skillet with Asparagus", cats: ["Dinner", "Lunch", "High Protein", "Family Meals", "Dairy Free", "Gluten Free"],
    prep: 10, cook: 25, servings: 4, media: "recipes.lemonChicken",
    blurb: "Golden chicken and tender asparagus in a bright lemon pan sauce, all in one skillet.",
    ingredients: [
      { q: 700, u: "g", item: "Chicken breast cutlets", cat: "Proteins" },
      { q: 2, u: "each", item: "Lemons", cat: "Produce" },
      { q: 3, u: "clove", item: "Garlic", cat: "Produce" },
      { q: 2, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 400, u: "g", item: "Asparagus", cat: "Produce" },
      { q: 250, u: "ml", item: "Chicken stock", cat: "Pantry" },
      { q: 1, u: "tsp", item: "Dried thyme", cat: "Pantry" },
      { q: 250, u: "g", item: "Microwave brown rice", cat: "Pantry" },
    ],
    steps: [
      "Season the cutlets with salt, pepper and the thyme. Heat the oil in a large skillet over medium high heat and brown the chicken for 4 minutes each side. Remove to a plate.",
      "Add the sliced garlic and the asparagus, cut into short lengths, and cook for 3 minutes.",
      "Pour in the stock and the juice of one lemon, scraping up the browned bits. Return the chicken, lay slices of the second lemon on top and simmer gently for 8 minutes until the sauce thickens slightly.",
      "Serve over warmed rice with extra lemon at the table.",
    ],
    nutrition: { cal: 410, protein: 42, carbs: 24, fat: 15, fiber: 3 },
    allergens: [],
    swaps: ["Use boneless chicken thighs for a richer result, adding five minutes of cooking.", "Swap rice for baby potatoes or quinoa.", "For a vegetarian version, use firm tofu or white beans."],
  },
  {
    id: "chickpeaStew", title: "Chickpea and Spinach Stew", cats: ["Dinner", "Vegan", "Gluten Free", "Dairy Free", "Budget Friendly", "Meal Prep"],
    prep: 10, cook: 30, servings: 4, media: "recipes.chickpeaStew",
    blurb: "A smoky, deeply savory pot that gets better on day two.",
    ingredients: [
      { q: 2, u: "can", item: "Chickpeas (400 g cans)", cat: "Pantry" },
      { q: 1, u: "can", item: "Diced tomatoes (400 g can)", cat: "Pantry" },
      { q: 1, u: "each", item: "Onion", cat: "Produce" },
      { q: 3, u: "clove", item: "Garlic", cat: "Produce" },
      { q: 2, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 2, u: "tsp", item: "Smoked paprika", cat: "Pantry" },
      { q: 1, u: "tsp", item: "Ground cumin", cat: "Pantry" },
      { q: 500, u: "ml", item: "Vegetable stock", cat: "Pantry" },
      { q: 150, u: "g", item: "Baby spinach", cat: "Produce" },
      { q: 1, u: "each", item: "Lemon", cat: "Produce" },
    ],
    steps: [
      "Soften the diced onion in the oil over medium heat for 8 minutes. Add the garlic, paprika and cumin and cook for one minute until fragrant.",
      "Add the drained chickpeas, tomatoes and stock. Simmer gently for 20 minutes until the stew thickens, crushing a few chickpeas against the side of the pot.",
      "Stir in the spinach for the last 2 minutes. Finish with the juice of the lemon and season to taste.",
      "Serve with a spoonful of yogurt and a drizzle of chili oil, if you like.",
    ],
    nutrition: { cal: 340, protein: 14, carbs: 48, fat: 10, fiber: 13 },
    allergens: [],
    swaps: ["Use white beans or lentils if you prefer.", "Swap spinach for kale or chard, adding it five minutes earlier.", "Stir in a spoonful of yogurt at the table if you eat dairy."],
  },
  {
    id: "salmonGreens", title: "Grilled Salmon with Zucchini and Carrots", cats: ["Dinner", "Quick Meals", "Gluten Free", "High Protein"],
    prep: 10, cook: 18, servings: 2, media: "recipes.salmonGreens",
    blurb: "Charred salmon with sweet roasted vegetables and a cool lemon dill yogurt sauce.",
    ingredients: [
      { q: 2, u: "each", item: "Salmon fillets (about 150 g each)", cat: "Proteins" },
      { q: 2, u: "each", item: "Zucchini", cat: "Produce" },
      { q: 3, u: "each", item: "Carrots", cat: "Produce" },
      { q: 2, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 120, u: "g", item: "Greek yogurt", cat: "Dairy and Eggs" },
      { q: 1, u: "each", item: "Lemon", cat: "Produce" },
      { q: 10, u: "g", item: "Fresh dill", cat: "Produce" },
    ],
    steps: [
      "Slice the carrots into thin batons and the zucchini into thick rounds. Toss with half the oil and a pinch of salt, and roast at 425°F (220°C) for 12 minutes.",
      "Stir together the yogurt, the zest and juice of half the lemon, chopped dill and a pinch of salt.",
      "Brush the salmon with the remaining oil, season, and grill or pan sear for 3 to 4 minutes each side until just cooked through.",
      "Plate the vegetables, set the salmon on top and spoon over the sauce. Serve with the remaining lemon.",
    ],
    nutrition: { cal: 520, protein: 40, carbs: 18, fat: 31, fiber: 5 },
    allergens: ["Fish", "Milk"],
    swaps: ["Use trout or arctic char in place of salmon.", "Use a dairy free yogurt for the sauce.", "Swap the vegetables for asparagus or green beans."],
  },
  {
    id: "lentilSalad", title: "Lentil and Radish Salad with Mustard Dressing", cats: ["Lunch", "Gluten Free", "Dairy Free", "Budget Friendly", "Meal Prep"],
    prep: 15, cook: 25, servings: 4, media: "recipes.lentilSalad",
    blurb: "Peppery radishes and earthy lentils over crisp leaves, with a sharp mustard dressing.",
    ingredients: [
      { q: 250, u: "g", item: "Green or brown lentils (dry)", cat: "Pantry" },
      { q: 1, u: "each", item: "Romaine or leaf lettuce", cat: "Produce" },
      { q: 8, u: "each", item: "Radishes", cat: "Produce" },
      { q: 200, u: "g", item: "Green beans", cat: "Produce" },
      { q: 3, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 2, u: "tbsp", item: "Red wine vinegar", cat: "Pantry" },
      { q: 1, u: "tsp", item: "Dijon mustard", cat: "Pantry" },
      { q: 30, u: "g", item: "Pumpkin seeds", cat: "Pantry" },
    ],
    steps: [
      "Simmer the rinsed lentils in plenty of water for 20 to 25 minutes until tender but not mushy. Drain well and cool slightly.",
      "Blanch the green beans for 3 minutes, then cool under cold water and cut into short lengths. Slice the radishes thinly and tear the lettuce.",
      "Whisk the oil, vinegar and mustard with a pinch of salt. Toss through the warm lentils.",
      "Fold in the beans, radishes and lettuce, and scatter with the pumpkin seeds. The lentils keep for four days in the refrigerator, so dress the leaves just before eating.",
    ],
    nutrition: { cal: 400, protein: 21, carbs: 44, fat: 15, fiber: 16 },
    allergens: [],
    swaps: ["Use canned lentils to save 25 minutes.", "Crumble feta over the top if you eat dairy.", "Swap radishes for cucumber or shaved fennel."],
  },
  {
    id: "overnightOats", title: "Overnight Oats with Chia and Berries", cats: ["Breakfast", "Vegetarian", "Meal Prep", "Travel", "Budget Friendly"],
    prep: 10, cook: 0, servings: 2, media: "recipes.overnightOats",
    blurb: "Prepare it in two minutes the night before and breakfast is waiting.",
    ingredients: [
      { q: 80, u: "g", item: "Rolled oats", cat: "Pantry" },
      { q: 300, u: "ml", item: "Milk or plant milk", cat: "Dairy and Eggs" },
      { q: 2, u: "tbsp", item: "Chia seeds", cat: "Pantry" },
      { q: 120, u: "g", item: "Greek yogurt", cat: "Dairy and Eggs" },
      { q: 150, u: "g", item: "Strawberries", cat: "Produce" },
      { q: 60, u: "g", item: "Blueberries", cat: "Produce" },
      { q: 2, u: "tsp", item: "Maple syrup", cat: "Pantry" },
    ],
    steps: [
      "Stir together the oats, milk, chia, yogurt and maple syrup. Divide between two jars.",
      "Cover and refrigerate overnight, or for at least four hours.",
      "In the morning, top with sliced strawberries and the blueberries, and add a splash of milk if you prefer a looser texture.",
    ],
    nutrition: { cal: 350, protein: 18, carbs: 50, fat: 9, fiber: 10 },
    allergens: ["Milk"],
    swaps: ["Use soy milk and soy yogurt to keep the protein high without dairy.", "Top with sliced pear, apple or banana.", "Stir in a spoonful of nut butter for extra staying power."],
  },
  {
    id: "turkeyMeatballs", title: "Turkey Meatball Bake with Tomato and Mozzarella", cats: ["Dinner", "Meal Prep", "High Protein", "Family Meals"],
    prep: 20, cook: 30, servings: 4, media: "recipes.turkeyMeatballs",
    blurb: "Tender turkey meatballs baked in a rich tomato sauce under melted mozzarella.",
    ingredients: [
      { q: 600, u: "g", item: "Ground turkey", cat: "Proteins" },
      { q: 1, u: "each", item: "Egg", cat: "Dairy and Eggs" },
      { q: 40, u: "g", item: "Breadcrumbs", cat: "Pantry" },
      { q: 1, u: "each", item: "Onion", cat: "Produce" },
      { q: 3, u: "clove", item: "Garlic", cat: "Produce" },
      { q: 1, u: "can", item: "Crushed tomatoes (800 g can)", cat: "Pantry" },
      { q: 1, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 2, u: "tsp", item: "Dried oregano", cat: "Pantry" },
      { q: 125, u: "g", item: "Mozzarella", cat: "Dairy and Eggs" },
      { q: 15, u: "g", item: "Fresh basil", cat: "Produce" },
    ],
    steps: [
      "Heat the oven to 400°F (200°C). Mix the turkey with the egg, breadcrumbs, half the grated onion, half the garlic, half the oregano and a good pinch of salt. Shape into 16 balls.",
      "Soften the remaining onion in the oil in an ovenproof skillet for 5 minutes. Add the remaining garlic and oregano, then the tomatoes, and simmer for 5 minutes.",
      "Nestle the meatballs into the sauce, cover and bake for 20 minutes. Top with torn mozzarella and bake uncovered for 8 to 10 minutes until bubbling and golden.",
      "Scatter with basil and serve with a green salad or steamed vegetables. Portions freeze for up to three months.",
    ],
    nutrition: { cal: 380, protein: 36, carbs: 20, fat: 17, fiber: 4 },
    allergens: ["Egg", "Milk", "Wheat"],
    swaps: ["Use gluten free breadcrumbs or ground almonds.", "Use lean ground chicken or beef in place of turkey.", "Leave off the mozzarella for a dairy free version."],
  },
  {
    id: "tomatoSoup", title: "Roasted Tomato Soup with Basil", cats: ["Lunch", "Vegetarian", "Meal Prep", "Budget Friendly", "Family Meals"],
    prep: 10, cook: 35, servings: 4, media: "recipes.tomatoSoup",
    blurb: "A velvety soup of roasted tomatoes and fresh basil, lovely with a toasted cheese sandwich.",
    ingredients: [
      { q: 1, u: "kg", item: "Ripe tomatoes", cat: "Produce" },
      { q: 1, u: "each", item: "Onion", cat: "Produce" },
      { q: 4, u: "clove", item: "Garlic", cat: "Produce" },
      { q: 2, u: "tbsp", item: "Olive oil", cat: "Pantry" },
      { q: 500, u: "ml", item: "Vegetable stock", cat: "Pantry" },
      { q: 20, u: "g", item: "Fresh basil", cat: "Produce" },
      { q: 4, u: "tbsp", item: "Greek yogurt", cat: "Dairy and Eggs" },
      { q: 4, u: "each", item: "Whole grain bread slices", cat: "Bakery" },
    ],
    steps: [
      "Heat the oven to 425°F (200°C). Halve the tomatoes and quarter the onion. Toss with the oil, garlic cloves in their skins and a pinch of salt, and roast on a tray for 30 minutes until soft and lightly charred.",
      "Squeeze the garlic from its skins into a pot with the roasted vegetables, stock and most of the basil. Simmer for 5 minutes.",
      "Blend until smooth, adjust the seasoning, and ladle into bowls with a swirl of yogurt and the remaining basil.",
      "Serve with whole grain toast, or a toasted cheese sandwich if you want something more filling.",
    ],
    nutrition: { cal: 220, protein: 8, carbs: 28, fat: 9, fiber: 6 },
    allergens: ["Milk", "Wheat"],
    swaps: ["Use dairy free yogurt, or finish with a little olive oil instead.", "Use gluten free bread, or serve without.", "Use two cans of whole tomatoes when fresh ones are out of season."],
  },
  {
    id: "veggieStirFry", title: "Rainbow Vegetable Stir Fry with Ginger", cats: ["Dinner", "Vegan", "Dairy Free", "Quick Meals", "Budget Friendly"],
    prep: 10, cook: 8, servings: 2, media: "recipes.veggieStirFry",
    blurb: "Crisp vegetables tossed in a hot wok with ginger, garlic and soy sauce.",
    ingredients: [
      { q: 1, u: "each", item: "Red bell pepper", cat: "Produce" },
      { q: 200, u: "g", item: "Broccoli", cat: "Produce" },
      { q: 150, u: "g", item: "Mushrooms", cat: "Produce" },
      { q: 2, u: "each", item: "Carrots", cat: "Produce" },
      { q: 1, u: "each", item: "Onion", cat: "Produce" },
      { q: 10, u: "g", item: "Fresh ginger", cat: "Produce" },
      { q: 2, u: "clove", item: "Garlic", cat: "Produce" },
      { q: 2, u: "tbsp", item: "Soy sauce", cat: "Pantry" },
      { q: 1, u: "tbsp", item: "Sesame oil", cat: "Pantry" },
      { q: 250, u: "g", item: "Microwave brown rice", cat: "Pantry" },
    ],
    steps: [
      "Cut all the vegetables into similar bite sized pieces so they cook evenly. Mince the ginger and garlic.",
      "Heat the sesame oil in a wok over high heat until it just shimmers. Add the carrots and broccoli and stir fry for 3 minutes.",
      "Add the pepper, onion and mushrooms with the ginger and garlic, and toss for 3 minutes more. Pour in the soy sauce with a splash of water and cook for one final minute.",
      "Serve at once over warmed rice.",
    ],
    nutrition: { cal: 360, protein: 11, carbs: 62, fat: 8, fiber: 9 },
    allergens: ["Soy", "Sesame"],
    swaps: ["Add cubed firm tofu, a handful of cashews or an egg for more protein.", "Use tamari for a gluten free version.", "Swap any vegetable for what is in the refrigerator."],
  },
  {
    id: "chiaPudding", title: "Berry Chia Pudding Jars", cats: ["Snacks", "Breakfast", "Vegan", "Gluten Free", "Dairy Free", "Meal Prep", "Travel"],
    prep: 10, cook: 0, servings: 2, media: "recipes.chiaPudding",
    blurb: "Creamy chia pudding topped with a quick berry compote, ready to grab from the refrigerator.",
    ingredients: [
      { q: 6, u: "tbsp", item: "Chia seeds", cat: "Pantry" },
      { q: 300, u: "ml", item: "Unsweetened soy or almond milk", cat: "Dairy and Eggs" },
      { q: 1, u: "tsp", item: "Vanilla extract", cat: "Pantry" },
      { q: 2, u: "tsp", item: "Maple syrup", cat: "Pantry" },
      { q: 150, u: "g", item: "Frozen mixed berries", cat: "Frozen" },
    ],
    steps: [
      "Whisk the chia seeds with the milk, vanilla and one teaspoon of maple syrup. Leave for 5 minutes, whisk again to break up any clumps, then refrigerate for at least two hours or overnight.",
      "Warm the frozen berries with the remaining maple syrup in a small pan for 5 minutes, mashing lightly. Cool completely.",
      "Layer the pudding and berry compote in two jars. Keeps for four days in the refrigerator.",
    ],
    nutrition: { cal: 230, protein: 9, carbs: 22, fat: 12, fiber: 13 },
    allergens: ["Soy (if using soy milk)"],
    swaps: ["Use dairy milk and stir in a spoonful of Greek yogurt for extra protein.", "Use fresh berries when they are in season.", "Top with a few chopped nuts for crunch."],
  },
  {
    id: "greenSmoothie", title: "Green Apple and Spinach Smoothie", cats: ["Snacks", "Breakfast", "Vegetarian", "Gluten Free", "Quick Meals", "Travel"],
    prep: 5, cook: 0, servings: 1, media: "recipes.greenSmoothie",
    blurb: "A fresh, lightly sweet smoothie that is easy to drink on the way out of the door.",
    ingredients: [
      { q: 1, u: "each", item: "Green apple", cat: "Produce" },
      { q: 40, u: "g", item: "Baby spinach", cat: "Produce" },
      { q: 150, u: "g", item: "Greek yogurt", cat: "Dairy and Eggs" },
      { q: 150, u: "ml", item: "Cold water or milk", cat: "Dairy and Eggs" },
      { q: 1, u: "tsp", item: "Lemon juice", cat: "Produce" },
      { q: 1, u: "tbsp", item: "Chia seeds", cat: "Pantry" },
    ],
    steps: [
      "Core and roughly chop the apple. Add it to a blender with the spinach, yogurt, water or milk, lemon juice and chia seeds.",
      "Blend on high for about a minute until completely smooth, adding a little more liquid if it is too thick.",
      "Pour into a tall glass and drink right away, or pour into a bottle and keep it cold for up to a day.",
    ],
    nutrition: { cal: 200, protein: 14, carbs: 28, fat: 5, fiber: 7 },
    allergens: ["Milk"],
    swaps: ["Use soy yogurt for a dairy free smoothie.", "Add half a banana for a sweeter, creamier result.", "Add a small piece of fresh ginger for a little warmth."],
  },
];

function getRecipe(id) { return RECIPES.find((r) => r.id === id); }

/* A sample week for the client portal. One serving of each meal per day. */
const SAMPLE_WEEK = [
  { b: "yogurtBowl", l: "lentilSalad", s: "greenSmoothie", d: "lemonChicken" },
  { b: "eggMuffins", l: "tomatoSoup", s: "chiaPudding", d: "salmonGreens" },
  { b: "overnightOats", l: "lemonChicken", s: "greenSmoothie", d: "chickpeaStew" },
  { b: "eggMuffins", l: "chickpeaStew", s: "chiaPudding", d: "veggieStirFry" },
  { b: "yogurtBowl", l: "lentilSalad", s: "greenSmoothie", d: "turkeyMeatballs" },
  { b: "overnightOats", l: "tomatoSoup", s: "chiaPudding", d: "veggieStirFry" },
  { b: "eggMuffins", l: "turkeyMeatballs", s: "greenSmoothie", d: "salmonGreens" },
];
const MEAL_SLOTS = [["b", "Breakfast"], ["l", "Lunch"], ["s", "Snack"], ["d", "Dinner"]];

const SHOP_ORDER = ["Produce", "Proteins", "Dairy and Eggs", "Pantry", "Bakery", "Frozen"];

/* Scales each recipe to the number of servings used and merges duplicates. */
function buildShoppingList(uses) {
  const map = new Map();
  uses.forEach(({ id, servings = 1 }) => {
    const r = getRecipe(id);
    if (!r) return;
    const scale = servings / r.servings;
    r.ingredients.forEach((ing) => {
      const key = ing.item.toLowerCase() + "|" + ing.u;
      const row = map.get(key) || { item: ing.item, u: ing.u, cat: ing.cat, q: 0 };
      row.q += ing.q * scale;
      map.set(key, row);
    });
  });
  const groups = {};
  map.forEach((row) => { (groups[row.cat] = groups[row.cat] || []).push(row); });
  return SHOP_ORDER.filter((c) => groups[c]).map((c) => ({
    cat: c,
    items: groups[c].sort((a, b) => a.item.localeCompare(b.item)).map((row) => ({ ...row, label: formatQty(row) })),
  }));
}

function formatQty(row) {
  const { q, u } = row;
  if (u === "each" || u === "clove" || u === "can") {
    const n = Math.max(1, Math.ceil(q - 0.05));
    const word = u === "each" ? "" : u + (n > 1 ? "s" : "");
    return `${n} ${word}`.trim();
  }
  if (u === "kg") { return (Math.ceil(q * 10) / 10) + " kg"; }
  if (u === "g") { return q >= 1000 ? (q / 1000).toFixed(1) + " kg" : Math.ceil(q / 5) * 5 + " g"; }
  if (u === "ml") { return q >= 1000 ? (q / 1000).toFixed(1) + " L" : Math.ceil(q / 10) * 10 + " ml"; }
  if (u === "tbsp" || u === "tsp") {
    const r = Math.max(0.25, Math.ceil(q * 4) / 4);
    const pretty = r === Math.floor(r) ? String(r) : r.toFixed(2).replace(/0$/, "");
    return `${pretty} ${u}`;
  }
  return `${Math.round(q * 10) / 10} ${u}`;
}

function shoppingListToText(groups, title = "NOURA shopping list") {
  return [title, ""].concat(groups.flatMap((g) => [g.cat.toUpperCase()].concat(g.items.map((i) => `  ${i.label} ${i.item}`)).concat([""]))).join("\n");
}
