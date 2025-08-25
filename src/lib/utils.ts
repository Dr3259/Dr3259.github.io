
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLogoUrl(url: string): string {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
    } catch (e) {
        // Fallback for invalid URLs
        return 'https://placehold.co/40x40.png';
    }
}


const PREDEFINED_TAG_COLORS: Record<string, string> = {
    // 音乐风格类
    'Pop': '#FF6F61',
    '流行': '#FF6F61',
    'Rock': '#1C1C1C',
    '摇滚': '#1C1C1C',
    'Hip-Hop': '#FFD700',
    '嘻哈': '#FFD700',
    'Electronic': '#00FFFF',
    '电子': '#00FFFF',
    'Classical': '#4B0082',
    '古典': '#4B0082',
    'Niche': '#708090',
    '小众': '#708090',
    // 情感/场景类
    'Study': '#3CB371',
    '学习': '#3CB371',
    'Love': '#FF69B4',
    '恋爱': '#FF69B4',
    'Healing': '#87CEFA',
    '治愈': '#87CEFA',
    'Motivational': '#FF4500',
    '励志': '#FF4500',
    'emo': '#483D8B',
};


export const getTagColor = (categoryName: string): string => {
    if (PREDEFINED_TAG_COLORS[categoryName]) {
        return PREDEFINED_TAG_COLORS[categoryName];
    }
    
    // Fallback for custom tags not in the predefined list
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0; // Ensure 32-bit integer
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 60%, 70%)`; 
};

// Helper to get a readable text color (black or white) based on background
export const getHighContrastTextColor = (bgColor: string): 'black' | 'white' => {
  if (bgColor.startsWith('hsl')) {
      try {
        const hslValues = bgColor.match(/\d+/g);
        if (!hslValues || hslValues.length < 3) return 'black';
        const l = parseInt(hslValues[2], 10);
        return l > 55 ? 'black' : 'white';
      } catch (e) {
        return 'black';
      }
  }

  // Logic for HEX colors
  if (bgColor.startsWith('#')) {
    const hex = bgColor.replace('#', '');
    if (hex.length < 6) return 'black';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }
  
  return 'black'; // Default fallback
};


export const getColorsFromCategory = (category: string | null): string[] => {
    if (!category) return ['hsl(var(--primary))'];
    
    const categories = category.split(',').map(c => c.trim()).filter(Boolean);
    const colors = categories.map(cat => getTagColor(cat));
    
    return colors.length > 0 ? colors : ['hsl(var(--primary))'];
};

const hexToHsl = (hex: string): [number, number, number] | null => {
    if (!hex || !hex.startsWith('#')) return null;

    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    } else {
        return null;
    }

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};


export const getHslColorsFromCategory = (categories: string | null | undefined): ([number, number, number] | null)[] => {
    if (!categories) return [null];
    const categoryList = categories.split(',').map(c => c.trim()).filter(Boolean);
    if(categoryList.length === 0) return [null];
    
    return categoryList.map(cat => {
        const hexColor = PREDEFINED_TAG_COLORS[cat];
        if (hexColor) {
           const hsl = hexToHsl(hexColor);
           if (hsl) {
                // If the color is very dark (like black), use its original HSL values to keep it dark.
                // Otherwise, use a fixed saturation and lightness for harmony.
                if (hsl[2] < 15) { 
                    return hsl; // Use original HSL for very dark colors
                }
                return [hsl[0], 70, 65]; 
           }
        }
        // Fallback for custom tags
        let hash = 0;
        for (let i = 0; i < cat.length; i++) {
            hash = cat.charCodeAt(i) + ((hash << 5) - hash);
            hash |= 0; 
        }
        const h = Math.abs(hash % 360);
        return [h, 70, 65]; // Hue, Saturation, Base Lightness
    });
}
