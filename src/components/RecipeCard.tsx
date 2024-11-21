import { motion } from "framer-motion";

interface RecipeCardProps {
  title: string;
  image: string;
  time: string;
  difficulty: string;
}

export const RecipeCard = ({ title, image, time, difficulty }: RecipeCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card rounded-lg overflow-hidden"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-medium bg-muted rounded-full">
            {time}
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-muted rounded-full">
            {difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-balance">{title}</h3>
        
        <button className="text-primary font-medium hover:opacity-80 transition-opacity">
          View Recipe →
        </button>
      </div>
    </motion.div>
  );
};