// Mapping of meal types to relevant images
export const mealImages = {
  breakfast: {
    oatmeal: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    yogurt: "https://images.unsplash.com/photo-1626381332631-c2b3ce1e3b52",
    eggs: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    pancakes: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    smoothie: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4",
  },
  lunch: {
    salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af",
    soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
    bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f",
  },
  dinner: {
    pasta: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
    fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    chicken: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8",
    steak: "https://images.unsplash.com/photo-1544025162-d76694265947",
    vegetarian: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  }
};

export const getImageForMeal = (mealName: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
  const lowerMealName = mealName.toLowerCase();
  const images = mealImages[mealType];
  
  // Find the most appropriate image based on meal name keywords
  const matchingKey = Object.keys(images).find(key => 
    lowerMealName.includes(key)
  );
  
  return matchingKey ? images[matchingKey] : images[Object.keys(images)[0]];
};