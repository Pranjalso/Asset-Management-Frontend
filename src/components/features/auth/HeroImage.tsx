import Image from 'next/image';

export default function HeroImage() {
  return (
    <div className="relative hidden md:block md:w-[48%] lg:w-[48%] rounded-xl overflow-hidden flex-shrink-0">
      <Image src="/Image/image.png" alt="Access and manage assets with ease" fill className="object-cover" priority />
    </div>
  );
}
