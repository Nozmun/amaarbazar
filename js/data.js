// AmaarBazaar — sample listings. Bilingual title/location, BDT prices.
const CATEGORIES = [
  // Motors & Vehicles
  { id: 'cars',            icon: '🚗', key: 'cat.cars' },
  { id: 'motorcycles',     icon: '🏍️', key: 'cat.motorcycles' },
  { id: 'commercial',      icon: '🚚', key: 'cat.commercial' },
  { id: 'auto_parts',      icon: '⚙️', key: 'cat.auto_parts' },
  { id: 'bicycles',        icon: '🚲', key: 'cat.bicycles' },

  // Property & Housing
  { id: 'property_rent',   icon: '🏘️', key: 'cat.property_rent' },
  { id: 'property_sale',   icon: '🏠', key: 'cat.property_sale' },
  { id: 'flatmates',       icon: '👥', key: 'cat.flatmates' },
  { id: 'commercial_rent', icon: '🏢', key: 'cat.commercial_rent' },

  // Electronics & Technology
  { id: 'mobiles',         icon: '📱', key: 'cat.mobiles' },
  { id: 'computers',       icon: '💻', key: 'cat.computers' },
  { id: 'tablets',         icon: '📱', key: 'cat.tablets' },
  { id: 'cameras',         icon: '📷', key: 'cat.cameras' },
  { id: 'electronics',     icon: '🔌', key: 'cat.electronics' },
  { id: 'tv_audio',        icon: '📺', key: 'cat.tv_audio' },
  { id: 'gaming',          icon: '🎮', key: 'cat.gaming' },

  // Household & Furniture
  { id: 'furniture',       icon: '🪑', key: 'cat.furniture' },
  { id: 'appliances',      icon: '❄️', key: 'cat.appliances' },
  { id: 'kitchenware',     icon: '🍳', key: 'cat.kitchenware' },
  { id: 'home_decor',      icon: '🖼️', key: 'cat.home_decor' },
  { id: 'bedding',         icon: '🛏️', key: 'cat.bedding' },

  // Fashion & Accessories
  { id: 'fashion',         icon: '👗', key: 'cat.fashion' },
  { id: 'footwear',        icon: '👞', key: 'cat.footwear' },
  { id: 'jewelry',         icon: '💍', key: 'cat.jewelry' },
  { id: 'watches',         icon: '⌚', key: 'cat.watches' },
  { id: 'bags',            icon: '👜', key: 'cat.bags' },

  // Sports, Hobbies & Recreation
  { id: 'sports',          icon: '⚽', key: 'cat.sports' },
  { id: 'outdoor',         icon: '⛺', key: 'cat.outdoor' },
  { id: 'fitness',         icon: '💪', key: 'cat.fitness' },
  { id: 'musical',         icon: '🎸', key: 'cat.musical' },
  { id: 'books',           icon: '📚', key: 'cat.books' },
  { id: 'toys',            icon: '🧸', key: 'cat.toys' },
  { id: 'collectibles',    icon: '🎨', key: 'cat.collectibles' },

  // Agriculture & Livestock
  { id: 'livestock',       icon: '🐄', key: 'cat.livestock' },
  { id: 'agriculture',     icon: '🌾', key: 'cat.agriculture' },
  { id: 'farming_tools',   icon: '🚜', key: 'cat.farming_tools' },
  { id: 'aquaculture',     icon: '🐟', key: 'cat.aquaculture' },

  // Pets & Animals
  { id: 'pets',            icon: '🐾', key: 'cat.pets' },
  { id: 'pet_supplies',    icon: '🦴', key: 'cat.pet_supplies' },

  // Services
  { id: 'services',        icon: '🛠️', key: 'cat.services' },
  { id: 'lessons',         icon: '🎓', key: 'cat.lessons' },
  { id: 'tutoring',        icon: '📖', key: 'cat.tutoring' },
  { id: 'repair',          icon: '🔧', key: 'cat.repair' },
  { id: 'moving',          icon: '📦', key: 'cat.moving' },

  // Jobs & Work
  { id: 'jobs',            icon: '💼', key: 'cat.jobs' },
  { id: 'jobs_fulltime',   icon: '💻', key: 'cat.jobs_fulltime' },
  { id: 'jobs_parttime',   icon: '⏰', key: 'cat.jobs_parttime' },
  { id: 'freelance',       icon: '🎯', key: 'cat.freelance' },

  // Education & Courses
  { id: 'education',       icon: '🎓', key: 'cat.education' },
  { id: 'courses',         icon: '📚', key: 'cat.courses' },
  { id: 'skills',          icon: '🎯', key: 'cat.skills' },

  // Community & Events
  { id: 'events',          icon: '🎉', key: 'cat.events' },
  { id: 'groups',          icon: '👥', key: 'cat.groups' },
  { id: 'lost_found',      icon: '🔍', key: 'cat.lost_found' },
  { id: 'community',       icon: '🤝', key: 'cat.community' },

  // General & Miscellaneous
  { id: 'wanted',          icon: '🔎', key: 'cat.wanted' },
  { id: 'exchange',        icon: '🔄', key: 'cat.exchange' },
  { id: 'other',           icon: '📦', key: 'cat.other' }
];

