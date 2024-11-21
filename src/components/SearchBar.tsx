import { Search } from "lucide-react";
import { motion } from "framer-motion";

export const SearchBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or cuisines..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-primary/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow text-secondary"
        />
      </div>
    </motion.div>
  );
};