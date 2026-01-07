"use client";

import React, { useState, useEffect } from 'react';
import SearchBar, { SearchFilters } from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { useHomes } from '@/hooks/useHomes';
import { Home } from '@/types/home';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SearchPage() {
    const { homes, loading, error } = useHomes();
    const [filteredHomes, setFilteredHomes] = useState<Home[]>([]);

    useEffect(() => {
        setFilteredHomes(homes);
    }, [homes]);

    const handleSearch = (filters: SearchFilters) => {
        let results = [...homes];

        if (filters.location) {
            const searchTerm = filters.location.toLowerCase();
            results = results.filter(
                (home) =>
                    home.namehome.toLowerCase().includes(searchTerm) ||
                    home.city.toLowerCase().includes(searchTerm) ||
                    home.address.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.priceMax) {
            results = results.filter((home) => home.price <= filters.priceMax!);
        }

        if (filters.propertyType) {
            results = results.filter((home) => home.propertytype === filters.propertyType);
        }

        setFilteredHomes(results);
    };

    return (
        <div>
            <Header />
            <SearchBar onSearch={handleSearch} />
            <SearchResults homes={filteredHomes} loading={loading} error={error} />
            <Footer />
        </div>
    );
}