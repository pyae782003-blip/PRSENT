// Seed script for Myanmar Traditional Handmade Present Shop
// Run: npm run prisma:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ─── Create Admin User ───
    const adminPassword = await bcrypt.hash('password', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mm.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@mm.com',
            password: adminPassword,
            role: 'admin',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // ─── Create Sample User ───
    const userPassword = await bcrypt.hash('password', 10);
    const user = await prisma.user.upsert({
        where: { email: 'user@mm.com' },
        update: {},
        create: {
            name: 'Aung Aung',
            email: 'user@mm.com',
            password: userPassword,
            role: 'user',
        },
    });
    console.log('✅ Sample user created:', user.email);

    // ─── Create Categories ───
    const categoryData = [
        { name: 'Lacquerware', description: 'Traditional Bagan lacquerware — bowls, trays, and ornamental pieces' },
        { name: 'Textiles', description: 'Hand-woven fabrics, longyi, and Shan shoulder bags' },
        { name: 'Jewelry', description: 'Ruby, jade, and gold jewelry from Myanmar mines' },
        { name: 'Wood Crafts', description: 'Teak wood carvings and handmade wooden souvenirs' },
        { name: 'Pottery', description: 'Handmade clay pots, vases, and decorative ceramics' },
        { name: 'Paintings', description: 'Traditional Myanmar art and contemporary paintings' },
    ];

    const categories = [];
    for (const cat of categoryData) {
        const c = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        categories.push(c);
    }
    console.log('✅ Categories created:', categories.length);

    // ─── Create Products ───
    const productData = [
        {
            name: 'Golden Lacquer Bowl',
            description: 'Handcrafted lacquerware bowl from Bagan with intricate gold leaf patterns. Made using traditional techniques passed down through generations.',
            price: 45000,
            stock: 15,
            categoryName: 'Lacquerware',
        },
        {
            name: 'Shan Shoulder Bag',
            description: 'Hand-woven shoulder bag from Shan State with traditional geometric patterns. Perfect for everyday use.',
            price: 25000,
            stock: 30,
            categoryName: 'Textiles',
        },
        {
            name: 'Jade Pendant Necklace',
            description: 'Premium Myanmar jade pendant on sterling silver chain. Each stone is naturally unique.',
            price: 120000,
            stock: 8,
            categoryName: 'Jewelry',
        },
        {
            name: 'Teak Elephant Carving',
            description: 'Hand-carved teak wood elephant figurine. A symbol of strength and wisdom in Myanmar culture.',
            price: 35000,
            stock: 20,
            categoryName: 'Wood Crafts',
        },
        {
            name: 'Red Lacquer Tray Set',
            description: 'Set of 3 nesting trays with traditional red and black lacquer finish from Bagan workshops.',
            price: 68000,
            stock: 10,
            categoryName: 'Lacquerware',
        },
        {
            name: 'Mandalay Silk Longyi',
            description: 'Premium silk longyi handwoven in Mandalay. Features traditional Luntaya acheik pattern.',
            price: 85000,
            stock: 12,
            categoryName: 'Textiles',
        },
        {
            name: 'Ruby Stud Earrings',
            description: 'Natural Mogok ruby stud earrings in 18k gold setting. Certified authentic Myanmar ruby.',
            price: 250000,
            stock: 5,
            categoryName: 'Jewelry',
        },
        {
            name: 'Lotus Flower Vase',
            description: 'Handmade ceramic vase with lotus flower motif. Glazed in traditional celadon green.',
            price: 28000,
            stock: 25,
            categoryName: 'Pottery',
        },
        {
            name: 'Buddha Portrait Painting',
            description: 'Original oil painting depicting Myanmar Buddha iconography. Canvas size 50x70cm.',
            price: 150000,
            stock: 3,
            categoryName: 'Paintings',
        },
        {
            name: 'Thanaka Gift Set',
            description: 'Traditional thanaka bark pieces with stone grinding plate. Authentic natural cosmetic from Myanmar.',
            price: 15000,
            stock: 50,
            categoryName: 'Wood Crafts',
        },
        {
            name: 'Bagan Temple Miniature',
            description: 'Detailed lacquerware miniature of a Bagan pagoda temple. A beautiful collectible piece.',
            price: 55000,
            stock: 7,
            categoryName: 'Lacquerware',
        },
        {
            name: 'Chin Weaving Tapestry',
            description: 'Traditional Chin tribal tapestry with natural dyes. Each piece is a unique work of art.',
            price: 95000,
            stock: 4,
            categoryName: 'Textiles',
        },
    ];

    for (const prod of productData) {
        const category = categories.find((c) => c.name === prod.categoryName);
        await prisma.product.create({
            data: {
                name: prod.name,
                description: prod.description,
                price: prod.price,
                stock: prod.stock,
                category_id: category?.id || null,
            },
        });
    }
    console.log('✅ Products created:', productData.length);

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
