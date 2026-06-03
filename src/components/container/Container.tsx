
import clsx from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bật tắt padding ngang */
  isPadding?: boolean;

  /** Padding dọc (true = default, number = px custom) */
  vertical?: boolean | number;
}

export function Container({
  children,
  className,
  isPadding = true,
  vertical = false,
  ...props
}: ContainerProps) {
  // padding ngang (px-4)
  const horizontalPadding = isPadding ? "px-4 md:px-6 lg:px-8 xl:px-8" : "";

  // padding dọc
  const verticalPadding =
    vertical === true
      ? "py-6 md:py-10" // default
      : typeof vertical === "number"
      ? `py-[${vertical}px]`
      : "";

  return (
    <div
      className={clsx(
        "w-full flex justify-between items-center 2xl:max-w-[1395px] h-full xl:max-w-[1400px]  mx-auto",
        horizontalPadding,
        verticalPadding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
