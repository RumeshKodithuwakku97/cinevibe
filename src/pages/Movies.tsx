import React, { useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types/artist';
import { Icon } from '../components/IconSystem';

const sampleMovies: Movie[] = [
    { id: '1', title: 'Blade Runner 2049', releaseYear: 2017, director: 'Denis Villeneuve', genre: ['Sci-Fi', 'Thriller'], posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', backdropUrl: '', summary: '', rating: 8.0 },
    { id: '2', title: 'Everything Everywhere All at Once', releaseYear: 2022, director: 'Daniels', genre: ['Action', 'Adventure', 'Sci-Fi'], posterUrl: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVeX4BUbRcOOOwp.jpg', backdropUrl: '', summary: '', rating: 8.1 },
    { id: '3', title: 'Parasite', releaseYear: 2019, director: 'Bong Joon Ho', genre: ['Thriller', 'Drama'], posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdropUrl: '', summary: '', rating: 8.5 },
    { id: '4', title: 'The Grand Budapest Hotel', releaseYear: 2014, director: 'Wes Anderson', genre: ['Comedy', 'Drama'], posterUrl: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', backdropUrl: '', summary: '', rating: 8.1 },
];

const allGenres = ['All', 'Sci-Fi', 'Thriller', 'Action', 'Adventure', 'Drama', 'Comedy'];

const Movies: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');

    const filteredMovies = sampleMovies.filter(movie => {
        const matchesGenre = activeGenre === 'All' || movie.genre.includes(activeGenre);
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesGenre && matchesSearch;
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Explore Movies</h1>
                <p>Browse, review, and discuss your favorite films from our curated library.</p>
            </div>

            <div className="filter-bar">
                <div className="search-box">
                    <Icon name="search" size="md" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="genre-filters">
                    {allGenres.map(genre => (
                        <button
                            key={genre}
                            className={`genre-button ${activeGenre === genre ? 'active' : ''}`}
                            onClick={() => setActiveGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="movies-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <p className="no-results-message">No movies found. Try adjusting your filters.</p>
                )}
            </div>
        </div>
    );
};

export default Movies;