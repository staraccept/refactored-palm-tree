// posProducts.ts

export interface PosProduct {
    name: string;
    identifier: string;
    bestFor: string[];
    features: string[];
    searchTerms: {
      businessTypes: string[];
      useCase: string[];
      keywords: string[];
    };
    relatedProducts: string[];
    primaryCategory: 'pos' | 'peripheral' | 'mobile' | 'selfservice';
    size: 'compact' | 'standard' | 'large';
    priority: number;
    cta: string;
    image?: string;
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
                "restaurant", "fine dining", "bar and grill", "catering", "bakery", 
                "hotel restaurant", "autobody shop", "mechanic", "tax accountant"
            ],
            useCase: [
                "table service", "full service", "multi station", "inventory management", 
                "customer tracking", "high transaction volume"
            ],
            keywords: [
                "duo", "dual screen", "customer display", "table tracking", 
                "staff management", "inventory", "restaurant pos"
            ]
        },
        relatedProducts: ["kds", "starprinter"],
        primaryCategory: "pos",
        size: "large",
        priority: 100,
        cta: "Learn More",
        image: "/full-service-pos.jpg"
    },
    {
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
                "food truck", "mobile business", "event vendor", "mechanic", 
                "accountant", "tax preparation", "freelancer", "service provider"
            ],
            useCase: [
                "mobile", "portable", "tableside", "on-the-go transactions", 
                "handheld checkout", "client billing"
            ],
            keywords: [
                "flex", "handheld", "portable", "battery", "mobile", "camera scanner"
            ]
        },
        relatedProducts: ["mini3"],
        primaryCategory: "mobile",
        size: "compact",
        priority: 85,
        cta: "Learn More",
        image: "/handheldpos.jpg"
    }
];

// Enhanced search function with broader business type handling
export function findRelatedProducts(search: string, maxResults = 5): PosProduct[] {
    const words = search.toLowerCase().split(/\s+/);
    const scored = posProducts.map((product) => {
        let score = 0;
        for (const w of words) {
            product.searchTerms.businessTypes.forEach((term) => {
                if (term.toLowerCase().includes(w)) {
                    score += 4;  // Increased weight for business types
                }
            });
            product.searchTerms.useCase.forEach((term) => {
                if (term.toLowerCase().includes(w)) {
                    score += 3;  // Medium weight for use cases
                }
            });
            product.searchTerms.keywords.forEach((term) => {
                if (term.toLowerCase().includes(w)) {
                    score += 2;  // Lower weight for keywords
                }
            });
        }
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
    maxResults: number = 3
): PosProduct[] {
    const product = posProducts.find((p) => p.identifier === productId);
    if (!product) return [];
    return product.relatedProducts
        .map((id) => posProducts.find((p) => p.identifier === id))
        .filter((p): p is PosProduct => p !== undefined)
        .slice(0, maxResults);
}
