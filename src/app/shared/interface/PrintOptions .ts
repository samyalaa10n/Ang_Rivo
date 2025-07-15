export interface PrintOptions {
    title?: string;
    orientation?: 'portrait' | 'landscape';
    paperSize?: 'A4' | 'A3' | 'A5' | 'letter';
    margins?: string;
    showDate?: boolean;
    showPageNumbers?: boolean;
    customStyles?: string;
    headerContent?: string;
    footerContent?: string;
}