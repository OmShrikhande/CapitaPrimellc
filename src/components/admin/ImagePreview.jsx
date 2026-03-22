import React, { useState } from 'react';
import { getImageURL } from '../../context/api';

/**
 * ImagePreview Component
 * A reusable component for displaying asset images with error handling and loading states
 * @param {string} imagePath - The image path from the backend (relative or full URL)
 * @param {string} alt - Alternative text for the image
 * @param {string} className - CSS classes to apply to the container
 * @param {function} onError - Optional callback when image fails to load
 * @param {function} onLoad - Optional callback when image successfully loads
 * @param {string} fallbackEmoji - Emoji to show as fallback
 */
const ImagePreview = ({
  imagePath,
  alt = 'Asset image',
  className = 'w-full h-full object-cover',
  onError = null,
  onLoad = null,
  fallbackEmoji = '🖼️'
}) => {
  const [imageState, setImageState] = useState('loading'); // loading, loaded, error
  const [errorMessage, setErrorMessage] = useState('');

  const imageURL = getImageURL(imagePath);

  const handleImageLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleImageError = (error) => {
    console.error(`Image failed to load: ${imagePath}`, error);
    setImageState('error');
    setErrorMessage('Image failed to load');
    onError?.(error);
  };

  // If no image path provided, show fallback emoji
  if (!imagePath) {
    return <span className="text-4xl">{fallbackEmoji}</span>;
  }

  return (
    <>
      {/* Loading state */}
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {imageState === 'error' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center p-2">
          <div className="flex flex-col gap-1">
            <span className="text-xl">❌</span>
            <span className="text-[8px] text-gray-400">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Image */}
      <img
        key={imageURL}
        src={imageURL}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          opacity: imageState === 'loaded' ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
        }}
      />
    </>
  );
};

export default ImagePreview;
