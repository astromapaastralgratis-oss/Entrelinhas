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

type BrandLockupProps = {
  className?: string;
  avatarClassName?: string;
  textClassName?: string;
  priority?: boolean;
  size?: number;
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

export function BrandLockup({
  className = "",
  avatarClassName = "h-10 w-10",
  textClassName = "text-base",
  priority = false,
  size = 64
}: BrandLockupProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandAvatar className={avatarClassName} size={size} priority={priority} />
      <div className="min-w-0">
        <p className={`font-semibold tracking-[0.16em] text-entrelinhas-goldLight ${textClassName}`}>Entrelinhas</p>
        <p className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-entrelinhas-muted sm:block">
          Presenca • Estrategia • Evolucao
        </p>
      </div>
    </div>
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
