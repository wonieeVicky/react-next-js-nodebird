import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img src={`${images[0].src}`} alt={images[0].src} onClick={onZoom} role="presentation" />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          src={`${images[0].src}`}
          style={{ width: '50%', display: 'inline-block' }}
          alt={images[0].src}
          onClick={onZoom}
          role="presentation"
        />
        <img
          src={`${images[1].src}`}
          style={{ width: '50%', display: 'inline-block' }}
          alt={images[1].src}
          onClick={onZoom}
          role="presentation"
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <>
      <div>
        <img
          src={`${images[0].src}`}
          style={{ width: '50%', display: 'inline-block' }}
          alt={images[0].src}
          onClick={onZoom}
          role="presentation"
        />
        <div
          role="presentation"
          onClick={onZoom}
          style={{
            display: 'inline-block',
            width: '50%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
