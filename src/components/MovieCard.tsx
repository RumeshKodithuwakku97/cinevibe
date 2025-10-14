import React from 'react';
import { Movie } from '../types/artist';
import { Icon } from './IconSystem';

interface MovieCardProps {
    movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    return (
        <div className="movie-card">
            <div className="movie-card-poster" style={{ backgroundImage: `url(${movie.posterUrl})` }}>
                <div className="rating-badge">
                    <Icon name="star" size="xs" />
                    <span>{movie.rating.toFixed(1)}</span>
                </div>
            </div>
            <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-year">{movie.releaseYear}</p>
            </div>
            <div className="movie-card-overlay">
                <button className="btn btn-primary"><Icon name="play" size="sm" /> View Details</button>
            </div>
        </div>
    );
};