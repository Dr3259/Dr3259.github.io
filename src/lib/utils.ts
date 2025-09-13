
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

// --- Huangli (Chinese Almanac) Data Generation ---
// Integrated calendar conversion logic
const calendar = (() => {
  // Lunar calendar data and calculations
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
    0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540,
    0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
    0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0,
    0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
    0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573,
    0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
    0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
    0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
    0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
    0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50,
    0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0,
    0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260,
    0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0,
    0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
    0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  ];

  const nStr1 = '日一二三四五六七八九十';
  const nStr2 = '初十廿卅';

  function getBit(m: number, n: number) { return (m >> n) & 1; }
  function lunarYearDays(y: number) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) sum += getBit(lunarInfo[y - 1900], i);
    return sum + lunarLeapDays(y);
  }
  function lunarLeapMonth(y: number) { return lunarInfo[y - 1900] & 0xf; }
  function lunarLeapDays(y: number) {
    if (lunarLeapMonth(y)) return getBit(lunarInfo[y - 1900], 0x10000) ? 30 : 29;
    return 0;
  }
  
  function solar2lunar(y: number, m: number, d: number) {
    const sDObj = new Date(y, m - 1, d);
    const lDObj = new Date(1900, 0, 31);
    let offDate = (sDObj.getTime() - lDObj.getTime()) / 86400000;
    let D, M, Y, i;
    for (i = 1900; i < 2050 && offDate > 0; i++) { D = lunarYearDays(i); offDate -= D; }
    if (offDate < 0) { offDate += D; i--; }
    Y = i;
    const leap = lunarLeapMonth(Y);
    let isLeap = false;
    for (i = 1; i < 13 && offDate > 0; i++) {
        let monthDays;
        if (leap > 0 && i === leap + 1 && !isLeap) {
            --i; isLeap = true; monthDays = lunarLeapDays(Y);
        } else {
            monthDays = (lunarInfo[Y - 1900] & (0x10000 >> i)) ? 30 : 29;
        }
        offDate -= monthDays;
        if (isLeap && i === leap + 1) isLeap = false;
    }
    if (offDate < 0) { offDate += (lunarInfo[Y - 1900] & (0x10000 >> i)) ? 30 : 29; --i; }
    M = i; D = offDate + 1;
    const isLeapMonth = leap > 0 && M === leap;

    const lunarDayName = (d: number) => {
        let s;
        switch (d) {
            case 10: s = '初十'; break; case 20: s = '二十'; break; case 30: s = '三十'; break;
            default: s = nStr2[Math.floor(d / 10)] + nStr1[d % 10];
        }
        return s;
    };
    const lunarMonthName = (m: number) => {
        const s = ['正','二','三','四','五','六','七','八','九','十','十一','十二'];
        return `${isLeapMonth ? '闰' : ''}${s[m-1]}`;
    }

    const gzArr = '甲乙丙丁戊己庚辛壬癸'.split('');
    const dzArr = '子丑寅卯辰巳午未申酉戌亥'.split('');
    const zxArr = '鼠牛虎兔龙蛇马羊猴鸡狗猪'.split('');
    const astroArr = '摩羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手摩羯'.split('');
    
    // --- Accurate Solar Term Calculation ---
    const term_list = [
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", 
        "清明", "谷雨", "立夏", "小满", "芒种", "夏至", 
        "小暑", "大暑", "立秋", "处暑", "白露", "秋分", 
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
    ];
    const term_info = [ // UTC milliseconds for 2000-01-01 00:00:00
      946656000000, 20.2422, 949248000000, 18.829, 951840000000, 15.65, 954432000000, 11.022,
      957024000000, 5.885, 959616000000, 5.5, 962208000000, 5.678, 964800000000, 6.108,
      967392000000, 6.818, 969984000000, 7.5, 972576000000, 7.622, 975168000000, 7.38
    ];
    
    const getTerm = (y: number, n: number) => new Date((31556925974.7 * (y - 1900) + term_info[n * 2] * 60000) + Date.UTC(1900, 0, 6, 2, 5));

    let solarTerm = '';
    let lichunDate;
    for(let i=0; i<24; i++) {
        const termDate = getTerm(y, i);
        if (term_list[i] === '立春') lichunDate = termDate;
        if (termDate.getUTCFullYear() === y && termDate.getUTCMonth() === m - 1 && termDate.getUTCDate() === d) {
            solarTerm = term_list[i];
            break;
        }
    }

    const zodiac = zxArr[(Y - 4) % 12];
    let finalZodiac = zodiac;
    // The zodiac year is determined by "Lichun" (start of spring)
    if (lichunDate && sDObj < lichunDate) {
      finalZodiac = zxArr[((Y-1) - 4) % 12];
    }
    
    const gzYear = gzArr[(Y - 4) % 10] + dzArr[(Y - 4) % 12];
    const dayOffset = (sDObj.getTime() - new Date('1900-01-01').getTime()) / 86400000;
    const gzDay = gzArr[Math.floor(dayOffset) % 10] + dzArr[Math.floor(dayOffset) % 12];

    const monthStart = new Date(y, m - 1, 1);
    const baseOffset = (monthStart.getFullYear() - 1900) * 12 + monthStart.getMonth() + 1;
    const gzMonth = gzArr[baseOffset % 10] + dzArr[baseOffset % 12];

    return {
      lunarYear: Y, lunarMonth: M, lunarDay: D, lunarMonthName: lunarMonthName(M),
      lunarDayName: lunarDayName(D), GanZhiYear: gzYear, GanZhiMonth: gzMonth,
      GanZhiDay: gzDay, zodiac: finalZodiac,
      astro: astroArr[m - (d < [20,19,21,20,21,22,23,23,23,24,23,22][m-1] ? 1 : 0)],
      term: solarTerm
    };
  }
  return { solar2lunar };
})();


