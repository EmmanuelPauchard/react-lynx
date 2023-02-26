import Image from 'react-bootstrap/Image';
import './ImageGrid.css';

/**
 * The Image Grid container
 */
const ImageList = ({ urls, target, selected, handleClick }) => {
  return (
    <div className="image-grid justify-content-center flex-wrap">
      {urls.map(x =>
        <Image className={"images col-6 col-md-2 " + (selected === x ? (target === selected ? "hit" : "miss") : "")} key={x.key} src={x.url} onClick={() => handleClick(x)} />)}
    </div>);
};

export default ImageList;
