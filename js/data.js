// AmaarBazaar — Gumtree-style hierarchical categories
const CATEGORY_GROUPS = [
  {
    group: 'Cars & Vehicles',
    key: 'group.vehicles',
    categories: [
      { id: 'cars',              icon: '🚗', key: 'cat.cars' },
      { id: 'motorbikes',        icon: '🏍️', key: 'cat.motorbikes' },
      { id: 'vans',              icon: '🚐', key: 'cat.vans' },
      { id: 'buses',             icon: '🚌', key: 'cat.buses' },
      { id: 'trucks',            icon: '🚚', key: 'cat.trucks' },
      { id: 'tractors',          icon: '🚜', key: 'cat.tractors' },
      { id: 'auto_accessories',  icon: '⚙️', key: 'cat.auto_accessories' },
      { id: 'auto_parts',        icon: '🔧', key: 'cat.auto_parts' },
      { id: 'bicycles',          icon: '🚲', key: 'cat.bicycles' },
      { id: 'vehicle_wanted',    icon: '🔎', key: 'cat.vehicle_wanted' }
    ]
  },
  {
    group: 'For Sale',
    key: 'group.forsale',
    categories: [
      { id: 'mobiles',           icon: '📱', key: 'cat.mobiles' },
      { id: 'computers',         icon: '💻', key: 'cat.computers' },
      { id: 'tablets',           icon: '📱', key: 'cat.tablets' },
      { id: 'cameras',           icon: '📷', key: 'cat.cameras' },
      { id: 'tv_audio',          icon: '📺', key: 'cat.tv_audio' },
      { id: 'gaming',            icon: '🎮', key: 'cat.gaming' },
      { id: 'appliances',        icon: '❄️', key: 'cat.appliances' },
      { id: 'furniture',         icon: '🪑', key: 'cat.furniture' },
      { id: 'home_decor',        icon: '🖼️', key: 'cat.home_decor' },
      { id: 'kitchenware',       icon: '🍳', key: 'cat.kitchenware' },
      { id: 'bedding',           icon: '🛏️', key: 'cat.bedding' },
      { id: 'fashion',           icon: '👗', key: 'cat.fashion' },
      { id: 'footwear',          icon: '👞', key: 'cat.footwear' },
      { id: 'jewelry',           icon: '💍', key: 'cat.jewelry' },
      { id: 'watches',           icon: '⌚', key: 'cat.watches' },
      { id: 'bags',              icon: '👜', key: 'cat.bags' },
      { id: 'baby_kids',         icon: '👶', key: 'cat.baby_kids' },
      { id: 'books_media',       icon: '📚', key: 'cat.books_media' },
      { id: 'sports_leisure',    icon: '⚽', key: 'cat.sports_leisure' },
      { id: 'toys',              icon: '🧸', key: 'cat.toys' },
      { id: 'art_collectibles',  icon: '🎨', key: 'cat.art_collectibles' },
      { id: 'diy_tools',         icon: '🔨', key: 'cat.diy_tools' },
      { id: 'office_furniture',  icon: '🪑', key: 'cat.office_furniture' },
      { id: 'stuff_wanted',      icon: '🔎', key: 'cat.stuff_wanted' },
      { id: 'swap_shop',         icon: '🔄', key: 'cat.swap_shop' }
    ]
  },
  {
    group: 'Services',
    key: 'group.services',
    categories: [
      { id: 'healthcare',        icon: '🏥', key: 'cat.healthcare' },
      { id: 'it_services',       icon: '💻', key: 'cat.it_services' },
      { id: 'construction',      icon: '🏗️', key: 'cat.construction' },
      { id: 'plumbing',          icon: '🔧', key: 'cat.plumbing' },
      { id: 'electrical',        icon: '⚡', key: 'cat.electrical' },
      { id: 'cleaning',          icon: '🧹', key: 'cat.cleaning' },
      { id: 'gardening',         icon: '🌿', key: 'cat.gardening' },
      { id: 'moving_storage',    icon: '📦', key: 'cat.moving_storage' },
      { id: 'beauty_salon',      icon: '💇', key: 'cat.beauty_salon' },
      { id: 'tuition_classes',   icon: '📚', key: 'cat.tuition_classes' },
      { id: 'entertainment',     icon: '🎬', key: 'cat.entertainment' },
      { id: 'events_catering',   icon: '🎉', key: 'cat.events_catering' },
      { id: 'travel_tourism',    icon: '✈️', key: 'cat.travel_tourism' },
      { id: 'legal_consulting',  icon: '⚖️', key: 'cat.legal_consulting' },
      { id: 'financial_services', icon: '💰', key: 'cat.financial_services' }
    ]
  },
  {
    group: 'Property',
    key: 'group.property',
    categories: [
      { id: 'property_sale',     icon: '🏠', key: 'cat.property_sale' },
      { id: 'property_rent',     icon: '🏘️', key: 'cat.property_rent' },
      { id: 'flatmates',         icon: '👥', key: 'cat.flatmates' },
      { id: 'commercial_space',  icon: '🏢', key: 'cat.commercial_space' },
      { id: 'office_rent',       icon: '🏢', key: 'cat.office_rent' },
      { id: 'garage_parking',    icon: '🅿️', key: 'cat.garage_parking' },
      { id: 'holiday_rentals',   icon: '🏖️', key: 'cat.holiday_rentals' },
      { id: 'property_wanted',   icon: '🔎', key: 'cat.property_wanted' }
    ]
  },
  {
    group: 'Pets',
    key: 'group.pets',
    categories: [
      { id: 'dogs',              icon: '🐕', key: 'cat.dogs' },
      { id: 'cats',              icon: '🐱', key: 'cat.cats' },
      { id: 'birds',             icon: '🐦', key: 'cat.birds' },
      { id: 'fish',              icon: '🐠', key: 'cat.fish' },
      { id: 'reptiles',          icon: '🐍', key: 'cat.reptiles' },
      { id: 'small_animals',     icon: '🐹', key: 'cat.small_animals' },
      { id: 'horses',            icon: '🐴', key: 'cat.horses' },
      { id: 'livestock',         icon: '🐄', key: 'cat.livestock' },
      { id: 'pet_supplies',      icon: '🦴', key: 'cat.pet_supplies' },
      { id: 'lost_found_pets',   icon: '🔍', key: 'cat.lost_found_pets' }
    ]
  },
  {
    group: 'Jobs',
    key: 'group.jobs',
    categories: [
      { id: 'accounting',        icon: '💼', key: 'cat.accounting' },
      { id: 'admin',             icon: '📋', key: 'cat.admin' },
      { id: 'agriculture_jobs',  icon: '🌾', key: 'cat.agriculture_jobs' },
      { id: 'it_jobs',           icon: '💻', key: 'cat.it_jobs' },
      { id: 'engineering',       icon: '⚙️', key: 'cat.engineering' },
      { id: 'healthcare_jobs',   icon: '🏥', key: 'cat.healthcare_jobs' },
      { id: 'hospitality',       icon: '🏨', key: 'cat.hospitality' },
      { id: 'sales_marketing',   icon: '📢', key: 'cat.sales_marketing' },
      { id: 'construction_jobs', icon: '🏗️', key: 'cat.construction_jobs' },
      { id: 'driving_logistics', icon: '🚚', key: 'cat.driving_logistics' },
      { id: 'education_jobs',    icon: '📚', key: 'cat.education_jobs' },
      { id: 'finance_jobs',      icon: '💰', key: 'cat.finance_jobs' },
      { id: 'legal_jobs',        icon: '⚖️', key: 'cat.legal_jobs' },
      { id: 'manufacturing',     icon: '🏭', key: 'cat.manufacturing' },
      { id: 'freelance',         icon: '🎯', key: 'cat.freelance' }
    ]
  },
  {
    group: 'Community',
    key: 'group.community',
    categories: [
      { id: 'events',            icon: '🎉', key: 'cat.events' },
      { id: 'groups',            icon: '👥', key: 'cat.groups' },
      { id: 'discussions',       icon: '💬', key: 'cat.discussions' },
      { id: 'lost_found',        icon: '🔍', key: 'cat.lost_found' },
      { id: 'giveaways',         icon: '🎁', key: 'cat.giveaways' }
    ]
  }
];

