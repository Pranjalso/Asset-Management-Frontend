import Image from 'next/image';

export default function DashboardHeroImage() {
  return (
    <div className="relative hidden md:block md:w-[48%] lg:w-[48%] rounded-xl overflow-hidden flex-shrink-0">
      <Image
        src="/Image/image copy.png"
        alt="Dashboard"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
