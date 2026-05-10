const mongoose = require("mongoose");
const Product = require("../models/product");
require("dotenv").config();

const products = [
  {
    name: "Ashwagandha Capsules",
    price: 299,
    image: [ "/images/punarnava.jpg"],
    description: "Boosts immunity and reduces stress",
    category: "ayurvedic",
    stock: 10
  },
  {
    name: "Triphala Powder",
    price: 199,
    image: [  "/images/punarnava.jpg"],
    description: "Improves digestion naturally",
    category: "ayurvedic",
    stock: 15
  },

  {
    name: "Amla Juice",
    price: 180,
    image: ["/images/AmlaJuice.jpg"],
    description: "Rich in Vitamin C, helps boost immunity and improves digestion.",
    category: "juice",
    stock: 10
  },
  {
    name: "Brahmi Powder",
    price: 220,
    image: ["/images/brahmi.jpg"],
    description: "Enhances memory and reduces stress naturally.",
    category: "herbal",
    stock: 15
  },
  {
    name: "DiabNourish Juice",
    price: 250,
    image: ["/images/diabnourishjuice.jpg"],
    description: "Supports overall body nourishment and vitality.",
    category: "juice",
    stock: 15
  },
  {
    name: "Himalaya Ashwagandha",
    price: 320,
    image: ["/images/Himalaya_Ashwagandha.jpg"],
    description: "Helps reduce anxiety and improves strength and stamina.",
    category: "tablet",
    stock: 30
  },
  {
    name: "Jamun Neem Karela Juice",
    price: 210,
    image: ["/images/JamunNeemKarelaJuice.jpg"],
    description: "Supports blood sugar control and detoxification.",
    category: "juice",
    stock: 15
  },
  {
    name: "Jamun Seed Powder",
    price: 190,
    image: ["/images/jamunSeeds.jpg"],
    description: "Helps regulate blood sugar levels naturally.",
    category: "powder",
    stock: 10
  },
  {
    name: "Karela Jamun Juice",
    price: 200,
    image: ["/images/karelajamunJuice.jpg"],
    description: "Improves digestion and supports diabetes management.",
    category: "juice",
    stock: 15
  },
  {
    name: "General Herbal Medicine",
    price: 150,
    image: ["/images/medicine.jpg"],
    description: "Natural remedy for common health issues.",
    category: "herbal",
    stock: 15
  },
  {
    name: "Moringa Powder",
    price: 275,
    image: ["/images/moringa.jpg"],
    description: "Rich in nutrients and boosts energy levels.",
    category: "powder",
    stock: 10
  },
  {
    name: "Neem Tablets",
    price: 180,
    image: ["/images/neemtablets.jpg"],
    description: "Purifies blood and improves skin health.",
    category: "tablet",
    stock: 15
  },
  {
    name: "Organic Herbal Medicine",
    price: 260,
    image: ["/images/organicmedicine.jpg"],
    description: "100% natural organic supplement for daily health.",
    category: "herbal",
    stock: 20
  },
  {
    name: "Punarnava Powder",
    price: 230,
    image: ["/images/punarnava.jpg"],
    description: "Supports kidney function and reduces swelling.",
    category: "powder",
    stock: 15
  },
  {
    name: "Rice Mix Powder",
    price: 140,
    image: ["/images/ricemixpowder.jpg"],
    description: "Healthy mix powder for easy digestion meals.",
    category: "food",
    stock: 20
  },
  {
    name: "Herbal Soup Powder",
    price: 160,
    image: ["/images/soupPowder.jpg"],
    description: "Instant healthy soup mix enriched with herbs.",
    category: "food",
    stock: 5
  },
  {
    name: "Sugar Control Juice",
    price: 240,
    image: ["/images/SugarControlJuice.jpg"],
    description: "Helps maintain healthy blood sugar levels.",
    category: "juice",
    stock: 15
  },
  {
    name: "Turmeric Formula",
    price: 300,
    image: ["/images/TurmericFormula.jpg"],
    description: "Anti-inflammatory supplement for immunity.",
    category: "tablet",
    stock: 15
  },
  {
    name: "Turmeric Tablets",
    price: 220,
    image: ["/images/turmerictablets.jpg"],
    description: "Supports joint health and boosts immunity.",
    category: "tablet",
    stock: 30
  },
  {
    name: "Zandu Balm",
    price: 120,
    image: ["/images/zandubalm.jpg"],
    description: "Provides quick relief from headache and cold.",
    category: "ointment",
    stock: 15
  },
  {
    name: "Ayurvedic Liver Tonic",
    price: 260,
    image: ["/images/ricemixpowder.jpg"],
    description: "Supports liver detox and improves digestion.",
    category: "tonic",
    stock: 15
  },
  {
    name: "Herbal Immunity Booster",
    price: 280,
    image: ["/images/HIMALAYAGUMMIES1.jpg"],
    description: "Strengthens immune system naturally.",
    category: "herbal",
    stock: 3
  },
  {
    name: "Herbal Immunity Booster",
    price: 280,
    image: ["/images/RASAYANAM1.jpg"],
    description: "Strengthens immune system naturally.",
    category: "herbal",
    stock: 15
  }



];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany(); // optional reset
    await Product.insertMany(products);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.log("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();