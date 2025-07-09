import useCategoriesVM from "@/viewmodels/ComponentViewModel/foodItem/useCategoriesViewModel";

export default function CategoryList() {
  const { categories, loading, error, fetchCategories } = useCategoriesVM();

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button onClick={fetchCategories}>Refresh Categories</button>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.title}</li>
        ))}
      </ul>
    </div>
  );
}
