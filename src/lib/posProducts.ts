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
    relatedProducts: string[] // identifiers of complementary products
    primaryCategory: 'pos' | 'peripheral' | 'mobile' | 'selfservice'
    size: 'compact' | 'standard' | 'large'
    priority: number // Used for ranking within matching results
    cta: string
    image?: string
  }
  
  // Base features shared across most POS devices
  const baseFeatures = {
    connectivity: [
      "WiFi Connectivity",
      "4G LTE Support"
    ],
    payments: [
      "Apple Pay, Google Pay, Samsung Pay Integration",
      "Tap-to-Pay Capability",
      "EMV (Chip) and Magstripe Support"
    ],
    hardware: [
      "Built-in Barcode Scanner",
      "Built-in Receipt Printer (supports text & email receipts)"
    ],
    system: [
      "Modular Expandability with Live Sync to Online Dashboard"
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
        "High-Volume Full-Service Restaurants",
        "Multi-Station Restaurant Setups",
        "Fine Dining Establishments"
      ],
      features: combineFeatures([
        "Dual-screen system with customer-facing display",
        "High-performance processor for peak hour operations",
        "Advanced inventory tracking and real-time reporting",
        "Staff management with role-based permissions",
        "Table management and coursing support"
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
          "coursing",
          "inventory management"
        ],
        keywords: [
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
      priority: 100, // Flagship product
      cta: "Get a Quote",
      image: "/full-service-pos.jpg"
    },
    {
      name: "Clover Station Solo",
      identifier: "solo",
      bestFor: [
        "High-Volume Bars",
        "Quick-Service Restaurants",
        "Fast-Casual Dining"
      ],
      features: combineFeatures([
        "Large 14-inch HD touchscreen",
        "Advanced tip management and split payment support",
        "Customizable quick-menu interface",
        "Bar tab management system",
        "High-speed order processing"
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
          "tab management",
          "fast paced",
          "high volume"
        ],
        keywords: [
          "single screen",
          "tips",
          "split payments",
          "bar tabs",
          "quick menu"
        ]
      },
      relatedProducts: ["kds", "starprinter"],
      primaryCategory: "pos",
      size: "standard",
      priority: 90,
      cta: "See Pricing",
      image: "/bar-service-pos.jpg"
    },
    {
      name: "Clover Mini 3",
      identifier: "mini3",
      bestFor: [
        "Space-Conscious Retail",
        "Coffee Shops",
        "Small Service Businesses"
      ],
      features: combineFeatures([
        "Compact 7-inch HD display",
        "Space-saving vertical design",
        "Optional customer-facing display",
        "Retail inventory management",
        "Customer loyalty program integration"
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
          "small",
          "compact",
          "space saving",
          "counter top",
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
      name: "Clover Flex 4",
      identifier: "flex4",
      bestFor: [
        "Mobile Food Service",
        "Table-Side Ordering",
        "Delivery Operations",
        "Pop-Up Retail"
      ],
      features: combineFeatures([
        "5-inch portable touchscreen",
        "12+ hour battery life",
        "IP54 dust and water resistance",
        "Cellular backup connectivity",
        "Built-in camera for inventory scanning"
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
          "outdoor",
          "on the go",
          "table service"
        ],
        keywords: [
          "handheld",
          "portable",
          "battery",
          "mobile",
          "wireless",
          "camera"
        ]
      },
      relatedProducts: ["mini3"],
      primaryCategory: "mobile",
      size: "compact",
      priority: 85,
      cta: "Try a Demo",
      image: "/handheldpos.jpg"
    },
    {
      name: "Star Kitchen Printer",
      identifier: "starprinter",
      bestFor: [
        "High-Volume Kitchen Operations",
        "Multi-Station Restaurants",
        "Quick-Service Kitchens"
      ],
      features: [
        "250mm/second print speed",
        "Auto-cutter with partial cut",
        "Heat and splash resistant",
        "Direct thermal printing - no ink needed",
        "Multiple print station support",
        "Auto status monitoring"
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
      cta: "Get a Quote",
      image: "/kitchenprinter.jpg"
    },
    {
      name: "Clover Kitchen Display",
      identifier: "kds",
      bestFor: [
        "High-Volume Restaurant Kitchens",
        "Multi-Station Food Preparation",
        "Quick-Service Production Lines"
      ],
      features: [
        "15-inch HD heat-resistant display",
        "Real-time order management",
        "Customizable station routing",
        "Order timing and tracking",
        "Recipe display integration",
        "Production performance metrics"
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
          "KDS",
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
      cta: "See Pricing",
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
        "22-inch HD touchscreen",
        "ADA-compliant design",
        "Custom branding options",
        "Smart upsell prompts",
        "Multiple language support",
        "Customer loyalty integration"
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
      cta: "Try a Demo",
      image: "/kiosk.jpg"
    }
  ]
  
  // Helper function to find related products for a search
  export const findRelatedProducts = (
    search: string,
    maxResults: number = 3
  ): PosProduct[] => {
    const searchLower = search.toLowerCase()
    
    // Score each product based on search term matches
    const scoredProducts = posProducts.map(product => {
      let score = 0
      
      // Check business types
      product.searchTerms.businessTypes.forEach(term => {
        if (term.toLowerCase().includes(searchLower)) {
          score += 3
        }
      })
      
      // Check use cases
      product.searchTerms.useCase.forEach(term => {
        if (term.toLowerCase().includes(searchLower)) {
          score += 2
        }
      })
      
      // Check keywords
      product.searchTerms.keywords.forEach(term => {
        if (term.toLowerCase().includes(searchLower)) {
          score += 1
        }
      })
      
      // Boost score based on product priority
      score *= (product.priority / 50)
      
      return { product, score }
    })
    
    // Sort by score and return top results
    return scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.product)
  }
  
  // Helper function to get complementary products
  export const getComplementaryProducts = (
    productId: string,
    maxResults: number = 2
  ): PosProduct[] => {
    const product = posProducts.find(p => p.identifier === productId)
    if (!product) return []
    
    return product.relatedProducts
      .map(id => posProducts.find(p => p.identifier === id))
      .filter((p): p is PosProduct => p !== undefined)
      .slice(0, maxResults)
  }