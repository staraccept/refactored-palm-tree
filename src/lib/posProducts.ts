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
    paymentTypes: {
      swipe: boolean
      chip: boolean
      contactless: boolean
      digitalWallet: boolean
    }
    environmentalFactors?: {
      spillResistant?: boolean
      highDurability?: boolean
      fastPaced?: boolean
      lowLighting?: boolean
    }
    complementaryProducts?: string[]
    usageScenarios?: string[]
    primaryCategory: 'pos' | 'peripheral' | 'mobile' | 'selfservice'
    size: 'compact' | 'standard' | 'large'
    priority?: number
    cta: string
    image?: string
  }
  
  export const posProducts: PosProduct[] = [
    {
      name: 'Clover Station Duo 2',
      identifier: 'duo2',
      primaryCategory: 'pos',
      size: 'large',
      bestFor: [
        'High-Volume Full-Service Restaurants',
        'Multi-Station Restaurant Setups',
        'Fine Dining Establishments'
      ],
      features: [
        'Dual-screen system with customer-facing display',
        'High-performance processor for peak hour operations',
        'Advanced inventory tracking and real-time reporting',
        'Staff management with role-based permissions',
        'Table management and coursing support',
        'All payment methods supported'
      ],
      searchTerms: {
        businessTypes: [
          'restaurant',
          'fine dining',
          'full service restaurant',
          'casual dining',
          'bistro',
          'bar and grill'
        ],
        useCase: [
          'table service',
          'full service',
          'high volume',
          'multi station',
          'table management',
          'coursing',
          'inventory management'
        ],
        keywords: [
          'dual screen',
          'customer display',
          'table tracking',
          'staff management',
          'inventory'
        ]
      },
      paymentTypes: {
        swipe: true,
        chip: true,
        contactless: true,
        digitalWallet: true
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: false
      },
      complementaryProducts: ['flex4', 'kds', 'starprinter'],
      usageScenarios: [
        'Full-service restaurant operations',
        'Fine dining experience',
        'Multi-station kitchens',
        'High-volume service periods'
      ],
      cta: 'Get a Quote',
      image: '/full-service-pos.jpg'
    },
    {
      name: 'Clover Station Solo',
      identifier: 'solo',
      primaryCategory: 'pos',
      size: 'standard',
      bestFor: ['High-Volume Bars', 'Sports Bars', 'Nightclubs'],
      features: [
        'Large 14-inch HD touchscreen',
        'Advanced tip management and split payment support',
        'Customizable quick-menu interface',
        'Bar tab management system',
        'High-speed order processing',
        'Magnetic stripe and chip reader',
        'Durable design for busy bar environments',
        'Spill-resistant construction'
      ],
      searchTerms: {
        businessTypes: [
          'bar',
          'pub',
          'sports bar',
          'nightclub',
          'tavern',
          'brewery'
        ],
        useCase: [
          'bar service',
          'tab management',
          'high volume alcohol sales',
          'busy bar environment',
          'card-present transactions',
          'traditional payment methods'
        ],
        keywords: [
          'bar pos',
          'tab management',
          'split payments',
          'card swipe',
          'chip reader',
          'spill resistant'
        ]
      },
      paymentTypes: {
        swipe: true,
        chip: true,
        contactless: false,
        digitalWallet: false
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: true
      },
      complementaryProducts: ['starprinter'],
      usageScenarios: [
        'High-volume bar operations',
        'Sports bar service',
        'Nightclub transactions',
        'Traditional payment processing'
      ],
      cta: 'See Pricing',
      image: '/bar-service-pos.jpg'
    },
    {
      name: 'Clover Mini 3',
      identifier: 'mini3',
      primaryCategory: 'pos',
      size: 'compact',
      bestFor: ['Coffee Shops', 'Small Retail', 'Quick-Service Restaurants', 'Cafes'],
      features: [
        'Compact 7-inch HD display',
        'All payment types supported',
        'Space-saving vertical design',
        'Customer-facing display',
        'Quick-service optimized interface',
        'Rapid checkout process'
      ],
      searchTerms: {
        businessTypes: ['coffee shop', 'cafe', 'small retail', 'boutique', 'quick service', 'counter service'],
        useCase: ['quick service', 'counter service', 'retail checkout', 'small space', 'fast transactions'],
        keywords: ['compact', 'quick service', 'all payments', 'small footprint', 'contactless']
      },
      paymentTypes: {
        swipe: true,
        chip: true,
        contactless: true,
        digitalWallet: true
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: false
      },
      complementaryProducts: ['flex4', 'kds'],
      usageScenarios: [
        'Coffee shop counter service',
        'Quick-service restaurant',
        'Small retail checkout',
        'Cafe operations'
      ],
      cta: 'Learn More',
      image: '/minipos.jpg'
    },
    {
      name: 'Clover Flex 4',
      identifier: 'flex4',
      primaryCategory: 'mobile',
      size: 'compact',
      bestFor: [
        'Mobile POS Enhancement',
        'Table Service Restaurants',
        'Food Trucks',
        'Delivery Operations',
        'Pop-Up Retail',
        'Event Venues'
      ],
      features: [
        '5-inch HD portable touchscreen',
        'All payment types supported (tap, swipe, chip, digital wallets)',
        '12+ hour battery life',
        'IP54 dust and water resistance',
        'Cellular backup connectivity',
        'Built-in camera for inventory scanning',
        'Wireless order sending to kitchen printers',
        'Real-time sync with main POS system',
        'Table management integration',
        'Mobile checkout capability'
      ],
      searchTerms: {
        businessTypes: [
          'full service restaurant',
          'casual dining',
          'fine dining',
          'food truck',
          'cafe',
          'coffee shop',
          'quick service',
          'retail store',
          'boutique',
          'event venue'
        ],
        useCase: [
          'mobile checkout',
          'line busting',
          'tableside ordering',
          'tableside payment',
          'outdoor service',
          'delivery verification',
          'inventory management',
          'customer service enhancement',
          'table management',
          'order flexibility'
        ],
        keywords: [
          'mobile pos',
          'wireless',
          'portable',
          'all payment types',
          'battery powered',
          'flexible checkout',
          'contactless',
          'apple pay',
          'google pay'
        ]
      },
      paymentTypes: {
        swipe: true,
        chip: true,
        contactless: true,
        digitalWallet: true
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: false
      },
      complementaryProducts: ['duo2', 'solo', 'mini3', 'starprinter', 'kds'],
      usageScenarios: [
        'Primary mobile POS for food trucks',
        'Secondary device for table service',
        'Line busting during peak hours',
        'Outdoor service extension',
        'Mobile inventory management',
        'Curbside pickup verification',
        'Event ticket scanning'
      ],
      cta: 'Try a Demo',
      image: '/handheldpos.jpg'
    },
    {
      name: 'Star Kitchen Printer',
      identifier: 'starprinter',
      primaryCategory: 'peripheral',
      size: 'compact',
      bestFor: [
        'High-Volume Kitchen Operations',
        'Multi-Station Restaurants',
        'Quick-Service Kitchens'
      ],
      features: [
        '250mm/second print speed',
        'Auto-cutter with partial cut',
        'Heat and splash resistant',
        'Direct thermal printing - no ink needed',
        'Multiple print station support',
        'Auto status monitoring'
      ],
      searchTerms: {
        businessTypes: [
          'restaurant',
          'cafe',
          'quick service',
          'food service',
          'kitchen',
          'bar'
        ],
        useCase: [
          'kitchen printing',
          'order tickets',
          'food prep',
          'kitchen management',
          'order management'
        ],
        keywords: [
          'printer',
          'kitchen printer',
          'thermal',
          'tickets',
          'automation'
        ]
      },
      paymentTypes: {
        swipe: false,
        chip: false,
        contactless: false,
        digitalWallet: false
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: true
      },
      complementaryProducts: ['duo2', 'solo', 'mini3', 'flex4', 'kds'],
      usageScenarios: [
        'Kitchen order printing',
        'Food preparation tracking',
        'Multiple station coordination',
        'Order routing'
      ],
      cta: 'Get a Quote',
      image: '/kitchenprinter.jpg'
    },
    {
      name: 'Clover Kitchen Display',
      identifier: 'kds',
      primaryCategory: 'peripheral',
      size: 'standard',
      bestFor: [
        'High-Volume Restaurant Kitchens',
        'Multi-Station Food Preparation',
        'Quick-Service Production Lines'
      ],
      features: [
        '15-inch HD heat-resistant display',
        'Real-time order management',
        'Customizable station routing',
        'Order timing and tracking',
        'Recipe display integration',
        'Production performance metrics'
      ],
      searchTerms: {
        businessTypes: [
          'restaurant',
          'quick service',
          'fast casual',
          'food service',
          'kitchen',
          'cafeteria'
        ],
        useCase: [
          'kitchen display',
          'order management',
          'food prep',
          'kitchen automation',
          'digital tickets'
        ],
        keywords: [
          'KDS',
          'kitchen display',
          'digital',
          'screen',
          'order tracking'
        ]
      },
      paymentTypes: {
        swipe: false,
        chip: false,
        contactless: false,
        digitalWallet: false
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: true
      },
      complementaryProducts: ['duo2', 'solo', 'mini3', 'flex4', 'starprinter'],
      usageScenarios: [
        'Digital order management',
        'Kitchen workflow optimization',
        'Multi-station coordination',
        'Production timing'
      ],
      cta: 'See Pricing',
      image: '/kitchendisplay.jpg'
    },
    {
      name: 'Clover Kiosk',
      identifier: 'kiosk',
      primaryCategory: 'selfservice',
      size: 'large',
      bestFor: [
        'Quick-Service Restaurants',
        'Fast-Casual Dining',
        'High-Traffic Retail'
      ],
      features: [
        '22-inch HD touchscreen',
        'All payment types supported',
        'ADA-compliant design',
        'Custom branding options',
        'Smart upsell prompts',
        'Multiple language support',
        'Customer loyalty integration'
      ],
      searchTerms: {
        businessTypes: [
          'quick service restaurant',
          'fast casual',
          'retail',
          'cafeteria',
          'food court',
          'convenience store'
        ],
        useCase: [
          'self service',
          'self checkout',
          'automated ordering',
          'customer facing',
          'unattended'
        ],
        keywords: [
          'kiosk',
          'self service',
          'touchscreen',
          'automated',
          'self checkout'
        ]
      },
      paymentTypes: {
        swipe: true,
        chip: true,
        contactless: true,
        digitalWallet: true
      },
      environmentalFactors: {
        spillResistant: true,
        highDurability: true,
        fastPaced: true,
        lowLighting: false
      },
      complementaryProducts: ['starprinter', 'kds'],
      usageScenarios: [
        'Self-service ordering',
        'Peak hour queue management',
        'Multilingual service',
        'Automated upselling'
      ],
      cta: 'Try a Demo',
      image: '/kiosk.jpg'
    }
  ]
   