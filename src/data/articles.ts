export interface TimelinePoint {
  year: string;
  event: string;
}

export interface WorldSpread {
  country: string;
  year: string;
  role: string;
  lat: number;
  lng: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  food: string;
  category: string;
  emoji: string;
  teaser: string;
  hook: string;
  body: string;
  timeline: TimelinePoint[];
  fast_facts: string[];
  world_spread: WorldSpread[];
  mermaid_mindmap: string;
  youtube_query: string;
  common_vs_exotic: { origin_country: string; origin_use: string; western_use: string };
  is_published: boolean;
  created_at: string;
  image_url: string;
}

export const articles: Article[] = [
  {
    id: "1",
    slug: "dark-history-of-chocolate",
    title: "The Dark History of Chocolate",
    food: "Chocolate",
    category: "Common Foods",
    emoji: "🍫",
    teaser: "From Aztec currency to Swiss milk chocolate — chocolate's journey is darker than the darkest bar.",
    hook: `The next time you unwrap a chocolate bar, consider this: you're eating something that was once so valuable, the Aztec empire used it as currency. Cacao beans weren't just food — they were money, medicine, and a direct line to the gods.\n\nMontezuma II reportedly drank 50 cups of xocolātl a day from golden goblets. But this wasn't the sweet, creamy drink you're imagining. It was a bitter, frothy concoction mixed with chili peppers, vanilla, and sometimes human blood. The word "chocolate" itself comes from the Nahuatl word "xocolātl," meaning "bitter water."\n\nWhat happened between those sacred Aztec ceremonies and your grocery store checkout line is a story of conquest, slavery, industrial revolution, and one Swiss man's obsession with making it smooth enough to melt on your tongue.`,
    body: `## The Divine Bean\n\nFor the ancient Maya and Aztec civilizations, cacao wasn't merely a crop — it was a gift from the gods. The scientific name *Theobroma cacao* literally translates to "food of the gods," a designation given by Carl Linnaeus in 1753 that unknowingly echoed beliefs held for millennia.\n\nArchaeological evidence suggests humans have been consuming cacao for at least 5,300 years. Residue found on pottery in the Santa Ana-La Florida archaeological site in Ecuador dates to 3300 BCE, pushing back the known history of chocolate consumption by nearly 2,000 years.\n\n## Conquest and Transformation\n\nWhen Hernán Cortés arrived in the Aztec capital of Tenochtitlan in 1519, he was served xocolātl by Emperor Montezuma. Cortés recognized not the flavor — which he reportedly found revolting — but the economic value. He wrote to King Charles V of Spain: "A drink that builds up resistance and fights fatigue."\n\nSpanish colonizers brought cacao back to Europe, but they made a crucial modification: they added sugar. This single change transformed chocolate from a bitter ceremonial drink into a luxury that would sweep across European courts. For nearly a century, Spain kept chocolate a closely guarded secret from the rest of Europe.\n\n## The Dark Side of Sweet\n\nThe explosion of European demand for chocolate came with a devastating human cost. To feed the growing appetite, colonial powers established cacao plantations across Central America, the Caribbean, and eventually West Africa — all powered by enslaved labor.\n\nBy the 18th century, chocolate production was inextricably linked to the transatlantic slave trade. The bitter irony: a product born from sacred indigenous ceremonies became fuel for one of history's greatest atrocities.\n\n## The Industrial Revolution of Chocolate\n\nIn 1828, Dutch chemist Coenraad van Houten invented the cocoa press, which could squeeze the fat (cocoa butter) from roasted cacao beans. This was the breakthrough that made modern chocolate possible. The remaining powder could be mixed with liquids and other ingredients more easily.\n\nThen in 1875, Daniel Peter, a Swiss chocolatier, spent eight years figuring out how to add milk to chocolate. His neighbor happened to be Henri Nestlé, who had recently developed a process for condensed milk. Together, they created milk chocolate — and changed the world.\n\nFour years later, another Swiss genius, Rodolphe Lindt, invented the conching machine, which heated and mixed chocolate for hours until it became incredibly smooth. This is why Swiss chocolate melts on your tongue the way it does.\n\n## Modern Chocolate's Uncomfortable Truth\n\nToday, chocolate is a $130 billion global industry. Yet approximately 70% of the world's cacao comes from West Africa, where an estimated 1.56 million children work in cocoa production, many in hazardous conditions. The average cacao farmer in Côte d'Ivoire earns less than $2 a day — well below the poverty line.\n\nThe journey from sacred Aztec beverage to mass-produced candy bar is a story that mirrors humanity itself: full of brilliance, exploitation, and the relentless pursuit of something that tastes good.`,
    timeline: [
      { year: "3300 BCE", event: "Earliest known cacao use in Ecuador" },
      { year: "1900 BCE", event: "Maya begin cultivating cacao trees" },
      { year: "1400 CE", event: "Aztecs use cacao beans as currency" },
      { year: "1519", event: "Cortés encounters chocolate in Tenochtitlan" },
      { year: "1585", event: "First official chocolate shipment to Spain" },
      { year: "1657", event: "First chocolate house opens in London" },
      { year: "1828", event: "Van Houten invents the cocoa press" },
      { year: "1875", event: "Daniel Peter creates milk chocolate in Switzerland" },
      { year: "1879", event: "Lindt invents conching for smooth chocolate" },
      { year: "2024", event: "$130 billion global industry" }
    ],
    fast_facts: [
      "3,500+ years of human consumption",
      "$130 billion global industry",
      "40-50 million farmers depend on it",
      "70% comes from West Africa",
      "Aztecs used it as currency"
    ],
    world_spread: [
      { country: "Ecuador", year: "3300 BCE", role: "origin", lat: -1.8, lng: -78.2 },
      { country: "Mexico", year: "1400 CE", role: "Aztec empire", lat: 19.4, lng: -99.1 },
      { country: "Spain", year: "1585", role: "First European market", lat: 40.4, lng: -3.7 },
      { country: "England", year: "1657", role: "Chocolate houses", lat: 51.5, lng: -0.1 },
      { country: "Switzerland", year: "1875", role: "Milk chocolate invention", lat: 46.8, lng: 8.2 },
      { country: "Côte d'Ivoire", year: "1960s", role: "Major producer", lat: 7.5, lng: -5.5 },
      { country: "USA", year: "1900s", role: "Mass production", lat: 39.8, lng: -98.6 }
    ],
    mermaid_mindmap: `mindmap
  root((🍫 Chocolate))
    Origins
      Ecuador 3300 BCE
      Maya cultivation
      Aztec currency
    Colonialism
      Spanish conquest
      Slave trade
      Plantation economy
    Innovation
      Cocoa press 1828
      Milk chocolate 1875
      Conching 1879
    Modern Era
      $130B industry
      Child labor concerns
      Fair trade movement`,
    youtube_query: "history of chocolate documentary",
    common_vs_exotic: {
      origin_country: "Mexico",
      origin_use: "A bitter, frothy ceremonial drink mixed with chili peppers, served in golden goblets to royalty",
      western_use: "A $2 sweet candy bar wrapped in foil, eaten as a casual snack"
    },
    is_published: true,
    created_at: "2024-01-01",
    image_url: ""
  },
  {
    id: "2",
    slug: "how-peppers-conquered-the-world",
    title: "How Peppers Conquered the World",
    food: "Peppers",
    category: "Spices",
    emoji: "🌶️",
    teaser: "Columbus thought they were black pepper — that mistake changed global cuisine forever.",
    hook: `When Christopher Columbus landed in the Caribbean in 1492, he was looking for black pepper — one of the most valuable spices in the medieval world. What he found instead was an entirely different plant that happened to make his mouth burn. He called it "pepper" anyway, and that naming mistake has confused people for over 500 years.\n\nHere's the twist: chili peppers and black pepper are completely unrelated. Black pepper comes from a vine native to India. Chili peppers are fruits from plants in the genus Capsicum, native to the Americas. They share nothing but Columbus's desperation to justify his voyage to his Spanish patrons.\n\nWithin 50 years of Columbus's blunder, chili peppers had spread to every inhabited continent. No other food in human history has been adopted so quickly and so completely by so many cultures.`,
    body: `## A 10,000-Year American Story\n\nLong before Columbus confused them with black pepper, chili peppers had been a cornerstone of the Americas for millennia. Archaeological evidence from Tehuacan, Mexico shows that humans were eating wild chilies around 7500 BCE, making peppers one of the earliest plants consumed by humans in the Western Hemisphere.\n\nBy 4000 BCE, indigenous peoples had begun actively cultivating them — predating the domestication of corn. The Aztecs classified peppers with an almost scientific precision, identifying six distinct categories based on heat and flavor. Chili peppers weren't just food; they were medicine, weapons of war (burning chilies were used as chemical warfare), and tools of punishment.\n\n## The Fastest Conquest in Food History\n\nPortuguese traders, not the Spanish, were primarily responsible for spreading chilies globally. They carried pepper seeds along their maritime trade routes to Africa, India, and Southeast Asia in the early 1500s.\n\nThe speed of adoption was staggering. Within decades of arrival, chili peppers became so integrated into local cuisines that many cultures forgot they were foreign imports. When European botanists visited India in the 17th century, they assumed chilies were native to Asia. Thai cuisine, Sichuan cooking, Korean kimchi, Hungarian paprika — all these "ancient traditions" are built on a New World ingredient that's barely 500 years old in those regions.\n\n## Why Peppers Conquered Where Others Failed\n\nThe secret to chili peppers' global domination lies in a molecule called capsaicin. This chemical compound triggers pain receptors in the mouth, creating the sensation of burning. But unlike actual burns, capsaicin causes no real tissue damage. Instead, the brain responds by releasing endorphins — the body's natural painkillers.\n\nIn other words, eating spicy food is essentially a controlled form of thrill-seeking. Humans are the only mammals that voluntarily seek out this sensation. Psychologist Paul Rozin called this "benign masochism" — the pleasure of pain in a safe context.\n\nBut there's a more practical reason peppers spread so fast: in tropical climates before refrigeration, capsaicin's antimicrobial properties helped preserve food. Cultures in hotter regions adopted spicier diets not just for flavor, but for survival.\n\n## The Scoville Arms Race\n\nIn 1912, pharmacist Wilbur Scoville developed a test to measure pepper heat. The bell pepper scores 0 Scoville Heat Units (SHU). A jalapeño hits around 5,000 SHU. The Carolina Reaper, currently the world's hottest pepper, measures over 2.2 million SHU — so hot it has caused thunderclap headaches and sent people to emergency rooms.\n\nThe quest for ever-hotter peppers has become a global obsession, spawning competitive eating contests, hot sauce empires, and a community of "chiliheads" who breed increasingly extreme varieties. It's a fitting modern chapter for a plant that has always pushed boundaries.\n\n## The Pepper Paradox\n\nPerhaps the greatest irony of the chili pepper's story is this: a plant evolved capsaicin specifically to repel mammals (birds, which spread seeds more effectively, can't taste it). Humans not only overcame that defense — they fell in love with it, cultivated it, and spread it to every corner of the globe. The pepper's greatest weapon became its greatest selling point.`,
    timeline: [
      { year: "7500 BCE", event: "Wild chilies consumed in Mexico" },
      { year: "4000 BCE", event: "Chili peppers domesticated in Americas" },
      { year: "1492", event: "Columbus encounters chilies, calls them 'pepper'" },
      { year: "1498", event: "Portuguese bring chilies to India" },
      { year: "1500s", event: "Chilies spread across Africa and Asia" },
      { year: "1569", event: "Peppers reach China via Silk Road" },
      { year: "1600s", event: "Paprika emerges in Hungary" },
      { year: "1912", event: "Scoville heat scale invented" },
      { year: "2013", event: "Carolina Reaper sets world record at 2.2M SHU" }
    ],
    fast_facts: [
      "7,500+ years of human consumption",
      "Spread to every continent in just 50 years",
      "Over 4,000 varieties exist today",
      "Capsaicin triggers endorphin release",
      "Hottest pepper: 2.2 million Scoville units"
    ],
    world_spread: [
      { country: "Mexico", year: "7500 BCE", role: "origin", lat: 19.4, lng: -99.1 },
      { country: "Spain", year: "1493", role: "Columbus brings seeds", lat: 40.4, lng: -3.7 },
      { country: "India", year: "1498", role: "Portuguese traders", lat: 20.6, lng: 78.9 },
      { country: "China", year: "1569", role: "Silk Road trade", lat: 35.9, lng: 104.2 },
      { country: "Hungary", year: "1600s", role: "Paprika culture", lat: 47.5, lng: 19.0 },
      { country: "Thailand", year: "1600s", role: "Portuguese influence", lat: 15.9, lng: 100.5 },
      { country: "Korea", year: "1700s", role: "Kimchi revolution", lat: 35.9, lng: 127.8 }
    ],
    mermaid_mindmap: `mindmap
  root((🌶️ Peppers))
    Americas Origin
      Mexico 7500 BCE
      Aztec classification
      Chemical warfare use
    Columbus Error
      Confused with black pepper
      Named incorrectly
      Portuguese spread globally
    Science
      Capsaicin molecule
      Endorphin response
      Antimicrobial properties
    Global Adoption
      Indian curries
      Sichuan cuisine
      Korean kimchi
      Hungarian paprika`,
    youtube_query: "history of chili peppers documentary",
    common_vs_exotic: {
      origin_country: "Mexico",
      origin_use: "Sacred ingredient in complex moles and salsas, dried and smoked into dozens of varieties",
      western_use: "Hot sauce on the side, often feared as 'too spicy'"
    },
    is_published: true,
    created_at: "2024-01-02",
    image_url: ""
  },
  {
    id: "3",
    slug: "pizza-wasnt-italian-for-long",
    title: "Pizza Wasn't Italian for Long",
    food: "Pizza",
    category: "Common Foods",
    emoji: "🍕",
    teaser: "The wild journey from Naples street food to America's favorite meal — and why Italians barely recognize what we call pizza.",
    hook: `Here's something that might ruin your next pizza night: the pizza you know and love is not Italian. Not really. What Americans call "pizza" would be virtually unrecognizable to the Neapolitan street vendors who invented it in the 18th century.\n\nOriginal Neapolitan pizza was food for the poor — sold by street vendors to workers who needed cheap, fast fuel. It was flatbread with simple toppings: tomato, garlic, oil, maybe some cheese. No pepperoni (an American invention). No stuffed crust. No pineapple debates.\n\nThe story of how a humble Neapolitan street food became a $150 billion global industry involves a queen, an immigration wave, a world war, and the single greatest marketing story in food history.`,
    body: `## Before Pizza Was Pizza\n\nFlatbreads with toppings have existed for thousands of years. The ancient Egyptians, Romans, and Greeks all ate variations. But what we call pizza specifically traces to Naples in the 18th century, where it emerged as cheap street food for the city's massive working-class population, the lazzaroni.\n\nNaples in this era was one of the largest cities in Europe, teeming with poverty. Pizza vendors walked the streets with portable ovens, selling slices to workers who ate them folded in half — the original "on the go" meal.\n\n## The Queen's Pizza\n\nThe origin story of Margherita pizza is likely embellished, but the legend is too good to skip. In 1889, Queen Margherita of Italy visited Naples. Tired of French haute cuisine, she reportedly asked to try the local street food. Pizzaiolo Raffaele Esposito supposedly created a pizza with tomato, mozzarella, and basil — representing the colors of the Italian flag — and named it after the queen.\n\nWhether or not this story is entirely true, it served a crucial purpose: it legitimized pizza. What was once peasant food became something a queen endorsed. This royal stamp of approval helped pizza begin its ascent from street snack to national dish.\n\n## The American Reinvention\n\nItalian immigrants brought pizza to the United States in the late 19th century. The first documented pizzeria in America, Lombardi's, opened in New York City in 1905. For decades, pizza remained an ethnic food, confined largely to Italian-American neighborhoods.\n\nEverything changed after World War II. American GIs who had been stationed in Italy came home craving the pizza they'd eaten overseas. Meanwhile, the postwar suburban boom created a perfect market for delivery food. Pizza was cheap, customizable, and could feed a whole family.\n\nBut American pizza evolved rapidly away from its Neapolitan roots. New York developed its famous thin, foldable slices. Chicago created the deep dish — essentially a pizza-shaped casserole. Detroit repurposed industrial parts trays as baking pans. Each region claimed its style was the "real" pizza.\n\n## The Chain Reaction\n\nThe 1960s brought pizza chains. Pizza Hut (1958), Domino's (1960), and Little Caesars (1959) transformed pizza from a local craft into an industrial product. Domino's pioneered the 30-minute delivery guarantee. Pizza Hut made the stuffed crust. These innovations horrified Italian purists but delighted American consumers.\n\nBy the 1990s, pizza had become America's favorite food. Today, Americans eat approximately 3 billion pizzas per year — roughly 23 pounds per person annually.\n\n## The Global Mutation\n\nPizza's global journey produced fascinating local adaptations. In Japan, you'll find pizzas topped with mayo, corn, and squid. In Brazil, pizza comes with green peas and hard-boiled eggs. India offers tandoori chicken pizza. South Korea has sweet potato crust pizza.\n\nEach of these would be unrecognizable to both the original Neapolitan street vendors and to most Americans. Pizza has become a blank canvas onto which each culture projects its own flavors. It's no longer Italian, American, or anything else — it's a universal food platform.`,
    timeline: [
      { year: "1000 CE", event: "Flatbreads with toppings common in Mediterranean" },
      { year: "1738", event: "First known pizzeria opens in Naples" },
      { year: "1889", event: "Pizza Margherita created for Queen Margherita" },
      { year: "1905", event: "Lombardi's opens in NYC — first US pizzeria" },
      { year: "1945", event: "WWII GIs bring pizza craving home" },
      { year: "1958", event: "Pizza Hut founded in Kansas" },
      { year: "1960", event: "Domino's founded — delivery revolution" },
      { year: "1995", event: "Pizza becomes America's #1 food" },
      { year: "2024", event: "$150 billion global industry" }
    ],
    fast_facts: [
      "Americans eat 3 billion pizzas per year",
      "$150 billion global industry",
      "23 pounds per person annually in the US",
      "First pizzeria opened in 1738 in Naples",
      "Pepperoni is an American invention"
    ],
    world_spread: [
      { country: "Italy", year: "1738", role: "origin", lat: 40.9, lng: 14.3 },
      { country: "USA", year: "1905", role: "Lombardi's NYC", lat: 40.7, lng: -74.0 },
      { country: "Brazil", year: "1950s", role: "Italian immigrants", lat: -23.5, lng: -46.6 },
      { country: "Japan", year: "1960s", role: "Unique local toppings", lat: 35.7, lng: 139.7 },
      { country: "India", year: "1996", role: "Domino's enters market", lat: 28.6, lng: 77.2 },
      { country: "South Korea", year: "2000s", role: "Sweet potato crust", lat: 37.6, lng: 127.0 }
    ],
    mermaid_mindmap: `mindmap
  root((🍕 Pizza))
    Naples Origins
      Street food for poor
      Lazzaroni workers
      Queen Margherita 1889
    American Evolution
      NYC thin crust
      Chicago deep dish
      Detroit style
    Chain Revolution
      Pizza Hut 1958
      Dominos delivery
      Mass production
    Global Mutations
      Japanese mayo corn
      Brazilian green peas
      Indian tandoori
      Korean sweet potato`,
    youtube_query: "history of pizza documentary",
    common_vs_exotic: {
      origin_country: "Italy",
      origin_use: "Simple flatbread from a wood-fired oven with fresh mozzarella, San Marzano tomatoes, and basil — eaten with a knife and fork",
      western_use: "Delivered in a cardboard box, loaded with processed toppings, eaten on the couch while watching TV"
    },
    is_published: true,
    created_at: "2024-01-03",
    image_url: ""
  },
  {
    id: "4",
    slug: "the-banana-you-eat-is-a-clone",
    title: "The Banana You Eat is a Clone",
    food: "Banana",
    category: "Common Foods",
    emoji: "🍌",
    teaser: "Every banana you've ever eaten is genetically identical — and the entire species is on the verge of collapse.",
    hook: `Every single Cavendish banana in every grocery store in the world is a genetic clone. Not similar — identical. The banana you ate this morning shares the exact same DNA as every other banana of its kind on Earth. They don't reproduce sexually. They can't produce seeds. Every new banana plant is a cutting from another banana plant, which was a cutting from another, going back decades.\n\nThis means the entire global banana supply — worth $25 billion and feeding hundreds of millions of people — has zero genetic diversity. And a fungal plague called Tropical Race 4 (TR4) is currently spreading across the world's banana plantations, killing plants that have no genetic ability to resist it.\n\nWe've seen this before. The banana your grandparents ate — the Gros Michel — was wiped out by a nearly identical fungus in the 1950s. We're watching history repeat itself, and there's no clear replacement waiting.`,
    body: `## The Original Banana Apocalypse\n\nBefore the 1950s, the world ate a different banana. The Gros Michel — or "Big Mike" — was by all accounts a superior fruit: creamier, sweeter, and with a more intense flavor than what we eat today. It was also the reason artificial banana flavoring tastes nothing like modern bananas — that flavoring was designed to taste like the Gros Michel.\n\nBut the Gros Michel had the same fatal flaw as today's Cavendish: it was a monoculture clone. When Panama disease (Tropical Race 1) arrived, it swept through plantations like wildfire. By the late 1950s, the Gros Michel was commercially extinct.\n\n## Enter the Cavendish\n\nThe banana industry didn't solve the monoculture problem — they just switched clones. The Cavendish, named after the greenhouse of English Duke William Cavendish where it was first grown in 1834, was resistant to the original Panama disease. It was smaller, less flavorful, and had a thinner skin that bruised easily. But it survived.\n\nThe industry retooled its entire infrastructure — from plantation layouts to shipping containers to ripening rooms — around this new banana. The Cavendish became the most consumed fruit on Earth, with over 100 billion eaten per year.\n\n## The Second Plague\n\nIn the 1990s, a new strain of the same fungus emerged in Southeast Asia: Tropical Race 4 (TR4). It's been called "banana cancer." The fungus lives in the soil, is virtually impossible to eradicate, and can remain dormant for decades. There is no treatment, no cure, and the Cavendish has no resistance.\n\nTR4 has already devastated plantations across Asia, Australia, the Middle East, and Africa. In 2019, it was confirmed in Latin America — the world's largest banana-exporting region. Scientists have called it "the biggest threat to the $25 billion global banana industry."\n\n## Why Bananas Are Weird\n\nWild bananas are small, hard, and full of large, rock-like seeds. The bananas we eat are the result of a genetic accident: ancient mutations that made the fruit seedless and triploid (three sets of chromosomes instead of two). This makes them sterile — they literally cannot reproduce without human intervention.\n\nEvery commercial banana plantation in the world is propagated by taking cuttings (called "suckers" or "pups") from existing plants and replanting them. This means every plant is genetically identical to its parent, its grandparent, and every other Cavendish on Earth.\n\n## The Race for a Solution\n\nScientists are pursuing several strategies. Some are trying to genetically modify the Cavendish to resist TR4. Others are exploring wild banana species with natural resistance. A team in Australia has created a GM Cavendish that shows promise in field trials, but consumer resistance to GMOs — particularly in Europe — creates a major market challenge.\n\nSome researchers argue we should simply diversify. There are over 1,000 varieties of banana grown around the world, but the Western market knows only one. In India alone, people eat dozens of different varieties with different flavors, textures, and colors. The monoculture isn't a biological necessity — it's a commercial choice.\n\nThe banana crisis is ultimately a story about what happens when efficiency trumps resilience. We optimized for one perfect banana, shipped it everywhere, and crossed our fingers that nothing would go wrong. Something went wrong.`,
    timeline: [
      { year: "8000 BCE", event: "Bananas first domesticated in Papua New Guinea" },
      { year: "327 BCE", event: "Alexander the Great encounters bananas in India" },
      { year: "1516", event: "Portuguese bring bananas to the Americas" },
      { year: "1834", event: "Cavendish banana first grown in England" },
      { year: "1870s", event: "United Fruit Company begins banana trade" },
      { year: "1950s", event: "Gros Michel wiped out by Panama disease" },
      { year: "1960s", event: "Cavendish replaces Gros Michel globally" },
      { year: "1990s", event: "TR4 fungus emerges in Southeast Asia" },
      { year: "2019", event: "TR4 confirmed in Latin America" }
    ],
    fast_facts: [
      "100+ billion bananas eaten per year",
      "$25 billion global industry",
      "Every Cavendish is a genetic clone",
      "Artificial banana flavor mimics the extinct Gros Michel",
      "Over 1,000 banana varieties exist worldwide"
    ],
    world_spread: [
      { country: "Papua New Guinea", year: "8000 BCE", role: "origin", lat: -6.3, lng: 143.9 },
      { country: "India", year: "327 BCE", role: "Alexander encounters bananas", lat: 20.6, lng: 78.9 },
      { country: "Brazil", year: "1516", role: "Portuguese import", lat: -14.2, lng: -51.9 },
      { country: "England", year: "1834", role: "Cavendish greenhouse", lat: 52.5, lng: -1.5 },
      { country: "Honduras", year: "1870s", role: "Banana republic", lat: 14.6, lng: -86.2 },
      { country: "Philippines", year: "1960s", role: "Major exporter", lat: 12.9, lng: 121.8 }
    ],
    mermaid_mindmap: `mindmap
  root((🍌 Banana))
    Biology
      Sterile triploid
      Seedless mutation
      Clonal propagation
    Gros Michel
      Superior flavor
      Artificial banana taste
      Panama Disease 1950s
    Cavendish Era
      Replaced Gros Michel
      Zero genetic diversity
      100B eaten per year
    TR4 Crisis
      Incurable fungus
      Spreading globally
      No replacement ready`,
    youtube_query: "banana extinction crisis documentary",
    common_vs_exotic: {
      origin_country: "Papua New Guinea",
      origin_use: "Dozens of varieties — red, purple, stubby, cooking bananas — each with unique flavor and purpose",
      western_use: "One variety (Cavendish), eaten raw as a convenience snack or put in smoothies"
    },
    is_published: true,
    created_at: "2024-01-04",
    image_url: ""
  },
  {
    id: "5",
    slug: "vanillas-brutal-past",
    title: "Vanilla's Brutal Past",
    food: "Vanilla",
    category: "Spices",
    emoji: "🌿",
    teaser: "Hand pollination, slavery, and a 12-year-old's discovery — vanilla's history is anything but plain.",
    hook: `"Vanilla" has become a synonym for boring. Plain. Default. Nothing could be further from the truth. Vanilla is the world's most labor-intensive crop, the second most expensive spice after saffron, and its history involves slavery, a 12-year-old boy's genius, and one of the most complex flavors known to science.\n\nHere's the fact that changes everything: every vanilla bean in the world is pollinated by hand. One flower at a time. Each flower opens for just a few hours. Miss that window, and you've lost a year's worth of waiting. The global vanilla supply depends entirely on human hands performing an operation so delicate it was invented by an enslaved child.\n\nAnd that child's story — Edmond Albius, a 12-year-old slave on the island of Réunion — is one of the most remarkable and overlooked stories in the history of food.`,
    body: `## The Orchid That Changed the World\n\nVanilla is an orchid — specifically, *Vanilla planifolia*, a climbing vine native to the tropical forests of Mexico. The Totonac people of eastern Mexico were the first to cultivate it, using it to flavor their version of chocolate. When the Aztecs conquered the Totonacs, they adopted vanilla and called it "tlilxochitl" — the black flower.\n\nWhen the Spanish conquered the Aztecs, they discovered vanilla and brought it back to Europe, where it became an instant sensation. But there was a problem: vanilla would only grow in Mexico. For 300 years, every attempt to cultivate it elsewhere failed. The plants would grow, they would flower, but they never produced beans.\n\n## The Missing Pollinator\n\nThe reason was invisible: vanilla orchids have a natural pollinator that exists only in Mexico — the Melipona bee. Without this specific bee, the flowers couldn't be pollinated, and without pollination, no vanilla beans would form. European botanists spent centuries trying to crack this puzzle.\n\n## A 12-Year-Old's Revolution\n\nIn 1841, on the French island of Réunion in the Indian Ocean, a 12-year-old enslaved boy named Edmond Albius changed everything. Using a thin stick and his thumb, he developed a technique to hand-pollinate vanilla flowers. The method was simple, elegant, and revolutionary. It took about 30 seconds per flower.\n\nEdmond's technique spread rapidly across the French colonies. Suddenly, vanilla could be grown anywhere in the tropics. Réunion, Madagascar, and Tahiti became vanilla powerhouses. Madagascar alone now produces about 80% of the world's vanilla.\n\nEdmond Albius received no compensation, no credit during his lifetime, and died in poverty in 1880. The technique he invented at age 12 is still used today — virtually unchanged — by every vanilla farmer in the world.\n\n## The Most Labor-Intensive Crop\n\nGrowing vanilla is an exercise in patience and precision. The vine takes 3-5 years to mature enough to flower. Each flower blooms for only 12-24 hours. If it's not pollinated in that window, it falls off and won't return for another year.\n\nAfter successful pollination, the beans take 9 months to mature on the vine. Then comes the curing process: the beans are blanched in hot water, sweated in wool blankets, dried in the sun for weeks, and conditioned in closed boxes for months. The entire process from pollination to finished vanilla bean takes over a year.\n\n## Why Vanilla Is So Complex\n\nVanilla contains over 250 distinct flavor and aroma compounds — more than almost any other food. This is why artificial vanilla (vanillin, a single compound usually derived from wood pulp or petroleum) tastes flat compared to real vanilla. You're comparing one note to a symphony.\n\nThe price of real vanilla has been wildly volatile. In 2018, it briefly exceeded the price of silver at over $600 per kilogram. This has made vanilla farming in Madagascar — where most farmers earn less than $2 per day — both a blessing and a curse. High prices attract theft, violence, and premature harvesting that degrades quality.\n\n## The "Boring" Spice\n\nThe fact that "vanilla" means "boring" in modern slang is perhaps the greatest injustice in food linguistics. This is a spice with a history of conquest, slavery, and child genius. A crop that requires more labor per pound than virtually any other. A flavor with more complexity than wine. There is nothing vanilla about vanilla.`,
    timeline: [
      { year: "1000 CE", event: "Totonac people cultivate vanilla in Mexico" },
      { year: "1400s", event: "Aztecs conquer Totonacs, adopt vanilla" },
      { year: "1520", event: "Spanish bring vanilla to Europe" },
      { year: "1602", event: "Hugh Morgan suggests vanilla as standalone flavor" },
      { year: "1841", event: "12-year-old Edmond Albius invents hand pollination" },
      { year: "1850s", event: "Madagascar becomes major vanilla producer" },
      { year: "1874", event: "Synthetic vanillin first produced" },
      { year: "2018", event: "Vanilla price exceeds silver at $600/kg" }
    ],
    fast_facts: [
      "250+ distinct flavor compounds",
      "Second most expensive spice after saffron",
      "Each flower blooms for only 12-24 hours",
      "Madagascar produces 80% of world supply",
      "Hand pollination invented by a 12-year-old slave"
    ],
    world_spread: [
      { country: "Mexico", year: "1000 CE", role: "origin", lat: 20.2, lng: -96.5 },
      { country: "Spain", year: "1520", role: "Spanish conquest", lat: 40.4, lng: -3.7 },
      { country: "Réunion", year: "1841", role: "Hand pollination invented", lat: -21.1, lng: 55.5 },
      { country: "Madagascar", year: "1850s", role: "Major producer (80%)", lat: -18.9, lng: 47.5 },
      { country: "Tahiti", year: "1870s", role: "Unique variety", lat: -17.7, lng: -149.4 },
      { country: "Indonesia", year: "1900s", role: "Second largest producer", lat: -0.8, lng: 113.9 }
    ],
    mermaid_mindmap: `mindmap
  root((🌿 Vanilla))
    Mexican Origins
      Totonac cultivation
      Aztec adoption
      Melipona bee pollinator
    Edmond Albius
      12-year-old slave
      Hand pollination 1841
      Changed industry forever
    Production
      3-5 years to mature
      12-24 hour bloom window
      Year-long curing process
    Modern Era
      250+ flavor compounds
      Price exceeds silver
      Madagascar dominance`,
    youtube_query: "history of vanilla spice documentary",
    common_vs_exotic: {
      origin_country: "Mexico",
      origin_use: "Sacred flavoring mixed with cacao for ceremonial drinks, cured by hand using ancient techniques",
      western_use: "Artificial vanillin in mass-produced ice cream and baked goods — the real thing costs $600/kg"
    },
    is_published: true,
    created_at: "2024-01-05",
    image_url: ""
  },
  {
    id: "6",
    slug: "sushi-wasnt-raw-fish",
    title: "Sushi Wasn't Raw Fish",
    food: "Sushi",
    category: "Ancient Foods",
    emoji: "🐟",
    teaser: "The original sushi was fermented for months and the rice was thrown away — only the fish was eaten.",
    hook: `If you could time-travel to try the original sushi, you'd probably spit it out. The ancestor of modern sushi — called narezushi — was fish packed in rice and left to ferment for months, sometimes years. The rice was purely a preservation medium, generating lactic acid that kept the fish from spoiling. When it was time to eat, the rice was discarded. Only the tangy, pungent fish was consumed.\n\nThis process originated not in Japan, but in Southeast Asia, where rice paddy farmers needed ways to preserve their catch. The technique migrated to Japan around the 8th century and slowly evolved over a thousand years into what we recognize today.\n\nThe sushi you eat at a restaurant — fresh raw fish over seasoned rice, served within seconds of preparation — is a relatively recent invention, barely 200 years old. And it was created not by a chef, but by a fast food entrepreneur who wanted to serve busy workers in 19th-century Tokyo.`,
    body: `## Born from Fermentation\n\nThe earliest form of sushi was nothing like what you'd find in a modern sushi bar. Narezushi (熟れ鮨) originated in the rice paddies of Southeast Asia — likely the Mekong Delta region — sometime around the 4th century BCE. Rice farmers discovered that packing fresh fish in cooked rice triggered lactic acid fermentation, preserving the fish for months.\n\nThe concept was simple: anaerobic bacteria in the rice produced acids that prevented the fish from rotting. After weeks or months of fermentation, the rice had served its purpose and was scraped off and thrown away. Only the preserved fish was eaten, with a sharp, tangy flavor similar to cheese.\n\n## Japan's Slow Revolution\n\nThe technique arrived in Japan around the 8th century CE. For centuries, the Japanese made narezushi much like the original — especially around Lake Biwa, where funazushi (made with crucian carp) is still produced today and considered a delicacy, though most first-timers find its intense smell and sour taste challenging.\n\nThe first major innovation came in the 15th century: people started eating the rice along with the fish, shortening the fermentation time. This was called namanare — "raw" or "fresh" narezushi. It was a radical departure from tradition: the rice was no longer waste but part of the meal.\n\nBy the 17th century, rice vinegar became widely available in Japan. Someone realized you could skip fermentation entirely by simply adding vinegar to rice. This hayazushi ("fast sushi") was a shortcut that mimicked the tangy flavor of fermented rice without the months of waiting.\n\n## The Birth of Modern Sushi\n\nIn the 1820s, a food vendor named Hanaya Yohei had an idea that would change everything. Working in Edo (modern-day Tokyo), he began placing slices of fresh, raw fish on top of small mounds of vinegared rice and serving them immediately. No fermentation. No waiting. Customers could eat standing at his stall — the world's first sushi fast food.\n\nThis was nigirizushi (握り寿司) — hand-pressed sushi — and it was revolutionary. In a city full of busy workers who needed quick, portable food, Yohei's creation was an instant hit. By the mid-19th century, Edo had thousands of sushi stalls.\n\n## The American Transformation\n\nSushi arrived in the United States in the 1960s, first in Los Angeles. Early sushi bars catered primarily to Japanese businessmen. Most Americans found the concept of eating raw fish revolting.\n\nThe breakthrough came with the California Roll, invented in the 1960s or 70s (the exact origin is disputed). By placing the rice on the outside (uramaki) and using cooked crab and avocado instead of raw fish, it made sushi approachable for Americans. It was a Trojan horse: once people got comfortable with the format, they graduated to raw fish.\n\nThe American sushi boom of the 1980s and 90s transformed sushi from ethnic curiosity to mainstream cuisine. But it also created a version of sushi that purists barely recognize: rolls stuffed with cream cheese and deep-fried, topped with spicy mayo and crunch. The humble preservation technique from Southeast Asian rice paddies had become a canvas for American excess.\n\n## Full Circle\n\nToday there's a sushi renaissance focused on returning to fundamentals. Omakase restaurants in Tokyo and New York charge hundreds of dollars for the simplest possible sushi: a slice of impeccable fish, a small mound of warm rice, a brush of soy. One thousand years of evolution, and the highest form of sushi is also the simplest.`,
    timeline: [
      { year: "400 BCE", event: "Fish fermentation in rice begins in SE Asia" },
      { year: "700 CE", event: "Narezushi technique arrives in Japan" },
      { year: "1400s", event: "Japanese begin eating the rice with the fish" },
      { year: "1600s", event: "Rice vinegar shortcuts replace fermentation" },
      { year: "1820s", event: "Hanaya Yohei invents nigirizushi in Edo" },
      { year: "1923", event: "Great Kanto Earthquake disperses sushi chefs" },
      { year: "1960s", event: "First sushi bars open in Los Angeles" },
      { year: "1970s", event: "California Roll makes sushi accessible" },
      { year: "2000s", event: "Conveyor belt sushi goes global" }
    ],
    fast_facts: [
      "Original sushi fermented for months — rice was thrown away",
      "Modern sushi is only ~200 years old",
      "California Roll was invented in America",
      "Sushi rice contains sugar, salt, and vinegar",
      "Top sushi chefs train for 10+ years"
    ],
    world_spread: [
      { country: "Vietnam", year: "400 BCE", role: "origin", lat: 16.0, lng: 108.2 },
      { country: "Japan", year: "700 CE", role: "Adopted and evolved", lat: 35.7, lng: 139.7 },
      { country: "USA", year: "1960s", role: "California Roll revolution", lat: 34.1, lng: -118.2 },
      { country: "Brazil", year: "1980s", role: "Japanese diaspora", lat: -23.5, lng: -46.6 },
      { country: "UK", year: "1990s", role: "Yo! Sushi chain", lat: 51.5, lng: -0.1 },
      { country: "China", year: "2000s", role: "Massive market growth", lat: 31.2, lng: 121.5 }
    ],
    mermaid_mindmap: `mindmap
  root((🐟 Sushi))
    Fermentation Era
      SE Asia origin 400 BCE
      Rice as preservative
      Months of waiting
    Japanese Evolution
      Narezushi to nigirizushi
      Rice eaten with fish
      Vinegar shortcut
    Hanaya Yohei
      First fast food sushi
      1820s Edo stalls
      Standing service
    Global Spread
      California Roll gateway
      Conveyor belt sushi
      Omakase renaissance`,
    youtube_query: "history of sushi origin documentary",
    common_vs_exotic: {
      origin_country: "Japan",
      origin_use: "Minimalist nigirizushi: one slice of perfect fish on warm vinegared rice, eaten in one bite at the counter",
      western_use: "Giant rolls stuffed with cream cheese, deep-fried, drizzled with spicy mayo, eaten with a fork"
    },
    is_published: true,
    created_at: "2024-01-06",
    image_url: ""
  },
  {
    id: "7",
    slug: "bread-built-civilization",
    title: "Bread Built Civilization",
    food: "Bread",
    category: "Ancient Foods",
    emoji: "🍞",
    teaser: "Wheat didn't just feed humanity — it literally forced us to stop wandering and build cities.",
    hook: `Here's a claim that sounds absurd until you think about it: bread is the reason civilization exists. Not a byproduct of civilization. The cause of it.\n\nAround 10,000 BCE, humans in the Fertile Crescent began cultivating wild wheat. This single decision — to plant seeds and wait for them to grow — forced nomadic hunter-gatherers to stay in one place. Staying in one place led to permanent settlements. Settlements led to cities. Cities led to governments, armies, writing, taxes, and everything else we call "civilization."\n\nThe historian H.E. Jacob put it simply: "The history of bread is the history of humanity." He wasn't being poetic. Archaeological evidence shows that the transition from hunting to farming — driven primarily by grain cultivation — is the single most consequential event in human history. And bread was the product that made grain worth the trouble.`,
    body: `## Before Agriculture\n\nRecent archaeological discoveries have upended the traditional narrative. In 2018, researchers found charred bread remains at a Natufian site in Jordan dating to 14,400 years ago — roughly 4,000 years before the advent of agriculture. These early humans were making flatbread from wild cereals and plant roots, ground into flour and baked on hot stones.\n\nThis means bread didn't emerge from agriculture. It may have been the other way around: the desire for bread may have driven humans to begin farming. When you find something that delicious, you figure out how to make more of it.\n\n## The Neolithic Revolution\n\nThe domestication of wheat in the Fertile Crescent around 10,000 BCE was arguably the most important event in human history. Wild einkorn wheat was gradually bred for larger grains that stayed on the stalk (wild wheat naturally shatters, scattering seeds — terrible for harvesting).\n\nThis agricultural revolution came with enormous tradeoffs. Hunter-gatherers actually had more varied diets, better nutrition, more leisure time, and fewer diseases than early farmers. Farming was backbreaking work that produced a less nutritious diet and enabled the spread of infectious diseases through dense populations.\n\nSo why did humans do it? One theory: grain is uniquely suited to taxation. Unlike fruits or meat, grain can be measured, stored, transported, and controlled. Rulers could count it, tax it, and redistribute it. James C. Scott argues in "Against the Grain" that wheat essentially made the state possible.\n\n## Egypt: Bread and Power\n\nAncient Egypt was, in many ways, a civilization built on bread. The Egyptians discovered leavened bread around 3000 BCE — possibly by accident, when wild yeast colonized a batch of dough left in the sun. The result was lighter, fluffier bread that was vastly superior to the dense flatbreads eaten for millennia.\n\nBread was so central to Egyptian life that it served as currency. Workers who built the pyramids were paid in bread and beer (which is essentially liquid bread). The Egyptian word for bread was synonymous with life itself.\n\n## The Staff of Life\n\nBread has played a central role in virtually every major civilization since. Roman emperors maintained power through "bread and circuses" — free grain distributions to the urban poor. The French Revolution was triggered in part by bread shortages. "Let them eat cake" (whether or not Marie Antoinette actually said it) captures the explosive politics of bread.\n\nIn Christianity, bread became literally sacred — the body of Christ in the Eucharist. In Judaism, unleavened bread (matzah) commemorates the Exodus. Bread isn't just food; it's woven into the spiritual fabric of civilizations.\n\n## The Industrial Disruption\n\nThe 20th century brought the most dramatic changes in bread's 14,000-year history. The Chorleywood bread process, developed in 1961, used intensive mechanical mixing and chemical additives to produce a loaf of bread in under three hours — a process that traditionally took 12-18 hours.\n\nThis industrial bread was soft, cheap, and had a long shelf life. It was also, critics argued, barely bread at all. The artisan bread movement that followed was partly a reaction to this industrialization — a return to long fermentation, wild yeast, and simple ingredients.\n\n## Bread Today\n\nThe recent sourdough craze — amplified during COVID-19 lockdowns — represents something deeper than a food trend. It's humans reconnecting with the oldest prepared food in existence. When you mix flour and water and wait for wild yeast to colonize the dough, you're doing essentially what those Natufian bakers did 14,000 years ago.\n\nBread built civilization. And in times of crisis, we instinctively return to making it.`,
    timeline: [
      { year: "14400 BCE", event: "Oldest known bread found in Jordan" },
      { year: "10000 BCE", event: "Wheat domesticated in Fertile Crescent" },
      { year: "3000 BCE", event: "Egyptians discover leavened bread" },
      { year: "168 BCE", event: "First professional bakeries in Rome" },
      { year: "1789", event: "Bread shortages fuel French Revolution" },
      { year: "1928", event: "Sliced bread invented by Otto Rohwedder" },
      { year: "1961", event: "Chorleywood process — industrial bread" },
      { year: "2020", event: "COVID-19 sourdough renaissance" }
    ],
    fast_facts: [
      "14,400 years — oldest prepared food",
      "Pyramid builders were paid in bread",
      "French Revolution sparked by bread shortages",
      "Sliced bread invented in 1928",
      "Americans eat 3 billion+ loaves per year"
    ],
    world_spread: [
      { country: "Jordan", year: "14400 BCE", role: "origin", lat: 31.9, lng: 35.9 },
      { country: "Egypt", year: "3000 BCE", role: "Leavened bread", lat: 26.8, lng: 30.8 },
      { country: "Italy", year: "168 BCE", role: "Roman bakeries", lat: 41.9, lng: 12.5 },
      { country: "France", year: "1700s", role: "Baguette culture", lat: 48.9, lng: 2.3 },
      { country: "USA", year: "1928", role: "Sliced bread", lat: 39.8, lng: -98.6 },
      { country: "UK", year: "1961", role: "Industrial bread", lat: 51.5, lng: -0.1 }
    ],
    mermaid_mindmap: `mindmap
  root((🍞 Bread))
    Prehistory
      14400 BCE Jordan
      Wild cereal flour
      Predates agriculture
    Agricultural Revolution
      Wheat domestication
      Permanent settlements
      Enabled taxation
    Sacred Status
      Egyptian currency
      Christian Eucharist
      Jewish matzah
    Modern Era
      Industrial process 1961
      Artisan revival
      COVID sourdough`,
    youtube_query: "history of bread civilization documentary",
    common_vs_exotic: {
      origin_country: "Fertile Crescent",
      origin_use: "Flatbread baked on hot stones from wild cereals, the foundation of early civilization",
      western_use: "Pre-sliced, preservative-laden sandwich bread in a plastic bag with a 2-week shelf life"
    },
    is_published: true,
    created_at: "2024-01-07",
    image_url: ""
  },
  {
    id: "8",
    slug: "salt-was-more-valuable-than-gold",
    title: "Salt Was Once More Valuable Than Gold",
    food: "Salt",
    category: "Spices",
    emoji: "🧂",
    teaser: "Roman soldiers were paid in salt — that's literally where the word 'salary' comes from.",
    hook: `Open your kitchen cupboard and you'll find a substance that once toppled empires, funded wars, and was worth its weight in gold. Salt — the most common seasoning in the world, available for pennies — was for most of human history one of the most precious commodities on Earth.\n\nThe word "salary" comes from the Latin "salarium," widely believed to refer to the salt rations given to Roman soldiers. "Not worth his salt" meant a soldier wasn't earning his pay. In medieval Africa, salt was traded ounce for ounce with gold. In ancient China, the salt tax funded the Great Wall.\n\nHow did something so abundant become so valuable? The answer reveals one of the most important and overlooked forces in human history: the desperate need to preserve food before refrigeration.`,
    body: `## The Preservation Imperative\n\nBefore refrigeration, preserving food was a matter of life and death. In northern climates, the period between harvests could be six months or more. Without preservation, communities faced starvation every winter. Salt was the most reliable method of food preservation for thousands of years.\n\nSalt works by drawing moisture out of food through osmosis, creating an environment too hostile for the bacteria that cause decay. Salted fish could last years. Salted meat could survive long sea voyages. Salt made civilization beyond the tropics possible.\n\n## Ancient Salt Empires\n\nThe earliest known salt works date to approximately 6050 BCE in Romania, where Neolithic people boiled salt-rich spring water to produce salt crystals. By the Bronze Age, salt had become a major trade commodity.\n\nAncient Egypt used salt (natron) for mummification — preserving the dead just as it preserved food for the living. In China, the first recorded salt tax was implemented around 2200 BCE. The Chinese salt monopoly became one of the most lucrative government enterprises in history, funding armies and infrastructure for centuries.\n\n## The Salt Roads\n\nSalt was so valuable it shaped geography itself. Many of the world's oldest roads were built to transport salt. The Via Salaria (Salt Road) in Italy connected Rome to the Adriatic salt flats. In Africa, trans-Saharan trade routes carried salt south from the Saharan salt mines to sub-Saharan kingdoms.\n\nThe city of Timbuktu rose to prominence largely as a salt trading hub. Slabs of Saharan salt, cut from ancient lake beds, were carried by camel caravan across hundreds of miles of desert. In the salt-scarce regions south of the Sahara, these slabs were literally worth their weight in gold.\n\n## Salt and Revolution\n\nSalt taxes have been among the most hated and most rebellion-provoking levies in history. France's gabelle — a notoriously unfair salt tax — was one of the grievances that fueled the French Revolution. The tax varied wildly by region, creating a massive black market and endemic smuggling.\n\nIn India, the British salt tax became a symbol of colonial oppression. In 1930, Mahatma Gandhi led the Salt March — a 240-mile walk to the sea to make salt illegally. This act of civil disobedience galvanized Indian independence movement. Gandhi understood what every empire had known: controlling salt means controlling people.\n\n## The Modern Paradox\n\nThe invention of mechanical refrigeration in the 19th century destroyed salt's monopoly on food preservation virtually overnight. The commodity that had funded empires and caused wars became cheap and abundant.\n\nToday, the average American consumes about 3,400 mg of sodium per day — well above the recommended 2,300 mg. We went from salt scarcity to salt excess in barely a century. The substance that was once too precious to waste is now something doctors tell us to avoid.\n\nThe irony is complete: salt went from being so valuable that it served as money to so cheap that we put it on restaurant tables for free. But its fingerprints are everywhere — in our language, our roads, our history. Every time you say "salary," "salad," or "soldier," you're invoking the substance that built the ancient world.`,
    timeline: [
      { year: "6050 BCE", event: "Earliest known salt works in Romania" },
      { year: "2200 BCE", event: "First salt tax in China" },
      { year: "500 BCE", event: "Salt roads built across the Roman Empire" },
      { year: "300 BCE", event: "Roman soldiers receive salt rations (salary)" },
      { year: "1200 CE", event: "Timbuktu rises as salt trading hub" },
      { year: "1286", event: "French gabelle salt tax established" },
      { year: "1930", event: "Gandhi's Salt March in India" },
      { year: "1850s", event: "Mechanical refrigeration reduces salt's dominance" }
    ],
    fast_facts: [
      "'Salary' literally comes from salt",
      "Traded ounce-for-ounce with gold in medieval Africa",
      "Chinese salt tax funded the Great Wall",
      "Gandhi's Salt March helped end British rule",
      "Average American eats 48% more than recommended"
    ],
    world_spread: [
      { country: "Romania", year: "6050 BCE", role: "origin", lat: 45.9, lng: 24.9 },
      { country: "China", year: "2200 BCE", role: "Salt tax & monopoly", lat: 35.9, lng: 104.2 },
      { country: "Italy", year: "500 BCE", role: "Via Salaria", lat: 41.9, lng: 12.5 },
      { country: "Mali", year: "1200 CE", role: "Trans-Saharan trade", lat: 16.8, lng: -3.0 },
      { country: "France", year: "1286", role: "Gabelle tax", lat: 48.9, lng: 2.3 },
      { country: "India", year: "1930", role: "Gandhi's Salt March", lat: 21.2, lng: 72.8 }
    ],
    mermaid_mindmap: `mindmap
  root((🧂 Salt))
    Preservation
      Food survival
      Mummification
      Enabled civilization
    Economics
      Currency in Rome
      Gold-equivalent trade
      Funded Great Wall
    Revolution
      French gabelle
      Gandhi Salt March
      Colonial resistance
    Language
      Salary from sal
      Salad from sal
      Soldier origins`,
    youtube_query: "history of salt documentary",
    common_vs_exotic: {
      origin_country: "Global",
      origin_use: "A precious commodity worth its weight in gold, used as currency and traded along dedicated roads",
      western_use: "Free on every restaurant table, so cheap we're told to eat less of it"
    },
    is_published: true,
    created_at: "2024-01-08",
    image_url: ""
  },
  {
    id: "9",
    slug: "avocados-almost-went-extinct",
    title: "Avocados Almost Went Extinct",
    food: "Avocado",
    category: "Common Foods",
    emoji: "🥑",
    teaser: "The giant sloths that spread avocado seeds went extinct 13,000 years ago — the fruit should have followed.",
    hook: `The avocado shouldn't exist. At least, not anymore. For millions of years, avocados co-evolved with giant ground sloths and other megafauna — massive animals that could swallow the large seed whole and deposit it miles away in their dung. When these megafauna went extinct roughly 13,000 years ago, the avocado lost its only method of seed dispersal.\n\nThe seed is too large for any surviving animal to eat and spread effectively. Birds can't swallow it. Small mammals can't carry it far enough. By all rights, the avocado should have gone the way of the giant sloth — slowly disappearing as trees died without their seeds being carried to new ground.\n\nBut humans arrived just in time. Indigenous peoples in Central America began cultivating avocados around 5,000 years ago, unknowingly rescuing a fruit that evolution had essentially abandoned.`,
    body: `## The Megafauna Connection\n\nThe avocado is what evolutionary biologists call an "evolutionary anachronism" — a species that still bears features adapted for ecological partners that no longer exist. The large, fatty fruit with its enormous seed makes perfect sense in a world of 13-foot-tall ground sloths and car-sized armadillos called glyptodonts.\n\nThese megafauna would eat the whole fruit, seed and all, then walk miles before depositing the seed in a pile of nutrient-rich dung — the perfect planting conditions. The avocado's large seed size, which seems like a design flaw today, was actually a feature: it contained enough nutrients for the seedling to establish itself in the shade of dense tropical forest.\n\n## Saved by Humans\n\nWhen megafauna disappeared in the late Pleistocene, most large-seeded fruits disappeared with them. The avocado survived partly because its seeds can still germinate where they fall (though poorly) and partly because humans intervened.\n\nArchaeological evidence shows that humans in the Tehuacan Valley of Mexico were eating avocados by at least 10,000 BCE. By 5,000 years ago, they had begun actively cultivating them. The Aztecs called the avocado "ahuacatl" — meaning "testicle," both for its shape and its reputation as an aphrodisiac.\n\n## The American Journey\n\nAvocados were largely unknown outside Latin America until the 20th century. In the 1920s and 30s, California farmers began growing Fuerte avocados commercially. But the industry struggled with a problem: Americans wouldn't eat them.\n\nThe California Avocado Growers' Exchange tried everything. They ran newspaper ads explaining how to eat this strange green fruit. They suggested serving it in salads, sandwiches, and even as dessert with sugar and lemon. Progress was slow.\n\n## The Hass Revolution\n\nIn 1926, a mail carrier named Rudolph Hass bought avocado seedlings in La Habra Heights, California. One of them produced a fruit that was smaller and darker than the Fuerte, with a pebbly skin that turned nearly black when ripe. Hass initially wanted to cut it down, but his children loved the fruit's rich, nutty flavor.\n\nHass patented the tree in 1935 — the first patent ever issued for a tree in the United States. Every Hass avocado in the world (which is now 80% of all avocados sold) descends from that single mother tree, which stood until it died of root rot in 2002.\n\n## The Guacamole Industrial Complex\n\nThe avocado's modern explosion began in 1994, when NAFTA eliminated import barriers and Mexican avocados flooded the US market. Then the California Avocado Commission made a brilliant marketing move: they repositioned guacamole as a Super Bowl party essential.\n\nIt worked beyond anyone's imagination. Americans now consume over 8 billion pounds of avocados per year. The Super Bowl alone drives 139 million pounds of avocado consumption. The fruit that evolution abandoned became a $14 billion global industry.\n\nBut the boom has a dark side. In Mexico's Michoacán state — which produces most of the world's avocados — drug cartels have seized control of the industry, burning orchards of uncooperative farmers and imposing "taxes" on exports. Environmental devastation follows: illegal deforestation to plant avocado orchards destroys pine forests and threatens the monarch butterfly migration.\n\nThe avocado's journey from evolutionary dead end to Instagram brunch staple is one of the strangest survival stories in the natural world. A fruit designed for animals that no longer exist, rescued by one species that can't stop eating it.`,
    timeline: [
      { year: "13000 BCE", event: "Megafauna go extinct — avocado loses seed dispersers" },
      { year: "10000 BCE", event: "Humans in Mexico begin eating wild avocados" },
      { year: "5000 BCE", event: "Avocado cultivation begins in Central America" },
      { year: "1500s", event: "Spanish encounter avocados in the Americas" },
      { year: "1833", event: "First avocado tree planted in Florida" },
      { year: "1926", event: "Rudolph Hass grows the first Hass avocado" },
      { year: "1994", event: "NAFTA opens US market to Mexican avocados" },
      { year: "2024", event: "8 billion pounds consumed annually in US" }
    ],
    fast_facts: [
      "Evolved for giant sloths extinct 13,000 years ago",
      "All Hass avocados descend from one tree",
      "8 billion pounds consumed in the US per year",
      "$14 billion global industry",
      "139 million pounds eaten during the Super Bowl"
    ],
    world_spread: [
      { country: "Mexico", year: "10000 BCE", role: "origin", lat: 19.4, lng: -99.1 },
      { country: "Peru", year: "3000 BCE", role: "Ancient cultivation", lat: -9.2, lng: -75.0 },
      { country: "Spain", year: "1601", role: "Spanish import", lat: 40.4, lng: -3.7 },
      { country: "USA", year: "1833", role: "Florida cultivation", lat: 34.1, lng: -118.2 },
      { country: "Israel", year: "1908", role: "Major producer", lat: 31.0, lng: 34.9 },
      { country: "Australia", year: "1990s", role: "Avocado toast culture", lat: -25.3, lng: 133.8 }
    ],
    mermaid_mindmap: `mindmap
  root((🥑 Avocado))
    Evolution
      Megafauna dispersal
      Giant sloth partnership
      Evolutionary anachronism
    Rescue
      Human cultivation 5000 BCE
      Aztec ahuacatl
      Spanish discovery
    Hass Revolution
      Mail carrier's tree 1926
      First tree patent
      80% of global market
    Modern Era
      NAFTA boom
      Super Bowl marketing
      Cartel involvement`,
    youtube_query: "avocado history megafauna documentary",
    common_vs_exotic: {
      origin_country: "Mexico",
      origin_use: "Dozens of varieties used in salsas, soups, and sauces — the Aztecs considered it an aphrodisiac",
      western_use: "Smashed on toast at a $16 brunch, photographed for Instagram, blamed for millennials not buying houses"
    },
    is_published: true,
    created_at: "2024-01-09",
    image_url: ""
  },
  {
    id: "10",
    slug: "tea-caused-two-wars",
    title: "Tea Caused Two Wars",
    food: "Tea",
    category: "Drinks",
    emoji: "🍵",
    teaser: "One leaf triggered the Opium War and the Boston Tea Party — reshaping two empires forever.",
    hook: `A single dried leaf from a Chinese shrub reshaped the geopolitical order of the modern world. Tea didn't just cause one war — it caused two of the most consequential conflicts in modern history: the Boston Tea Party (which led to the American Revolution) and the Opium Wars (which led to the collapse of Imperial China).\n\nBoth wars had the same root cause: Britain was addicted to tea and hemorrhaging silver to China to buy it. The lengths Britain went to in order to solve this trade imbalance — taxing American colonists, flooding China with opium — changed the course of history for billions of people.\n\nAll because the British couldn't stop drinking tea.`,
    body: `## The Chinese Monopoly\n\nTea originated in Yunnan province, China, where the tea plant (*Camellia sinensis*) grew wild. According to legend, Emperor Shen Nung discovered tea in 2737 BCE when leaves blew into his pot of boiling water. While the date is mythical, archaeological evidence confirms tea drinking in China at least 2,100 years ago.\n\nFor centuries, China held an absolute monopoly on tea production. The plant's cultivation, processing, and preparation were closely guarded secrets. Chinese tea culture developed into one of the world's most sophisticated culinary traditions, with thousands of varieties and elaborate preparation ceremonies.\n\n## Britain's Obsession\n\nTea arrived in Britain in the mid-17th century and quickly became a national obsession. By the 18th century, tea had transformed from an aristocratic novelty into a daily necessity for all social classes. The British consumed more tea per capita than any other nation — a distinction they still hold.\n\nBut there was a massive economic problem: China wanted only silver in exchange for tea, and China wasn't interested in buying much from Britain. The resulting trade deficit was enormous. Silver was flowing out of Britain at an alarming rate.\n\n## The American Revolution Connection\n\nBritain's solution for the American colonies was straightforward: tax the tea. The Tea Act of 1773 wasn't actually a new tax — it was a scheme to help the struggling East India Company by giving it a monopoly on tea sales in the colonies, while maintaining an existing tax.\n\nAmerican colonists saw through it. On December 16, 1773, members of the Sons of Liberty dumped 342 chests of East India Company tea into Boston Harbor. The tea destroyed that night was worth approximately $1.7 million in today's money.\n\nThe Boston Tea Party wasn't primarily about tea — it was about taxation without representation. But tea was the medium through which the conflict played out. Britain's response was the Intolerable Acts, which pushed the colonies toward revolution.\n\n## The Opium Solution\n\nBritain's solution for China was far darker. The East India Company began growing opium in India and smuggling it into China, creating millions of addicts and reversing the trade deficit. By the 1830s, China had gone from a silver-surplus nation to one hemorrhaging wealth to buy opium.\n\nWhen Chinese authorities tried to stop the opium trade by seizing and destroying foreign opium stockpiles in 1839, Britain declared war. The First Opium War (1839-1842) was a devastating defeat for China, resulting in the Treaty of Nanking — which ceded Hong Kong to Britain and forced China to open five ports to foreign trade.\n\nThe Second Opium War (1856-1860) was even more destructive. British and French forces sacked Beijing and burned the Old Summer Palace — one of the great cultural crimes of the 19th century. These conflicts began China's "Century of Humiliation" that profoundly shapes Chinese politics to this day.\n\n## The Great Tea Theft\n\nMeanwhile, Britain was executing one of history's greatest acts of industrial espionage. In the 1840s, the East India Company sent Scottish botanist Robert Fortune into China's interior — disguised as a Chinese merchant — to steal tea plants, seeds, and manufacturing secrets.\n\nFortune succeeded spectacularly, smuggling out thousands of tea seedlings and recruiting Chinese tea experts to teach cultivation techniques. These stolen plants were shipped to British India, where they were used to establish tea plantations in Darjeeling and Assam. Within decades, India surpassed China as the world's largest tea producer.\n\nThe theft of tea from China to India is arguably the most consequential act of botanical espionage in history. It broke China's millennium-long monopoly and reshaped the global economy.\n\n## Tea Today\n\nTea is now the most consumed beverage on Earth after water. Over 3 billion cups are drunk daily worldwide. But the geopolitical scars remain. China's Century of Humiliation is directly taught in Chinese schools as context for modern Chinese nationalism. American identity was partly forged in opposition to British tea taxation. The tea plantations of India and Sri Lanka still grapple with the colonial labor systems that built them.\n\nAll from a dried leaf in hot water.`,
    timeline: [
      { year: "2737 BCE", event: "Legendary discovery by Emperor Shen Nung" },
      { year: "200 BCE", event: "Earliest archaeological evidence of tea drinking" },
      { year: "1610", event: "Tea reaches Europe via Dutch traders" },
      { year: "1660s", event: "Tea becomes fashionable in British court" },
      { year: "1773", event: "Boston Tea Party — 342 chests dumped" },
      { year: "1839", event: "First Opium War begins" },
      { year: "1848", event: "Robert Fortune steals tea from China" },
      { year: "1860s", event: "Indian tea plantations surpass China" },
      { year: "2024", event: "3 billion cups consumed daily worldwide" }
    ],
    fast_facts: [
      "3 billion cups consumed daily worldwide",
      "Most consumed beverage after water",
      "Caused both the American Revolution and Opium Wars",
      "$200 billion global industry",
      "Stolen from China by British spy Robert Fortune"
    ],
    world_spread: [
      { country: "China", year: "2737 BCE", role: "origin", lat: 25.0, lng: 102.7 },
      { country: "Japan", year: "800 CE", role: "Buddhist monks", lat: 35.7, lng: 139.7 },
      { country: "Netherlands", year: "1610", role: "First European import", lat: 52.4, lng: 4.9 },
      { country: "UK", year: "1660s", role: "National obsession", lat: 51.5, lng: -0.1 },
      { country: "USA", year: "1773", role: "Boston Tea Party", lat: 42.4, lng: -71.1 },
      { country: "India", year: "1850s", role: "Stolen tea plantations", lat: 26.9, lng: 88.3 },
      { country: "Kenya", year: "1903", role: "Colonial plantations", lat: -0.2, lng: 37.9 }
    ],
    mermaid_mindmap: `mindmap
  root((🍵 Tea))
    Chinese Origins
      Yunnan province
      2000+ years
      Monopoly control
    British Obsession
      National drink
      Silver drain
      Trade deficit crisis
    Two Wars
      Boston Tea Party 1773
      American Revolution
      Opium Wars 1839-1860
    Great Theft
      Robert Fortune spy
      Seeds to India
      Broke Chinese monopoly`,
    youtube_query: "history of tea opium war documentary",
    common_vs_exotic: {
      origin_country: "China",
      origin_use: "Thousands of varieties, elaborate gongfu ceremony, aged pu-erh traded like wine",
      western_use: "A tea bag dunked in a mug for 2 minutes, often with milk and sugar — the British Empire's legacy"
    },
    is_published: true,
    created_at: "2024-01-10",
    image_url: ""
  }
];

export const categories = ["All", "Common Foods", "Exotic Foods", "Spices", "Drinks", "Ancient Foods"];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, count = 3): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return articles.slice(0, count);
  const sameCategory = articles.filter(a => a.slug !== currentSlug && a.category === current.category);
  const others = articles.filter(a => a.slug !== currentSlug && a.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}