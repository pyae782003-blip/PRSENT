<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password123'),
                'role' => 'user',
            ]
        );

        // 2. Create Categories
        $categories = [
            [
                'name' => 'Keychains',
                'description' => 'Cute and colorful handmade keychains perfect for gifts.',
                'image' => 'https://images.unsplash.com/photo-1589384267710-7a25bef0c064?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'name' => 'Tote Bags',
                'description' => 'Eco-friendly hand-stitched tote bags with unique designs.',
                'image' => 'https://images.unsplash.com/photo-1590874103328-3afa802b3d26?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'name' => 'Home Decor',
                'description' => 'Add warmth to your home with our handmade decor items.',
                'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'name' => 'Accessories',
                'description' => 'Beautiful hair clips, bands, and jewelry.',
                'image' => 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=800'
            ]
        ];

        $catModels = [];
        foreach ($categories as $cat) {
            $catModels[$cat['name']] = Category::firstOrCreate(
                ['name' => $cat['name']],
                ['description' => $cat['description']]
            );
        }

        // 3. Create Products
        $products = [
            // Keychains
            [
                'name' => 'Crochet Heart Keychain',
                'price' => 3500,
                'category' => 'Keychains',
                'description' => 'A lovely handcrafted heart keychain made with soft yarn.',
                'images' => ['https://images.unsplash.com/photo-1629031756578-8774775d082b?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Mini Bear Keychain',
                'price' => 4500,
                'category' => 'Keychains',
                'description' => 'Adorable mini bear keychain, perfect for bags.',
                'images' => ['https://images.unsplash.com/photo-1559537158-b610c3c86801?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Sunflower Charm',
                'price' => 3000,
                'category' => 'Keychains',
                'description' => 'Bright and cheerful sunflower crochet charm.',
                'images' => ['https://images.unsplash.com/photo-1598020817006-25895782782c?auto=format&fit=crop&q=80&w=800']
            ],

            // Tote Bags
            [
                'name' => 'Canvas Tote - Floral',
                'price' => 12000,
                'category' => 'Tote Bags',
                'description' => 'Sturdy canvas tote with embroidered floral patterns.',
                'images' => ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Denim Patchwork Bag',
                'price' => 15000,
                'category' => 'Tote Bags',
                'description' => 'Upcycled denim patchwork bag, unique and stylish.',
                'images' => ['https://images.unsplash.com/photo-1554342597-27e1d428bfde?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Minimalist Shoulder Bag',
                'price' => 10000,
                'category' => 'Tote Bags',
                'description' => 'Simple everyday bag in neutral colors.',
                'images' => ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=800']
            ],

            // Home Decor
            [
                'name' => 'Macrame Wall Hanging',
                'price' => 25000,
                'category' => 'Home Decor',
                'description' => 'Boho style macrame wall hanging for your living room.',
                'images' => ['https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Handwoven Coaster Set',
                'price' => 6000,
                'category' => 'Home Decor',
                'description' => 'Set of 4 playful handwoven coasters.',
                'images' => ['https://images.unsplash.com/photo-1616486029423-aaa478965c97?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Ceramic Flower Vase',
                'price' => 18000,
                'category' => 'Home Decor',
                'description' => 'Hand-painted ceramic vase, perfect for dried flowers.',
                'images' => ['https://images.unsplash.com/photo-1581783342308-f792ca11df53?auto=format&fit=crop&q=80&w=800']
            ],

            // Accessories
            [
                'name' => 'Pearl Hair Clip Set',
                'price' => 5000,
                'category' => 'Accessories',
                'description' => 'Elegant pearl hair clips for special occasions.',
                'images' => ['https://images.unsplash.com/photo-1618381801643-cbc03e839e08?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Beaded Bracelet',
                'price' => 3500,
                'category' => 'Accessories',
                'description' => 'Colorful beaded bracelet, stretchable fit.',
                'images' => ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800']
            ],
            [
                'name' => 'Velvet Scrunchie Pack',
                'price' => 4000,
                'category' => 'Accessories',
                'description' => 'Pack of 3 soft velvet scrunchies.',
                'images' => ['https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&q=80&w=800']
            ],
        ];

        foreach ($products as $p) {
            $product = Product::firstOrCreate(
                ['name' => $p['name']],
                [
                    'price' => $p['price'],
                    'description' => $p['description'],
                    'stock' => rand(5, 50),
                    'category_id' => $catModels[$p['category']]->id ?? null,
                ]
            );

            if ($product->images()->count() === 0) {
                foreach ($p['images'] as $url) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'url' => $url
                    ]);
                }
            }
        }
    }
}
