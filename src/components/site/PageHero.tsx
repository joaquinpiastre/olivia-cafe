import Image from 'next/image';
import { img } from '@/lib/site';

type Props = { eyebrow?: string; title: string; script?: string; description?: string; image?: string; imageAlt?: string; imagePosition?: string };

export function PageHero({ eyebrow, title, script, description, image, imageAlt = '', imagePosition }: Props) {
  return (
    <section className="relative overflow-hidden bg-cream-100">
      {image && (
        <>
          <Image src={img(image)} alt={imageAlt} fill priority sizes="100vw" className="object-cover" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/80 via-cocoa/55 to-cocoa/20" />
        </>
      )}
      <div className={`container-x relative py-16 sm:py-24 ${image ? 'text-white' : ''}`}>
        {eyebrow && <p className={`eyebrow ${image ? '!text-olivia-green' : ''}`}>{eyebrow}</p>}
        <h1 className={`mt-3 max-w-2xl text-4xl leading-[1.1] sm:text-6xl ${image ? '!text-white' : ''}`}>
          {title}
          {script && <span className={`script mt-1 block text-4xl sm:text-6xl ${image ? '!text-olivia-green' : ''}`}>{script}</span>}
        </h1>
        {description && <p className={`mt-5 max-w-xl text-lg leading-relaxed ${image ? 'text-cream-100' : 'text-cocoa-600'}`}>{description}</p>}
      </div>
    </section>
  );
}
