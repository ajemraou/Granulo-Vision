// Product profile definitions
export interface ProductProfile {
  id: string
  name: string
  category: string
  thresholds: {
    lt_1mm_max: number
    gt_2_5mm_min: number
    gt_2_5mm_max: number
    gt_3_5mm_max: number
    gt_4mm_max: number
    color_score_min: number
  }
}

export const PRODUCTS: ProductProfile[] = [
  {
    id: "dap",
    name: "DAP (Diammonium Phosphate)",
    category: "Binary Fertilizers",
    thresholds: {
      lt_1mm_max: 8,
      gt_2_5mm_min: 60,
      gt_2_5mm_max: 75,
      gt_3_5mm_max: 20,
      gt_4mm_max: 10,
      color_score_min: 85,
    },
  },
  {
    id: "map",
    name: "MAP (Monoammonium Phosphate)",
    category: "Binary Fertilizers",
    thresholds: {
      lt_1mm_max: 7,
      gt_2_5mm_min: 62,
      gt_2_5mm_max: 78,
      gt_3_5mm_max: 18,
      gt_4mm_max: 8,
      color_score_min: 87,
    },
  },
  {
    id: "tsp",
    name: "TSP (Triple Superphosphate)",
    category: "Phosphate Fertilizers",
    thresholds: {
      lt_1mm_max: 6,
      gt_2_5mm_min: 65,
      gt_2_5mm_max: 80,
      gt_3_5mm_max: 15,
      gt_4mm_max: 7,
      color_score_min: 88,
    },
  },
  {
    id: "soluble",
    name: "Soluble & Specialty Fertilizers",
    category: "Specialty Fertilizers",
    thresholds: {
      lt_1mm_max: 5,
      gt_2_5mm_min: 70,
      gt_2_5mm_max: 85,
      gt_3_5mm_max: 12,
      gt_4mm_max: 5,
      color_score_min: 90,
    },
  },
  {
    id: "ocp-dap",
    name: "OCP-DAP 18-46",
    category: "Custom Products",
    thresholds: {
      lt_1mm_max: 7,
      gt_2_5mm_min: 63,
      gt_2_5mm_max: 77,
      gt_3_5mm_max: 17,
      gt_4mm_max: 9,
      color_score_min: 86,
    },
  },
  {
    id: "ocp-map",
    name: "OCP-MAP 52",
    category: "Custom Products",
    thresholds: {
      lt_1mm_max: 6.5,
      gt_2_5mm_min: 64,
      gt_2_5mm_max: 79,
      gt_3_5mm_max: 16,
      gt_4mm_max: 8,
      color_score_min: 87,
    },
  },
]

export function getProductById(id: string): ProductProfile | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function saveSelectedProduct(productId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedProduct", productId)
  }
}

export function getSelectedProduct(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedProduct")
  }
  return null
}
