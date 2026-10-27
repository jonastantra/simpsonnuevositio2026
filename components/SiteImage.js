import images from '@/data/image-manifest.json';
export default function SiteImage({ src, alt = '', eager = false, sizes = '(max-width: 640px) 50vw, 25vw', className = '', ...props }) {
  const image = images[src];
  return <img src={image?.src || src} srcSet={image?.srcSet} sizes={image ? sizes : undefined} width={image?.width || 480} height={image?.height || 270} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" className={className} {...props} />;
}