// Flat list for backwards compatibility with filters/modals
const CATEGORIES = CATEGORY_GROUPS.reduce((arr, group) => [...arr, ...group.categories], []);

// Listings use real sub-category ids + their parent group slug so browse/group filters work.
const LISTINGS = [
  { id:1, cat:'motorbikes', group:'vehicles', price:185000, featured:true,
    title:{en:'Honda CB Hornet 2022 — fresh', bn:'Honda CB Hornet 2022 — ফ্রেশ'},
    loc:{en:'Mirpur, Dhaka', bn:'মিরপুর, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80' },
  { id:2, cat:'mobiles', group:'forsale', price:142000, featured:true,
    title:{en:'iPhone 14 Pro 256GB, warranty', bn:'iPhone 14 Pro 256GB, ওয়ারেন্টি'},
    loc:{en:'Gulshan, Dhaka', bn:'গুলশান, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80' },
  { id:3, cat:'property_rent', group:'property', price:25000, featured:true,
    title:{en:'2-bed flat to rent, well lit', bn:'২ রুমের ফ্ল্যাট ভাড়া, আলোকিত'},
    loc:{en:'Dhanmondi, Dhaka', bn:'ধানমন্ডি, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80' },
  { id:4, cat:'computers', group:'forsale', price:78000, featured:false,
    title:{en:'MacBook Air M1, 8/256, mint', bn:'MacBook Air M1, 8/256, মিন্ট'},
    loc:{en:'Agrabad, Chattogram', bn:'আগ্রাবাদ, চট্টগ্রাম'}, days:3,
    img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
  { id:5, cat:'furniture', group:'forsale', price:32000, featured:false,
    title:{en:'Solid wood dining table, 6-seat', bn:'কাঠের ডাইনিং টেবিল, ৬ আসন'},
    loc:{en:'Zindabazar, Sylhet', bn:'জিন্দাবাজার, সিলেট'}, days:4,
    img:'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80' },
  { id:6, cat:'cars', group:'vehicles', price:1250000, featured:true,
    title:{en:'Toyota Axio 2017, single owner', bn:'Toyota Axio 2017, একক মালিক'},
    loc:{en:'Uttara, Dhaka', bn:'উত্তরা, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80' },
  { id:7, cat:'cats', group:'pets', price:8500, featured:false,
    title:{en:'Persian kitten, vaccinated', bn:'পার্সিয়ান বিড়ালছানা, টিকা দেওয়া'},
    loc:{en:'Khulshi, Chattogram', bn:'খুলশী, চট্টগ্রাম'}, days:5,
    img:'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80' },
  { id:8, cat:'tv_audio', group:'forsale', price:54000, featured:false,
    title:{en:'Samsung 55" 4K Smart TV', bn:'Samsung 55" 4K স্মার্ট টিভি'},
    loc:{en:'Bashundhara, Dhaka', bn:'বসুন্ধরা, ঢাকা'}, days:3,
    img:'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
  { id:9, cat:'bicycles', group:'vehicles', price:4500, featured:false,
    title:{en:'Trek mountain bike, 21-speed', bn:'Trek মাউন্টেন বাইক, ২১-স্পিড'},
    loc:{en:'Rajshahi city', bn:'রাজশাহী শহর'}, days:6,
    img:'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80' },
  { id:10, cat:'freelance', group:'jobs', price:35000, featured:false,
    title:{en:'Graphic designer — full time', bn:'গ্রাফিক ডিজাইনার — ফুল টাইম'},
    loc:{en:'Banani, Dhaka', bn:'বনানী, ঢাকা'}, days:1,
    img:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80' },
  { id:11, cat:'electrical', group:'services', price:1500, featured:false,
    title:{en:'AC servicing & repair, doorstep', bn:'এসি সার্ভিসিং ও মেরামত, বাসায়'},
    loc:{en:'Mohakhali, Dhaka', bn:'মহাখালী, ঢাকা'}, days:2,
    img:'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&q=80' },
  { id:12, cat:'property_sale', group:'property', price:8500000, featured:false,
    title:{en:'Land plot 5 katha, ready docs', bn:'জমি ৫ কাঠা, কাগজ প্রস্তুত'},
    loc:{en:'Savar, Dhaka', bn:'সাভার, ঢাকা'}, days:7,
    img:'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80' }
];

// Predefined Bangladesh cities/towns for the location picker (overridable free-text).
const BD_CITIES = [
  'Dhaka','Chattogram','Khulna','Rajshahi','Sylhet','Barishal','Rangpur','Mymensingh',
  'Gazipur','Narayanganj','Savar','Tongi','Comilla','Cox’s Bazar','Jessore','Bogura',
  'Dinajpur','Tangail','Pabna','Brahmanbaria','Naogaon','Feni','Noakhali','Jamalpur',
  'Kushtia','Faridpur','Sirajganj','Satkhira','Narsingdi','Chandpur','Habiganj','Moulvibazar',
  'Sunamganj','Bhola','Patuakhali','Pirojpur','Jhenaidah','Magura','Madaripur','Manikganj',
  'Munshiganj','Kishoreganj','Netrokona','Sherpur','Nilphamari','Lalmonirhat','Kurigram',
  'Gaibandha','Joypurhat','Natore','Chapainawabganj','Meherpur','Chuadanga','Bagerhat',
  'Narail','Gopalganj','Rajbari','Shariatpur','Lakshmipur','Khagrachhari','Rangamati','Bandarban'
];

// Coarse division coordinates for the "use my location" nearest-city lookup.
const BD_CITY_COORDS = {
  'Dhaka':[23.81,90.41], 'Chattogram':[22.36,91.78], 'Khulna':[22.85,89.54],
  'Rajshahi':[24.37,88.60], 'Sylhet':[24.90,91.87], 'Barishal':[22.70,90.37],
  'Rangpur':[25.74,89.27], 'Mymensingh':[24.75,90.40], 'Cox’s Bazar':[21.43,92.01],
  'Comilla':[23.46,91.18], 'Bogura':[24.85,89.37], 'Jessore':[23.17,89.21]
};
