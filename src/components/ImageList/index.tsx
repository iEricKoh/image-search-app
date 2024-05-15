import React from 'react';


export interface Image {
  url: string,
  id: string
}

interface ImageListProps {
  images: Image[];
}


export const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className='container'>
      {images.map((image) => (
        <img key={image.id} src={image.url}  />
      ))}
    </div>
  );
};

