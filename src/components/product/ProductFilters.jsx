import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || ''; // 'inventory' | 'custom' | ''
  const sortBy = searchParams.get('sortBy') || 'featured';

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...CATEGORIES.map((cat) => ({ label: cat, value: cat })),
  ];

  const typeOptions = [
    { label: 'All Order Types', value: '' },
    { label: 'In-Stock Inventory', value: 'inventory' },
    { label: 'Made to Order', value: 'custom' },
  ];

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A to Z', value: 'name_asc' },
    { label: 'Name: Z to A', value: 'name_desc' },
  ];

  const isFiltered = search || category || type || sortBy !== 'featured';

  return (
    <div className="bg-white p-5 rounded-2xl border border-walnut-brown/10 shadow-xs space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search */}
        <Input
          placeholder="Search cots, wardrobes, tables..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          label="Search Products"
        />

        {/* Category select */}
        <Input
          type="select"
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          options={categoryOptions}
          label="Category"
        />

        {/* Type select */}
        <Input
          type="select"
          value={type}
          onChange={(e) => updateParam('type', e.target.value)}
          options={typeOptions}
          label="Availability Type"
        />

        {/* Sort select */}
        <Input
          type="select"
          value={sortBy}
          onChange={(e) => updateParam('sortBy', e.target.value)}
          options={sortOptions}
          label="Sort By"
        />

      </div>

      {isFiltered && (
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
