import { motion } from "framer-motion";
import { CategoryCard } from "./CategoryCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface CategoryListProps {
  categories: any[];
  onNewTopic: (categoryId: string, isPremium: boolean) => void;
  filter?: "all" | "general" | "premium";
}

export function CategoryList({ categories, onNewTopic, filter = "all" }: CategoryListProps) {
  const filteredCategories = categories?.filter((category) => {
    if (filter === "general") return !category.is_premium;
    if (filter === "premium") return category.is_premium;
    return true;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      {filteredCategories?.map((category) => (
        <motion.div key={category.id} variants={item}>
          <CategoryCard category={category} onNewTopic={onNewTopic} />
        </motion.div>
      ))}
    </motion.div>
  );
}