// Button.jsx
import clsx from "clsx";

const Button = ({
                    id,
                    title,
                    rightIcon,
                    leftIcon,
                    containerClass,
                    borderColor = "border-white",
                    borderBgColor = "bg-transparent",
                    borderHoverBgColor = "group-hover:border-yellow",
                    borderOffsetX = "translate-x-0.5",
                    borderOffsetY = "translate-y-0.5",
                }) => {
    return (
        <div className="relative inline-block group">
            {/* Detached White Border */}
            <div
                className={clsx(
                    "absolute inset-0 border-1 transition-all duration-300",
                    borderColor,
                    borderOffsetX,
                    borderOffsetY,
                    containerClass,
                    borderBgColor,
                    borderHoverBgColor
                )}
            />

            {/* Main Button */}
            <button
                id={id}
                className={clsx(
                    "relative z-10 cursor-pointer overflow-hidden px-7 py-1 transition-all duration-300",
                    containerClass
                )}
            >
                {leftIcon}

                <span className="relative inline-flex overflow-hidden font-general">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-8">
                        {title}
                    </div>
                    <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0 group-hover:border-amber-100">
                        {title}
                    </div>
                </span>

                {rightIcon}
            </button>
        </div>
    );
};

export default Button;