export interface HuangliData {
    lunarDateStr: string;
    GanzhiDay: string;
    zodiac: string;
    good: string[];
    bad: string[];
    term: string | undefined;
}

const jianchu: Record<string, { good: string[]; bad: string[] }> = {
    '子': { good: ["嫁娶", "开市", "安葬"], bad: ["动土", "出行"] },
    '丑': { good: ["祭祀", "作灶"], bad: ["分居", "安葬"] },
    '寅': { good: ["出行", "求嗣", "祈福"], bad: ["开市", "交易"] },
    '卯': { good: ["修造", "动土"], bad: ["嫁娶", "作灶"] },
    '辰': { good: ["诉讼", "安床"], bad: ["出行", "修造"] },
    '巳': { good: ["求医", "祭祀"], bad: ["开仓", "出货"] },
    '午': { good: ["交易", "开市", "嫁娶"], bad: ["诉讼", "动土"] },
    '未': { good: ["祭祀", "安葬"], bad: ["嫁娶", "出行"] },
    '申': { good: ["出行", "求财", "嫁娶"], bad: ["动土", "开仓"] },
    '酉': { good: ["修造", "入宅"], bad: ["祭祀", "祈福"] },
    '戌': { good: ["嫁娶", "修造"], bad: ["开市", "安床"] },
    '亥': { good: ["安葬", "出行"], bad: ["动土", "词讼"] },
};

export const getHuangliData = (date: Date): HuangliData => {
    const lunarData = calendar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());

    const lunarDateStr = `${lunarData.lunarMonthName}月${lunarData.lunarDayName}`;
    const GanzhiDay = `${lunarData.GanZhiYear}年 ${lunarData.GanZhiMonth}月 ${lunarData.GanZhiDay}日`;
    const zodiac = `属${lunarData.zodiac} | ${lunarData.astro}`;
    
    // Use the Earthly Branch of the day to determine good/bad activities
    const dayBranch = lunarData.GanZhiDay ? lunarData.GanZhiDay.charAt(1) : '子';
    const activities = jianchu[dayBranch] || { good: ["平安"], bad: ["无"] };

    return {
        lunarDateStr,
        GanzhiDay,
        zodiac,
        good: activities.good.slice(0, 4),
        bad: activities.bad.slice(0, 4),
        term: lunarData.term,
    };
};
