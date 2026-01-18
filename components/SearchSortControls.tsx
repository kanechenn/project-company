// components/SearchSortControls.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface SearchSortControlsProps {
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
  searchParams: URLSearchParams;
}

const SearchSortControls: React.FC<SearchSortControlsProps> = ({ 
  currentSearch, 
  currentSortBy, 
  currentSortOrder, 
  searchParams 
}) => {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', search);
    params.set('page', '1'); // Reset ke halaman 1 saat search
    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newSortOrder = 
      newSortBy === currentSortBy 
        ? (currentSortOrder === 'asc' ? 'desc' : 'asc')
        : 'desc'; // Default desc jika ganti kolom

    params.set('sortBy', newSortBy);
    params.set('sortOrder', newSortOrder);
    router.push(`/?${params.toString()}`);
  };

  const renderSortIcon = (key: string) => {
    if (currentSortBy === key) {
      return currentSortOrder === 'asc' ? '▲' : '▼';
    }
    return '⇅';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="w-full md:w-1/3">
        <Input 
          label="Search (Type PAC, SN, Lokasi)"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari data PAC..."
        />
      </form>

      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          onClick={() => handleSortChange('created_at')}
        >
          Sort by Tanggal {renderSortIcon('created_at')}
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => handleSortChange('lantai')}
        >
          Sort by Lantai {renderSortIcon('lantai')}
        </Button>
      </div>
    </div>
  );
};

export default SearchSortControls;