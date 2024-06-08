import React from 'react';
import { CircularProgress, Typography } from '@mui/material';

export default function RatingCircle({ rating, color, title }) {
    const ratingPorcentaje = rating * 10;

    return (
        <>
            <div>
                {title && <Typography variant="body2">{title}</Typography>}
            </div>
            <div style={{ position: 'relative', width: 50, height: 50 }}>
                <CircularProgress
                    variant="determinate"
                    value={ratingPorcentaje}
                    size={50}
                    thickness={4}
                    style={{ position: 'absolute', color: color }}
                />
                <Typography
                    variant="body2"
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: color }}
                >
                    {rating}
                </Typography>
            </div>
        </>
    );
}
