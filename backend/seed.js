const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Card = require("./models/Card");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Sample business listings data
const sampleBusinesses = [
    {
        title: "Olive & Sage Café",
        subtitle: "Vegan Bistro",
        description: "A cozy vegan bistro offering fresh, plant-based Mediterranean cuisine. We specialize in organic ingredients, homemade pastries, and artisanal coffee. Our menu features seasonal dishes inspired by local flavors, with options for breakfast, lunch, and dinner. Perfect for health-conscious diners and anyone looking to explore delicious vegan cuisine.",
        phone: "052-123-4567",
        image: {
            url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            alt: "Olive & Sage Café interior with plants and modern design"
        },
        address: {
            country: "Israel",
            city: "Tel Aviv",
            street: "Dizengoff Street",
            houseNumber: 42,
            zip: 64332
        }
    },
    {
        title: "Spark Cleaners",
        subtitle: "Professional Home Cleaning",
        description: "Professional cleaning services for homes and offices throughout the Tel Aviv area. We offer regular maintenance cleaning, deep cleaning, move-in/move-out services, and post-construction cleanup. Our team uses eco-friendly products and modern equipment to ensure your space sparkles. Licensed, insured, and fully bonded.",
        phone: "052-234-5678",
        image: {
            url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
            alt: "Professional cleaning service with cleaning supplies"
        },
        address: {
            country: "Israel",
            city: "Ramat Gan",
            street: "Bialik Street",
            houseNumber: 15,
            zip: 52521
        }
    },
    {
        title: "TechFix Solutions",
        subtitle: "Computer & Phone Repair",
        description: "Expert repair services for computers, smartphones, tablets, and other electronic devices. We fix screen replacements, battery issues, water damage, software problems, and more. Fast turnaround times, warranty on all repairs, and competitive pricing. Walk-ins welcome, or schedule an appointment for convenience.",
        phone: "052-345-6789",
        image: {
            url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
            alt: "Computer and phone repair shop with tools"
        },
        address: {
            country: "Israel",
            city: "Jerusalem",
            street: "Jaffa Road",
            houseNumber: 88,
            zip: 91000
        }
    },
    {
        title: "Green Thumb Landscaping",
        subtitle: "Garden Design & Maintenance",
        description: "Transform your outdoor space with our professional landscaping services. We design and install beautiful gardens, maintain lawns, plant trees and shrubs, install irrigation systems, and provide seasonal care. Whether you have a small balcony or a large yard, we create stunning, sustainable landscapes that thrive in the Israeli climate.",
        phone: "052-456-7890",
        image: {
            url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
            alt: "Beautiful landscaped garden with plants and flowers"
        },
        address: {
            country: "Israel",
            city: "Herzliya",
            street: "Rothschild Boulevard",
            houseNumber: 12,
            zip: 46851
        }
    },
    {
        title: "FitZone Gym",
        subtitle: "24/7 Fitness Center",
        description: "State-of-the-art fitness center open 24/7 for your convenience. We offer modern equipment, personal training, group fitness classes including yoga, pilates, and spinning, plus a sauna and locker rooms. Flexible membership options to fit your schedule and budget. Join our community of fitness enthusiasts today!",
        phone: "052-567-8901",
        image: {
            url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
            alt: "Modern gym with exercise equipment"
        },
        address: {
            country: "Israel",
            city: "Haifa",
            street: "Herzl Street",
            houseNumber: 25,
            zip: 31000
        }
    },
    {
        title: "Bella's Bakery",
        subtitle: "Artisan Breads & Pastries",
        description: "Fresh-baked bread, pastries, and cakes made daily using traditional methods and premium ingredients. Our selection includes sourdough breads, croissants, cookies, custom cakes for special occasions, and seasonal treats. We also offer gluten-free options. Visit us for your morning coffee and pastry, or order ahead for special events.",
        phone: "052-678-9012",
        image: {
            url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800",
            alt: "Fresh baked bread and pastries on display"
        },
        address: {
            country: "Israel",
            city: "Tel Aviv",
            street: "Rothschild Boulevard",
            houseNumber: 55,
            zip: 65783
        }
    },
    {
        title: "Cozy Home Interiors",
        subtitle: "Furniture & Home Decor",
        description: "Curated selection of modern and vintage furniture, home accessories, and decor items. We help you create beautiful, functional living spaces with pieces that reflect your personal style. From sofas and dining sets to lighting and artwork, we offer design consultation and delivery services. Visit our showroom or shop online.",
        phone: "052-789-0123",
        image: {
            url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
            alt: "Modern living room interior design"
        },
        address: {
            country: "Israel",
            city: "Ramat Gan",
            street: "Jabotinsky Street",
            houseNumber: 30,
            zip: 52511
        }
    },
    {
        title: "PetCare Veterinary Clinic",
        subtitle: "Animal Health Services",
        description: "Full-service veterinary clinic providing comprehensive care for dogs, cats, and small animals. Services include routine checkups, vaccinations, surgery, dental care, emergency services, and boarding. Our experienced veterinarians are dedicated to keeping your pets healthy and happy. We also offer grooming services and pet supplies.",
        phone: "052-890-1234",
        image: {
            url: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
            alt: "Veterinary clinic with friendly staff and pets"
        },
        address: {
            country: "Israel",
            city: "Jerusalem",
            street: "King George Street",
            houseNumber: 18,
            zip: 91000
        }
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing data (optional - comment out if you want to keep existing data)
        await Card.deleteMany({});
        console.log("🗑️  Cleared existing business listings");

        // Create a sample business user if it doesn't exist
        let businessUser = await User.findOne({ email: "business@example.com" });

        if (!businessUser) {
            const hashedPassword = await bcrypt.hash("business123", 10);
            businessUser = new User({
                firstName: "David",
                lastName: "Cohen",
                email: "business@example.com",
                password: hashedPassword,
                phone: "052-111-2222",
                isBusiness: true,
                address: {
                    country: "Israel",
                    city: "Tel Aviv",
                    street: "Ben Yehuda Street",
                    houseNumber: 10,
                    zip: 63801
                }
            });
            await businessUser.save();
            console.log("👤 Created sample business user (email: business@example.com, password: business123)");
        } else {
            console.log("👤 Using existing business user");
        }

        // Create business listings
        const createdCards = [];
        for (const business of sampleBusinesses) {
            const card = new Card({
                ...business,
                createdBy: businessUser._id
            });
            await card.save();
            createdCards.push(card);
        }

        console.log(`✅ Created ${createdCards.length} sample business listings`);
        console.log("\n📋 Sample businesses created:");
        createdCards.forEach((card, index) => {
            console.log(`   ${index + 1}. ${card.title} - ${card.subtitle}`);
        });

        console.log("\n🎉 Database seeded successfully!");
        console.log("\n💡 You can now:");
        console.log("   - View businesses at http://localhost:3001/cards");
        console.log("   - Login as business user: business@example.com / business123");
        console.log("   - Create more businesses or register new users");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();

