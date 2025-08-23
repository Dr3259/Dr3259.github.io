import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTagColor = (categoryName: string): string => {
    if (categoryName.toLowerCase() === 'emo') {
        return `hsl(260, 50%, 40%)`; // Deep, moody purple for "emo"
    }
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0; // Ensure 32-bit integer
    }
    const h = Math.abs(hash % 360);
    // Use a slightly desaturated and lighter color for better text contrast
    return `hsl(${h}, 60%, 70%)`; 
};

// Helper to get a readable text color (black or white) based on background
export const getHighContrastTextColor = (bgColor: string): 'black' | 'white' => {
  if (!bgColor.startsWith('hsl')) {
    // Fallback for non-hsl colors, though our generator uses hsl
    return 'black'; 
  }
  try {
    const hslValues = bgColor.match(/\d+/g);
    if (!hslValues || hslValues.length < 3) return 'black';
    const l = parseInt(hslValues[2], 10);
    // L in HSL is a value from 0 to 100.
    // A lightness value > 50-55 is generally considered light enough for black text.
    return l > 55 ? 'black' : 'white';
  } catch (e) {
    return 'black';
  }
};

export const getColorsFromCategory = (category: string | null): string[] => {
    if (!category) return ['hsl(var(--primary))'];
    
    const categories = category.split(',').map(c => c.trim()).filter(Boolean);
    const colors = categories.map(cat => getTagColor(cat));
    
    return colors.length > 0 ? colors : ['hsl(var(--primary))'];
};

export const getHslColorsFromCategory = (categories: string | null | undefined): ([number, number, number] | null)[] => {
    if (!categories) return [null];
    const categoryList = categories.split(',').map(c => c.trim()).filter(Boolean);
    if(categoryList.length === 0) return [null];
    
    return categoryList.slice(0, 2).map(cat => {
        if (cat.toLowerCase() === 'emo') {
            return [260, 50, 45]; // HSL for deep purple: Hue, Saturation, Base Lightness
        }
        let hash = 0;
        for (let i = 0; i < cat.length; i++) {
            hash = cat.charCodeAt(i) + ((hash << 5) - hash);
            hash |= 0; 
        }
        const h = Math.abs(hash % 360);
        return [h, 70, 65]; // Hue, Saturation, Base Lightness
    });
}
