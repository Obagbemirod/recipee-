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
    alternateNames: ["ñame", "igname", "dioscorea"],
    regionalNames: {
      "ghana": "yam",
      "nigeria": "yam",
      "caribbean": "ñame"
    }
  },
  "scotch_bonnet": {
    alternateNames: ["hot pepper", "ghost pepper", "habanero", "ata rodo"],
    regionalNames: {
      "ghana": "kpakpo shito",
      "nigeria": "ata rodo",
      "jamaica": "scotch bonnet"
    }
  },
  "cassava": {
    alternateNames: ["manioc", "yuca", "mandioca"],
    regionalNames: {
      "nigeria": "eba",
      "ghana": "bankye",
      "brazil": "mandioca"
    }
  },
  "palm_oil": {
    alternateNames: ["red oil", "dendê oil"],
    regionalNames: {
      "nigeria": "epo pupa",
      "ghana": "kube",
      "brazil": "dendê"
    }
  },
  "spinach": {
    alternateNames: ["amaranth", "callaloo"],
    regionalNames: {
      "nigeria": "efo tete",
      "ghana": "aleefu",
      "caribbean": "callaloo"
    }
  }
};

export const normalizeIngredient = (ingredient: string, country: string = "nigeria"): string => {
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