import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

type BrandAvatarProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/entrelinhas-logo.png"
      alt="Entrelinhas"
      width={1600}
      height={600}
      priority={priority}
      className={`h-auto w-full object-contain ${className}`}
    />
  );
}

export function BrandAvatar({ className = "", size = 96, priority = false }: BrandAvatarProps) {
  return (
    <Image
      src="/brand/entrelinhas-profile.png"
      alt="Entrelinhas - presenca, estrategia e evolucao"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-full border border-entrelinhas-gold/35 object-cover shadow-brand ${className}`}
    />
  );
}

export function BrandAppIcon({ className = "", size = 96, priority = false }: BrandAvatarProps) {
  return (
    <Image
      src="/brand/entrelinhas-app-icon.png"
      alt="Entrelinhas"
      width={size}
      height={size}
      priority={priority}
      className={`rounded-[1.35rem] border border-entrelinhas-gold/25 object-cover shadow-brand ${className}`}
    />
  );
}
