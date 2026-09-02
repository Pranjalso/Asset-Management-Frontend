import Image from 'next/image';

export function FlutterflirtLogo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/Image/icon.svg" alt="Flutterflirt" width={26} height={26} />
      <span className="text-[15px] font-bold text-gray-900 tracking-tight">Flutterflirt</span>
    </div>
  );
}
