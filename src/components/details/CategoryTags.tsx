interface CategoryTagsProps {
  categories?: string | string[];
}

function normalizeCategories(categories?: string | string[]) {
  if (!categories) return [];

  return Array.isArray(categories) ? categories : [categories];
}

export function CategoryTags({ categories }: CategoryTagsProps) {
  const items = normalizeCategories(categories);

  if (!items.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 text-md-custom font-medium leading-5 text-text-primary">
        <img src="/icons/profile/catogeirs.svg" alt="" className="h-5 w-5 object-contain" />
        <span>Categories</span>
      </div>
      <p className="mt-1 pl-7 text-sm-custom font-medium leading-5 text-text-secondary">
        {items.join(', ')}
      </p>
    </div>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <div className="rounded-full bg-[#505F7094] border border-[#505F70] px-3 py-1 text-sm-custom font-medium leading-4 text-white">
      {category}
    </div>
  );
}

export default CategoryTags;
