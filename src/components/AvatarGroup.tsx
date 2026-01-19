import svgPaths from "../imports/svg-2fmiswijql";

export interface Avatar {
  type: "image" | "initial" | "icon" | "overflow";
  value?: string; // URL for image, letter for initial, number for overflow
  backgroundColor?: string;
  textColor?: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  size?: "sm" | "md" | "lg";
  maxVisible?: number;
  uniquePrefix?: string; // Optional prefix to ensure unique keys across different groups
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function UserIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 18 18"
    >
      <g>
        <path
          d={svgPaths.p27c81580}
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function SingleAvatar({
  avatar,
  size = "md",
  isLast = false,
}: {
  avatar: Avatar;
  size?: "sm" | "md" | "lg";
  isLast?: boolean;
}) {
  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];
  const marginClass = isLast ? "" : "mr-[-8px]";

  const renderContent = () => {
    switch (avatar.type) {
      case "image":
        return (
          <div
            className="absolute bg-center bg-cover bg-no-repeat inset-0 rounded-[999px] border border-white"
            style={{
              backgroundImage: `url('${avatar.value}')`,
            }}
          />
        );

      case "initial":
        return (
          <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px overflow-clip relative shrink-0 w-full">
            <div
              className={`basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 ${textSizeClass} text-center`}
              style={{
                color: avatar.textColor || "white",
                fontVariationSettings: "'width' 100",
              }}
            >
              <p className="leading-[1.5]">{avatar.value}</p>
            </div>
          </div>
        );

      case "icon":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <UserIcon
              className={`text-white ${size === "sm" ? "size-3" : size === "md" ? "size-4" : "size-5"}`}
            />
          </div>
        );

      case "overflow":
        return (
          <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px overflow-clip relative shrink-0 w-full">
            <div
              className={`basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow h-full justify-center leading-[0] min-h-px min-w-px relative shrink-0 ${textSizeClass} text-center`}
              style={{
                color: avatar.textColor || "#ca6510",
                fontVariationSettings: "'wdth' 100",
              }}
            >
              <p className="leading-[1.5]">+{avatar.value}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`box-border content-stretch flex flex-col items-end justify-start ${marginClass} relative rounded-[999px] shrink-0 ${sizeClass}`}
      style={{
        backgroundColor: avatar.backgroundColor || "#adb5bd",
      }}
    >
      <div
        className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[999px]"
      />
      <div>{renderContent()}</div>
    </div>
  );
}

export default function AvatarGroup({
  avatars,
  size = "md",
  maxVisible = 4,
  uniquePrefix,
}: AvatarGroupProps) {
  // Process avatars to handle overflow
  let processedAvatars;

  if (avatars.length > maxVisible) {
    const visibleAvatars = avatars.slice(0, maxVisible - 1);
    const overflowCount = avatars.length - (maxVisible - 1);

    processedAvatars = [
      ...visibleAvatars,
      {
        type: "overflow" as const,
        value: overflowCount.toString(),
        backgroundColor: "#fecba1",
        textColor: "#ca6510",
      },
    ];
  } else {
    processedAvatars = avatars;
  }

  return (
    <div className="flex flex-row items-center justify-start pl-0 pr-2 py-0">
      {processedAvatars.map((avatar, index) => {
        // Simple, stable key generation
        const baseKey = uniquePrefix ? `${uniquePrefix}-${index}` : `avatar-${index}`;
        const typeKey = avatar.type === "overflow" ? `${baseKey}-overflow-${avatar.value}` : `${baseKey}-${avatar.type}`;

        return (
          <SingleAvatar
            key={typeKey}
            avatar={avatar}
            size={size}
            isLast={index === processedAvatars.length - 1}
          />
        );
      })}
    </div>
  );
}