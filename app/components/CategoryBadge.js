"use client";

import { CATEGORIES } from "../constants/categories";

export default function CategoryBadge({ categoryId }) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  return (
    <span className={`category-badge category-${categoryId}`}>
      {category.icon}
      {category.name}
    </span>
  );
}
