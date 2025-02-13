// posProducts.ts

export interface PosProduct {
    name: string
    identifier: string
    bestFor: string[]
    features: string[]
    searchTerms: {
      businessTypes: string[]
      useCase: string[]
      keywords: string[]
    }
    relatedProducts: string[]
    primaryCategory: 'pos' | 'peripheral' | 'mobile' | 'selfservice'
    size: 'compact' | 'standard' | 'large'
    priority: number
    cta: string
    image?: string
  }
  
  // Simplified base features
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
  }
  
  const combineFeatures = (uniqueFeatures: string[] = []): string[] => {
    return [
      ...baseFeatures.connectivity,
      ...baseFeatures.payments,
      ...baseFeatures.hardware,
      ...baseFeatures.system,
      ...uniqueFeatures
    ]
  }
  
  export const posProducts: PosProduct[] = [
    {
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
        businessTypes: [
          "restaurant",
          "fine dining",
          "full service restaurant",
          "casual dining",
          "bistro",
          "bar and grill"
        ],
        useCase: [
          "table service",
          "full service",
          "high volume",
          "multi station",
          "table management",
          "inventory management"
        ],
        keywords: [
          "duo",
          "dual screen",
          "customer display",
          "table tracking",
          "staff management",
          "inventory"
        ]
      },
      relatedProducts: ["kds", "starprinter"],
      primaryCategory: "pos",
      size: "large",
      priority: 100,
      cta: "Learn More",
      // Ensure the filename matches what's in /public
      image: "/full-service-pos.jpg"
    },
    {
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
        businessTypes: [
          "bar",
          "pub",
          "quick service restaurant",
          "fast casual",
          "cafe",
          "coffee shop",
          "food truck"
        ],
        useCase: [
          "quick service",
          "counter service",
          "bar service",
          "fast paced",
          "high volume"
        ],
        keywords: [
          "solo",
          "single screen",
          "tips",
          "bar tabs",
          "quick menu"
        ]
      },
      relatedProducts: ["kds", "starprinter"],
      primaryCategory: "pos",
      size: "standard",
      priority: 90,
      cta: "Learn More",
      image: "/bar-service-pos.jpg"
    },
    {
      // Renamed for partial matching
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
        businessTypes: [
          "coffee shop",
          "cafe",
          "small retail",
          "boutique",
          "salon",
          "service business",
          "small business"
        ],
        useCase: [
          "counter service",
          "retail checkout",
          "small space",
          "single station",
          "compact setup"
        ],
        keywords: [
          "mini",
          "small",
          "compact",
          "space saving",
          "retail",
          "loyalty"
        ]
      },
      relatedProducts: ["flex4"],
      primaryCategory: "pos",
      size: "compact",
      priority: 80,
      cta: "Learn More",
      image: "/minipos.jpg"
    },
    {
      // Named “Clover Flex 4,” but user might say “Clover Flex”
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
        businessTypes: [
          "food truck",
          "mobile business",
          "restaurant",
          "delivery service",
          "pop up shop",
          "event vendor",
          "market vendor"
        ],
        useCase: [
          "mobile",
          "portable",
          "tableside",
          "delivery",
          "on the go"
        ],
        keywords: [
          "flex",
          "handheld",
          "portable",
          "battery",
          "mobile",
          "camera"
        ]
      },
      relatedProducts: ["mini3"],
      primaryCategory: "mobile",
      size: "compact",
      priority: 85,
      cta: "Learn More",
      image: "/handheldpos.jpg"
    },
    {
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
          "bar"
        ],
        useCase: [
          "kitchen printing",
          "order tickets",
          "food prep",
          "kitchen management",
          "order management"
        ],
        keywords: [
          "printer",
          "kitchen printer",
          "thermal",
          "tickets",
          "automation"
        ]
      },
      relatedProducts: ["duo2", "solo", "kds"],
      primaryCategory: "peripheral",
      size: "compact",
      priority: 60,
      cta: "Learn More",
      image: "/kitchenprinter.jpg"
    },
    {
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
          "cafeteria"
        ],
        useCase: [
          "kitchen display",
          "order management",
          "food prep",
          "kitchen automation",
          "digital tickets"
        ],
        keywords: [
          "kds",
          "kitchen display",
          "digital",
          "screen",
          "order tracking"
        ]
      },
      relatedProducts: ["duo2", "solo", "starprinter"],
      primaryCategory: "peripheral",
      size: "standard",
      priority: 70,
      cta: "Learn More",
      image: "/kitchendisplay.jpg"
    },
    {
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
          "convenience store"
        ],
        useCase: [
          "self service",
          "self checkout",
          "automated ordering",
          "customer facing",
          "unattended"
        ],
        keywords: [
          "kiosk",
          "self service",
          "touchscreen",
          "automated",
          "self checkout"
        ]
      },
      relatedProducts: ["starprinter", "kds"],
      primaryCategory: "selfservice",
      size: "large",
      priority: 95,
      cta: "learn More",
      image: "/kiosk.jpg"
    }
  ]
  
  // Revised to handle *each word* in the query so “bar” or “restaurant” are caught
  export function findRelatedProducts(search: string, maxResults = 3): PosProduct[] {
    const words = search.toLowerCase().split(/\s+/); // split on spaces
    const scored = posProducts.map((product) => {
      let score = 0;
      for (const w of words) {
        // if "bar" is found in "bar" or "bar and grill" we get a match
        product.searchTerms.businessTypes.forEach((term) => {
          if (term.toLowerCase().includes(w)) {
            score += 3;
          }
        });
        product.searchTerms.useCase.forEach((term) => {
          if (term.toLowerCase().includes(w)) {
            score += 2;
          }
        });
        product.searchTerms.keywords.forEach((term) => {
          if (term.toLowerCase().includes(w)) {
            score += 1;
          }
        });
      }
      // Multiply final score by priority factor
      score *= product.priority / 50;
      return { product, score };
    });
  
    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((item) => item.product);
  }
  
  export function getComplementaryProducts(
    productId: string,
    maxResults: number = 2
  ): PosProduct[] {
    const product = posProducts.find((p) => p.identifier === productId);
    if (!product) return [];
    return product.relatedProducts
      .map((id) => posProducts.find((p) => p.identifier === id))
      .filter((p): p is PosProduct => p !== undefined)
      .slice(0, maxResults);
  }
  