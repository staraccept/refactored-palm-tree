// posProducts.ts

export interface PosProduct {
  name: string;
  identifier: string;
  bestFor: string[];
  features: string[];
  searchTerms: {
    industries: {
      includes(industry: string): boolean;
      map(arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode; businessTypes: string[]; useCase: string[]; keywords: string[]; 
};
    businessTypes: string[];
    useCase: string[];
    keywords: string[];
  };
  relatedProducts: string[];
  primaryCategory: 'pos' | 'peripheral' | 'mobile' | 'selfservice';
  size: 'compact' | 'standard' | 'large';
  priority: number;
  cta: string;
  image: string | null;
}

// Expanded base features for broader applications
const baseFeatures = {
  connectivity: ["WiFi + 4G LTE"],
  payments: [
    "Apple Pay, Google Pay, Samsung Pay",
    "Tap-to-Pay, EMV, Magstripe"
  ],
  hardware: [
    "Built-in Barcode Scanner",
    "Built-in Receipt Printer"
  ],
  system: [
    "Modular w/ Live Sync to Dashboard"
  ]
};

const combineFeatures = (uniqueFeatures: string[] = []): string[] => {
  return [
    ...baseFeatures.connectivity,
    ...baseFeatures.payments,
    ...baseFeatures.hardware,
    ...baseFeatures.system,
    ...uniqueFeatures
  ];
};

export const posProducts: PosProduct[] = [
  {
    // Clover Station Duo 2, merging old/new data
    name: "Clover Station Duo 2",
    identifier: "duo2",
    bestFor: [
      "High-Volume Full-Service",
      "Multi-Station Restaurants",
      "Fine Dining"
    ],
    features: combineFeatures([
      "Dual screens (customer display)",
      "Powerful processor for rush hours",
      "Advanced reporting & inventory",
      "Staff roles & permissions",
      "Table management & coursing"
    ]),
    searchTerms: {
      // Enhanced business types with more industry-specific terms
      businessTypes: [
        "restaurant",
        "fine dining",
        "bar and grill",
        "catering",
        "bakery",
        "hotel restaurant",
        "autobody shop",
        "mechanic",
        "tax accountant",
        "full service restaurant",
        "casual dining",
        "bistro",
        "steakhouse",
        "seafood restaurant",
        "large retail store",
        "department store",
        "full service business"
      ],
      useCase: [
        "table service",
        "full service",
        "multi station",
        "inventory management",
        "customer tracking",
        "high transaction volume",
        "high volume",
        "table management",
        "multiple employees",
        "staff management",
        "complex inventory",
        "customer loyalty tracking"
      ],
      keywords: [
        "duo",
        "dual screen",
        "customer display",
        "table tracking",
        "staff management",
        "inventory",
        "restaurant pos",
        "powerful",
        "high capacity",
        "multiple users",
        "advanced system",
        "premium"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["kds", "starprinter"],
    primaryCategory: "pos",
    size: "large",
    priority: 100,
    cta: "Learn More",
    image: "/full-service-pos.jpg"
  },
  {
    // Clover Station Solo from old data
    name: "Clover Station Solo",
    identifier: "solo",
    bestFor: [
      "Busy Bars",
      "Quick-Service Restaurants",
      "Fast-Casual Dining"
    ],
    features: combineFeatures([
      "14-inch HD touchscreen",
      "Tip & split payments",
      "Quick-menu customization",
      "Bar tab management",
      "Fast order processing"
    ]),
    searchTerms: {
      // Enhanced with additional relevant terms
      businessTypes: [
        "bar",
        "pub",
        "quick service restaurant",
        "fast casual",
        "cafe",
        "coffee shop",
        "food truck",
        "deli",
        "sandwich shop",
        "pizza place",
        "ice cream shop",
        "medium retail",
        "small grocery",
        "liquor store",
        "nightclub",
        "tavern"
      ],
      useCase: [
        "quick service",
        "counter service",
        "bar service",
        "fast paced",
        "high volume",
        "retail checkout",
        "line busting",
        "tab management",
        "tip management",
        "moderate space",
        "order management"
      ],
      keywords: [
        "solo",
        "single screen",
        "tips",
        "bar tabs",
        "quick menu",
        "bar",
        "fast",
        "efficient",
        "counter",
        "quick",
        "medium sized",
        "standard"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["kds", "starprinter"],
    primaryCategory: "pos",
    size: "standard",
    priority: 90,
    cta: "Learn More",
    image: "/bar-service-pos.jpg"
  },
  {
    // Clover Mini
    name: "Clover Mini",
    identifier: "mini3",
    bestFor: [
      "Space-Conscious Retail",
      "Coffee Shops",
      "Small Businesses"
    ],
    features: combineFeatures([
      "Compact 7-inch display",
      "Optional customer-facing screen",
      "Built-in loyalty integration",
      "Simple inventory"
    ]),
    searchTerms: {
      // Enhanced with professional service terms
      businessTypes: [
        "coffee shop",
        "cafe",
        "small retail",
        "boutique",
        "salon",
        "service business",
        "small business",
        "lawyer",
        "attorney",
        "legal office",
        "accountant",
        "tax preparer",
        "doctor's office",
        "dental office",
        "spa",
        "barber shop",
        "professional service",
        "consultant",
        "small office",
        "therapy practice",
        "medical practice",
        "real estate office"
      ],
      useCase: [
        "counter service",
        "retail checkout",
        "small space",
        "single station",
        "compact setup",
        "client billing",
        "professional service",
        "limited space",
        "appointment-based business",
        "client intake",
        "professional billing"
      ],
      keywords: [
        "mini",
        "small",
        "compact",
        "space saving",
        "retail",
        "loyalty",
        "professional",
        "sleek",
        "elegant",
        "office",
        "desktop",
        "lawyer",
        "attorney",
        "legal",
        "doctor",
        "accountant",
        "consultant",
        "tax",
        "medical"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["flex4"],
    primaryCategory: "pos",
    size: "compact",
    priority: 80,
    cta: "Learn More",
    image: "/minipos.jpg"
  },
  {
    // Clover Flex 4, merging old/new data
    name: "Clover Flex 4",
    identifier: "flex4",
    bestFor: [
      "Mobile Food Service",
      "Table-Side Ordering",
      "Pop-Up Retail"
    ],
    features: combineFeatures([
      "5-inch handheld device",
      "12-hour battery",
      "Splash-resistant",
      "Camera for barcode scans"
    ]),
    searchTerms: {
      // Enhanced with field service and professional terms
      businessTypes: [
        "food truck",
        "mobile business",
        "event vendor",
        "mechanic",
        "accountant",
        "tax preparation",
        "freelancer",
        "service provider",
        "restaurant",
        "delivery service",
        "pop up shop",
        "market vendor",
        "lawyer",
        "attorney",
        "legal service",
        "healthcare provider",
        "home service",
        "contractor",
        "plumber",
        "electrician",
        "field service",
        "mobile salon",
        "outdoor market",
        "festival vendor",
        "fitness trainer",
        "mobile healthcare",
        "food delivery"
      ],
      useCase: [
        "mobile",
        "portable",
        "tableside",
        "on-the-go transactions",
        "handheld checkout",
        "client billing",
        "delivery",
        "on the go",
        "field service",
        "outdoor use",
        "mobile professional",
        "client visits",
        "house calls",
        "mobile invoice",
        "off-site work",
        "traveling professional",
        "mobile legal",
        "mobile accounting",
        "mobile medical"
      ],
      keywords: [
        "flex",
        "handheld",
        "portable",
        "battery",
        "mobile",
        "camera scanner",
        "camera",
        "wireless",
        "field",
        "travel",
        "cordless",
        "offsite",
        "remote",
        "on-site",
        "anywhere",
        "lawyer",
        "attorney",
        "legal",
        "accountant",
        "doctor",
        "medical",
        "professional",
        "consultant"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["mini3"],
    primaryCategory: "mobile",
    size: "compact",
    priority: 85,
    cta: "Learn More",
    image: "/handheldpos.jpg"
  },
  {
    // Star Kitchen Printer
    name: "Star Kitchen Printer",
    identifier: "starprinter",
    bestFor: [
      "High-Volume Kitchens",
      "Multi-Station Restaurants",
      "Quick-Service Lines"
    ],
    features: [
      "250mm/sec print speed",
      "Auto-cutter & splash resistant",
      "Thermal printing (no ink)",
      "Multiple station support",
      "Auto status alerts"
    ],
    searchTerms: {
      businessTypes: [
        "restaurant",
        "cafe",
        "quick service",
        "food service",
        "kitchen",
        "bar",
        "bakery",
        "food preparation",
        "catering",
        "cafeteria",
        "hotel kitchen",
        "ghost kitchen",
        "cloud kitchen"
      ],
      useCase: [
        "kitchen printing",
        "order tickets",
        "food prep",
        "kitchen management",
        "order management",
        "busy kitchen",
        "multiple stations",
        "food preparation",
        "order routing"
      ],
      keywords: [
        "printer",
        "kitchen printer",
        "thermal",
        "tickets",
        "automation",
        "food orders",
        "restaurant equipment",
        "kitchen equipment",
        "chit printer",
        "order printer"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["duo2", "solo", "kds"],
    primaryCategory: "peripheral",
    size: "compact",
    priority: 60,
    cta: "Learn More",
    image: "/kitchenprinter.jpg"
  },
  {
    // Clover Kitchen Display
    name: "Clover Kitchen Display",
    identifier: "kds",
    bestFor: [
      "High-Volume Kitchens",
      "Multi-Station Food Prep",
      "Quick-Service Production"
    ],
    features: [
      "15-inch heat-resistant screen",
      "Real-time order routing",
      "Timing & tracking",
      "Recipe display integration",
      "Performance metrics"
    ],
    searchTerms: {
      businessTypes: [
        "restaurant",
        "quick service",
        "fast casual",
        "food service",
        "kitchen",
        "cafeteria",
        "food court",
        "ghost kitchen",
        "cloud kitchen",
        "catering",
        "high volume restaurant",
        "chain restaurant"
      ],
      useCase: [
        "kitchen display",
        "order management",
        "food prep",
        "kitchen automation",
        "digital tickets",
        "order tracking",
        "kitchen efficiency",
        "food preparation",
        "order routing",
        "high volume kitchen"
      ],
      keywords: [
        "kds",
        "kitchen display",
        "digital",
        "screen",
        "order tracking",
        "kitchen",
        "food prep",
        "timing",
        "metrics",
        "performance tracking",
        "digital kitchen"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["duo2", "solo", "starprinter"],
    primaryCategory: "peripheral",
    size: "standard",
    priority: 70,
    cta: "Learn More",
    image: "/kitchendisplay.jpg"
  },
  {
    // Clover Kiosk
    name: "Clover Kiosk",
    identifier: "kiosk",
    bestFor: [
      "Quick-Service Restaurants",
      "Fast-Casual Dining",
      "High-Traffic Retail"
    ],
    features: combineFeatures([
      "22-inch touchscreen",
      "ADA-compliant design",
      "Smart upsell prompts",
      "Multi-language support",
      "Loyalty integration"
    ]),
    searchTerms: {
      businessTypes: [
        "quick service restaurant",
        "fast casual",
        "retail",
        "cafeteria",
        "food court",
        "convenience store",
        "supermarket",
        "grocery store",
        "pharmacy",
        "department store",
        "mall",
        "cinema",
        "theater",
        "airport",
        "stadium",
        "arena",
        "high traffic venue"
      ],
      useCase: [
        "self service",
        "self checkout",
        "automated ordering",
        "customer facing",
        "unattended",
        "line busting",
        "queue reduction",
        "contactless ordering",
        "customer autonomy",
        "high volume processing",
        "24/7 service"
      ],
      keywords: [
        "kiosk",
        "self service",
        "touchscreen",
        "automated",
        "self checkout",
        "unattended",
        "customer operated",
        "standalone",
        "autonomous",
        "interactive",
        "self order"
      ],
      industries: {
        includes: function (industry: string): boolean {
          throw new Error("Function not implemented.");
        },
        map: function (arg0: (ind: any, i: any) => import("react").JSX.Element): import("react").ReactNode {
          throw new Error("Function not implemented.");
        },
        businessTypes: [],
        useCase: [],
        keywords: []
      }
    },
    relatedProducts: ["starprinter", "kds"],
    primaryCategory: "selfservice",
    size: "large",
    priority: 95,
    cta: "Learn More",
    image: "/kiosk.jpg"
  }
];

// Enhanced search function with improved contextual understanding
export function findRelatedProducts(search: string, maxResults = 5): PosProduct[] {
  // Return all products for empty searches
  if (!search || search.trim() === '') {
    return posProducts
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxResults);
  }

  const searchLower = search.toLowerCase().trim();
  const words = searchLower.split(/\s+/);
  
  // Business type mappings - connect generic terms to specific business types
  const businessMappings: Record<string, string[]> = {
    'lawyer': ['service business', 'professional service', 'small business', 'legal office', 'attorney'],
    'attorney': ['service business', 'professional service', 'small business', 'legal office', 'lawyer'],
    'legal': ['service business', 'professional service', 'small business', 'legal office', 'lawyer', 'attorney'],
    'accountant': ['service business', 'professional service', 'small business', 'tax preparer', 'tax accountant'],
    'tax': ['service business', 'professional service', 'tax preparer', 'accountant', 'tax accountant'],
    'restaurant': ['restaurant', 'food service', 'dining', 'eatery', 'cafe'],
    'cafe': ['coffee shop', 'cafe', 'small business', 'quick service'],
    'retail': ['retail', 'small retail', 'boutique', 'store', 'shop'],
    'shop': ['retail', 'small retail', 'boutique', 'store'],
    'store': ['retail', 'small retail', 'boutique', 'shop'],
    'bar': ['bar', 'pub', 'restaurant', 'tavern', 'nightclub'],
    'salon': ['salon', 'service business', 'small business', 'spa', 'barber shop'],
    'food truck': ['food truck', 'mobile business', 'quick service', 'mobile food'],
    'mobile': ['mobile business', 'pop up shop', 'service provider', 'field service'],
    'professional': ['service business', 'professional service', 'lawyer', 'accountant', 'consultant'],
    'doctor': ['service business', 'professional service', 'healthcare', 'medical practice', 'dental office'],
    'medical': ['service business', 'professional service', 'healthcare', 'doctor\'s office', 'dental office'],
    'office': ['service business', 'professional service', 'small business', 'consultant']
  };
  
  // Find expanded business types based on the search
  let expandedBusinessTypes: string[] = [];
  for (const word of words) {
    const mappings = businessMappings[word];
    if (mappings) {
      expandedBusinessTypes = [...expandedBusinessTypes, ...mappings];
    }
  }
  
  // Check for profession-related terms that might not directly match
  const isProfessionalService = words.some(word => 
    ['lawyer', 'attorney', 'legal', 'accountant', 'doctor', 'dentist', 'consultant', 'therapist', 'professional', 'tax', 'medical', 'realtor', 'real estate', 'office'].includes(word)
  );
  
  const isRetail = words.some(word => 
    ['shop', 'store', 'retail', 'boutique', 'goods', 'products', 'merchandise', 'clothing', 'sell', 'sales'].includes(word)
  );
  
  const isFood = words.some(word => 
    ['restaurant', 'cafe', 'food', 'dining', 'coffee', 'bar', 'kitchen', 'bistro', 'catering', 'eatery', 'cafeteria'].includes(word)
  );
  
  const isMobile = words.some(word => 
    ['mobile', 'portable', 'on-site', 'field', 'travel', 'moving', 'anywhere', 'onsite', 'offsite', 'remote'].includes(word)
  );

  const scored = posProducts.map((product) => {
    let score = 0;
    
    // Base scoring from original logic
    for (const w of words) {
      // +4 for matching a businessType
      product.searchTerms.businessTypes.forEach((term) => {
        if (term.toLowerCase().includes(w)) {
          score += 4;
        }
      });
      
      // Check expanded business types (from mappings)
      if (expandedBusinessTypes.length > 0) {
        expandedBusinessTypes.forEach(expType => {
          if (product.searchTerms.businessTypes.some(bt => bt.toLowerCase().includes(expType.toLowerCase()))) {
            score += 3;
          }
        });
      }
      
      // +3 for matching a useCase
      product.searchTerms.useCase.forEach((term) => {
        if (term.toLowerCase().includes(w)) {
          score += 3;
        }
      });
      
      // +2 for matching a keyword
      product.searchTerms.keywords.forEach((term) => {
        if (term.toLowerCase().includes(w)) {
          score += 2;
        }
      });
      
      // +5 for matching product name
      if (product.name.toLowerCase().includes(w)) {
        score += 5;
      }
      
      // +1 for matching best for
      product.bestFor.forEach((item) => {
        if (item.toLowerCase().includes(w)) {
          score += 1;
        }
      });
    }
    
    // Context-based scoring
    if (isProfessionalService) {
      // Professional services usually need compact, mobile, or simple solutions
      if (product.identifier === 'mini3' || product.identifier === 'flex4') {
        score += 8;
      }
      
      // Penalize inappropriate products for professional services
      if (product.identifier === 'kiosk' || product.identifier === 'kds' || product.identifier === 'starprinter') {
        score -= 5;
      }
    }
    
    if (isRetail) {
      // Retail typically needs POS with inventory
      if (product.identifier === 'mini3' || product.identifier === 'solo') {
        score += 5;
      }
      
      // Self-service can also work for retail
      if (product.identifier === 'kiosk') {
        score += 3;
      }
    }
    
    if (isFood) {
      // Food service needs vary but kitchen products are relevant
      if (product.identifier === 'kds' || product.identifier === 'starprinter') {
        score += 4;
      }
      
      if (product.identifier === 'duo2' || product.identifier === 'solo') {
        score += 5;
      }
    }
    
    if (isMobile) {
      // Mobile needs portable solutions
      if (product.identifier === 'flex4') {
        score += 10;
      }
    }
    
    // If we have no specific context yet still have search terms,
    // boost mini and flex as they're versatile options
    if (score === 0 && searchLower.length > 0) {
      if (product.identifier === 'mini3' || product.identifier === 'flex4') {
        score += 3; // Default fallback options
      }
    }
    
    // Multiply final score by priority factor
    score *= product.priority / 50;
    
    return { product, score };
  });

  const results = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((item) => item.product);
  
  // If no results, return the most versatile products as fallback
  if (results.length === 0) {
    return posProducts
      .filter(p => ['mini3', 'flex4'].includes(p.identifier))
      .slice(0, maxResults);
  }
  
  return results;
}

// Complementary products is unchanged
export function getComplementaryProducts(
  productId: string,
  maxResults: number = 3
): PosProduct[] {
  const product = posProducts.find((p) => p.identifier === productId);
  if (!product) return [];
  return product.relatedProducts
    .map((id) => posProducts.find((p) => p.identifier === id))
    .filter((p): p is PosProduct => p !== undefined)
    .slice(0, maxResults);
}

// Preprocessing function to clean user queries
export function preprocessQuery(query: string): string {
  // Remove common filler phrases
  return query
    .toLowerCase()
    .replace(/i am a|i'm a|i need a|looking for|we are a|we need|i want|we want|i have a|we have a/gi, '')
    .trim();
}