const LISTINGS = [
  { id:1, cat:'vehicles', price:185000, featured:true,
    title:{en:'Honda CB Hornet 2022 — fresh', bn:'Honda CB Hornet 2022 — ফ্রেশ'},
    loc:{en:'Mirpur, Dhaka', bn:'মিরপুর, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80' },
  { id:2, cat:'electronics', price:142000, featured:true,
    title:{en:'iPhone 14 Pro 256GB, warranty', bn:'iPhone 14 Pro 256GB, ওয়ারেন্টি'},
    loc:{en:'Gulshan, Dhaka', bn:'গুলশান, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' },
  { id:3, cat:'property', price:25000, featured:true,
    title:{en:'2-bed flat to rent, well lit', bn:'২ রুমের ফ্ল্যাট ভাড়া, আলোকিত'},
    loc:{en:'Dhanmondi, Dhaka', bn:'ধানমন্ডি, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { id:4, cat:'electronics', price:78000, featured:false,
    title:{en:'MacBook Air M1, 8/256, mint', bn:'MacBook Air M1, 8/256, মিন্ট'},
    loc:{en:'Agrabad, Chattogram', bn:'আগ্রাবাদ, চট্টগ্রাম'}, days:3,
    img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
  { id:5, cat:'forsale', price:32000, featured:false,
    title:{en:'Solid wood dining table, 6-seat', bn:'কাঠের ডাইনিং টেবিল, ৬ আসন'},
    loc:{en:'Zindabazar, Sylhet', bn:'জিন্দাবাজার, সিলেট'}, days:4,
    img:'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80' },
  { id:6, cat:'vehicles', price:1250000, featured:true,
    title:{en:'Toyota Axio 2017, single owner', bn:'Toyota Axio 2017, একক মালিক'},
    loc:{en:'Uttara, Dhaka', bn:'উত্তরা, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80' },
  { id:7, cat:'pets', price:8500, featured:false,
    title:{en:'Persian kitten, vaccinated', bn:'পার্সিয়ান বিড়ালছানা, টিকা দেওয়া'},
    loc:{en:'Khulshi, Chattogram', bn:'খুলশী, চট্টগ্রাম'}, days:5,
    img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' },
  { id:8, cat:'electronics', price:54000, featured:false,
    title:{en:'Samsung 55" 4K Smart TV', bn:'Samsung 55" 4K স্মার্ট টিভি'},
    loc:{en:'Bashundhara, Dhaka', bn:'বসুন্ধরা, ঢাকা'}, days:3,
    img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
  { id:9, cat:'forsale', price:4500, featured:false,
    title:{en:'Trek mountain bike, 21-speed', bn:'Trek মাউন্টেন বাইক, ২১-স্পিড'},
    loc:{en:'Rajshahi city', bn:'রাজশাহী শহর'}, days:6,
    img:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80' },
  { id:10, cat:'jobs', price:35000, featured:false,
    title:{en:'Graphic designer — full time', bn:'গ্রাফিক ডিজাইনার — ফুল টাইম'},
    loc:{en:'Banani, Dhaka', bn:'বনানী, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80' },
  { id:11, cat:'services', price:1500, featured:false,
    title:{en:'AC servicing & repair, doorstep', bn:'এসি সার্ভিসিং ও মেরামত, বাসায়'},
    loc:{en:'Mohakhali, Dhaka', bn:'মহাখালী, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80' },
  { id:12, cat:'property', price:8500000, featured:false,
    title:{en:'Land plot 5 katha, ready docs', bn:'জমি ৫ কাঠা, কাগজ প্রস্তুত'},
    loc:{en:'Savar, Dhaka', bn:'সাভার, ঢাকা'}, days:7,
    img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' }
];
