interface IngredientMapping {
  [key: string]: {
    alternateNames: string[];
    regionalNames: {
      [country: string]: string;
    };
  };
}

export const ingredientMappings: IngredientMapping = {
  "eggplant": {
    alternateNames: ["aubergine", "garden egg", "brinjal"],
    regionalNames: {
      "ghana": "garden eggs",
      "nigeria": "eggplant",
      "india": "brinjal"
    }
  },
  "yam": {
    alternateNames: ["ñame", "igname"],
    regionalNames: {
      "ghana": "yam",
      "nigeria": "yam",
      "caribbean": "ñame"
    }
  },
  "scotch_bonnet": {
    alternateNames: ["hot pepper", "ghost pepper", "habanero"],
    regionalNames: {
      "ghana": "kpakpo shito",
      "nigeria": "ata rodo",
      "jamaica": "scotch bonnet"
    }
  }
};

export const normalizeIngredient = (ingredient: string, country: string = "ghana"): string => {
  // Convert to lowercase for case-insensitive matching
  const normalizedInput = ingredient.toLowerCase();

  // Find the ingredient entry where either the key matches or it's in alternate names
  const entry = Object.entries(ingredientMappings).find(([key, value]) => {
    return key.toLowerCase() === normalizedInput ||
           value.alternateNames.some(name => name.toLowerCase() === normalizedInput);
  });

  if (entry) {
    // Return the regional name if it exists, otherwise return the standard name
    return entry[1].regionalNames[country.toLowerCase()] || entry[0];
  }

  // If no mapping is found, return the original input
  return ingredient;
};