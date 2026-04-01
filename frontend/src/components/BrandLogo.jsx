export default function BrandLogo({ size = 40, className = '' }) {
    return (
        <span
            className={`brand-logo${className ? ` ${className}` : ''}`}
            style={{ fontSize: `${Math.max(18, size * 0.48)}px` }}
            aria-hidden="true"
        >
            <span className="brand-logo__orange">A.C.</span>
            <span className="brand-logo__e">E</span>
        </span>
    );
}
