export interface TextStyleProps { 
    /** text size */
    size?: 'small' | 'medium' | 'large';
    /** text color */
    color?: string;
    /** text weight */
    weight?: 'light' | 'normal' | 'bold';
    /** text alignment */
    align?: 'left' | 'center' | 'right';
    /** heading level */
    heading?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | false;
    /** text content */
    children: React.ReactNode;
}

export const Text = ({
    size = 'medium',
    color = '#000',
    weight = 'normal',
    align = 'left',
    heading = false,
    children,
    ...props
}: TextStyleProps) => {
    const HeadingTag = heading || 'p';

    const tailwindSizeClasses = () => {
        switch (heading) {
            case 'h1':
                return 'text-4xl';
            case 'h2':
                return 'text-3xl';
            case 'h3':
                return 'text-2xl';
            case 'h4':
                return 'text-xl';
            case 'h5':
                return 'text-lg';
            case 'h6':
                return 'text-base';
            default:
                return '';
        }
    };

    return (
        <HeadingTag className={tailwindSizeClasses()} {...props}>
            {children}
        </HeadingTag>
    );
}