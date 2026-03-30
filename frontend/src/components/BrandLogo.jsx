const LOGO_SRC = '/ACE_logo.jpeg';

/**
 * Circular logo from public/ACE_logo.jpeg with float + glow animations.
 * @param {number} size - outer diameter in px (including gradient ring)
 * @param {string} [className]
 */
export default function BrandLogo({ size = 40, className = '' }) {
    return (
        <div
            className={`brand-logo${className ? ` ${className}` : ''}`}
            style={{ width: size, height: size }}
        >
            <img
                src={LOGO_SRC}
                alt="A.C.E Planner"
                className="brand-logo__img"
                width={size}
                height={size}
                draggable={false}
            />
        </div>
    );
}
