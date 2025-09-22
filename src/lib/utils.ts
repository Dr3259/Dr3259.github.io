
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
    'Ancient': '#556B2F',
    '古风': '#556B2F',
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
// 使用更准确的农历转换算法
const calendar = (() => {
  // 更准确的农历数据表 (1900-2100)
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
    0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
    // 2000-2100年的数据
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
    0x0d520
  ];

  const nStr1 = '日一二三四五六七八九十';
  const nStr2 = '初十廿卅';
  const nStr3 = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  // 获取农历年天数
  function lYearDays(y: number): number {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
  }

  // 获取农历年闰月天数
  function leapDays(y: number): number {
    if (leapMonth(y)) {
      return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  }

  // 获取农历年闰月月份
  function leapMonth(y: number): number {
    return lunarInfo[y - 1900] & 0xf;
  }

  // 获取农历年月天数
  function monthDays(y: number, m: number): number {
    return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
  }

  // 农历转公历
  function solar2lunar(y: number, m: number, d: number) {
    if (y < 1900 || y > 2100) {
      return { error: '年份超出范围' };
    }

    // 计算从1900年1月31日到指定日期的天数
    const objDate = new Date(y, m - 1, d);
    let i, leap = 0, temp = 0;
    const baseDate = new Date(1900, 0, 31); // 1900年1月31日
    let offset = Math.floor((objDate.getTime() - baseDate.getTime()) / 86400000);

    // 计算农历年份
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = lYearDays(i);
      offset -= temp;
    }

    if (offset < 0) {
      offset += temp;
      i--;
    }

    const lunarYear = i;
    leap = leapMonth(lunarYear); // 闰哪个月
    let isLeap = false;

    // 计算农历月份
    for (i = 1; i < 13 && offset > 0; i++) {
      // 闰月
      if (leap > 0 && i === (leap + 1) && isLeap === false) {
        --i;
        isLeap = true;
        temp = leapDays(lunarYear); // 计算农历闰月天数
      } else {
        temp = monthDays(lunarYear, i); // 计算农历普通月天数
      }

      // 解除闰月
      if (isLeap === true && i === (leap + 1)) {
        isLeap = false;
      }

      offset -= temp;
    }

    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
      }
    }

    if (offset < 0) {
      offset += temp;
      --i;
    }

    const lunarMonth = i;
    const lunarDay = offset + 1;
    const isLeapMonth = isLeap;

    // 生成农历日期字符串
    const lunarDayName = (d: number): string => {
      if (d <= 10) {
        return '初' + nStr1[d];
      } else if (d < 20) {
        return '十' + nStr1[d - 10];
      } else if (d === 20) {
        return '二十';
      } else if (d < 30) {
        return '廿' + nStr1[d - 20];
      } else if (d === 30) {
        return '三十';
      } else {
        return '初一'; // 异常情况
      }
    };

    const lunarMonthName = (m: number): string => {
      return (isLeapMonth ? '闰' : '') + nStr3[m - 1];
    };

    // 计算干支纪年
    const gzYear = getGanZhi(lunarYear - 1864); // 1864年是甲子年
    const gzMonth = getGanZhi((lunarYear - 1900) * 12 + lunarMonth + 11);
    const gzDay = getGanZhi(Math.floor((objDate.getTime() - new Date(1900, 0, 1).getTime()) / 86400000) + 25);

    return {
      lunarYear,
      lunarMonth,
      lunarDay,
      lunarMonthName: lunarMonthName(lunarMonth),
      lunarDayName: lunarDayName(lunarDay),
      GanZhiYear: gzYear,
      GanZhiMonth: gzMonth,
      GanZhiDay: gzDay,
      zodiac: getZodiac(lunarYear),
      astro: getAstro(m, d),
      term: ''
    };
  }

  // 获取干支
  function getGanZhi(num: number): string {
    const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return gan[num % 10] + zhi[num % 12];
  }

  // 获取生肖
  function getZodiac(year: number): string {
    const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiac[(year - 1900) % 12];
  }

  // 获取星座
  function getAstro(m: number, d: number): string {
    const astro = ['摩羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手'];
    const boundary = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    return astro[d < boundary[m - 1] ? (m - 1) : m % 12];
  }

  return { solar2lunar };
})();


export interface HuangliData {
    lunarDateStr: string;
    GanzhiDay: string;
    zodiac: string;
    good: Array<{ name: string; description: string }>;
    bad: Array<{ name: string; description: string }>;
    term: string | undefined;
    wealthDirection: { direction: string; description: string }; // 财神方位
}

// 黄历事项的现代化解释
const activityExplanations: Record<string, string> = {
    // 吉事类
    '嫁娶': '💒 适合结婚、办婚礼、登记结婚等爱情大事',
    '开市': '🏢 适合开业、开店、开业典礼、商业活动',
    '安葬': '🌿 适合处理丧葬事宜、祭奠先人',
    '祭祀': '🙏 适合祭奠祖先、上香拜佛、宗教仪式',
    '作灶': '🔥 适合装修厨房、安装灶具、烹饪',
    '出行': '✈️ 适合旅游、出差、搬家、远行',
    '求嗣': '👶 适合备孕、求子、治疗不孕',
    '祈福': '🎆 适合许愿、祈祷平安、求神拜佛',
    '修造': '🔨 适合装修、维修、建筑施工',
    '动土': '🏗️ 适合动工、挖掘、地基工程',
    '诉讼': '⚖️ 适合打官司、法庭辩论、维权',
    '安床': '🛏️ 适合搬家、安置新床、新房入住',
    '求医': '⚕️ 适合看医生、体检、治疗疾病',
    '交易': '💰 适合买卖、签约、金融投资',
    '开仓': '🏦 适合开启仓库、存储物品',
    '出货': '🚚 适合运输、发货、物流配送',
    '求财': '💸 适合投资理财、找工作、赚钱',
    '入宅': '🏠 适合搬家、乔迁新居、入住新房',

    // 凶事类
    '分居': '⛔ 不宜分手、离婚、分家、分割财产',
    '词讼': '⚠️ 不宜打官司、争吵、法庭辩论',
    '无': '🌿 今日无特别忌讳，可平常心对待',
    '平安': '🙏 今日宜保持平常心，平安为福'
};

// 将简单的字符串转换为带解释的对象
const convertToExplainedActivity = (activity: string) => ({
    name: activity,
    description: activityExplanations[activity] || `与${activity}相关的事宜`
});

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

// 财神方位计算 - 根据天干地支确定财神方位
const getWealthDirection = (ganZhiDay: string): { direction: string; description: string } => {
    if (!ganZhiDay || ganZhiDay.length < 2) {
        return { direction: '正东', description: '🧧 财神位于正东方，适合从东面来的机会' };
    }
    
    const dayGan = ganZhiDay.charAt(0); // 取天干
    
    // 根据传统命理学，不同天干对应不同的财神方位
    const wealthDirections: Record<string, { direction: string; description: string }> = {
        '甲': { direction: '东北', description: '🧧 财神位于东北方，适合投资理财、谈合作' },
        '乙': { direction: '正东', description: '🧧 财神位于正东方，利于做生意、求财' },
        '丙': { direction: '东南', description: '🧧 财神位于东南方，适合开店、创业' },
        '丁': { direction: '正南', description: '🧧 财神位于正南方，利于金融交易、股票' },
        '戊': { direction: '东南', description: '🧧 财神位于东南方，适合合作、签约' },
        '己': { direction: '正南', description: '🧧 财神位于正南方，利于工作求职、升职' },
        '庚': { direction: '西南', description: '🧧 财神位于西南方，适合房产交易、大额投资' },
        '辛': { direction: '正西', description: '🧧 财神位于正西方，利于各种财富运动' },
        '壬': { direction: '西北', description: '🧧 财神位于西北方，适合谈判、合作' },
        '癸': { direction: '正北', description: '🧧 财神位于正北方，利于长期投资、储蓄' }
    };
    
    return wealthDirections[dayGan] || { direction: '正东', description: '🧧 财神位于正东方，适合从东面来的机会' };
};

export const getHuangliData = (date: Date): HuangliData => {
    // 数据验证
    if (!date || isNaN(date.getTime())) {
        date = new Date(); // 使用当前日期作为后备
    }
    
    const lunarData = calendar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
    
    // 确保农历数据有效
    const lunarMonthName = lunarData.lunarMonthName || '正';
    const lunarDayName = lunarData.lunarDayName || '初一';
    const ganZhiYear = lunarData.GanZhiYear || '甲子';
    const ganZhiMonth = lunarData.GanZhiMonth || '甲子';
    const ganZhiDay = lunarData.GanZhiDay || '甲子';
    const zodiac = lunarData.zodiac || '鼠';
    const astro = lunarData.astro || '摩羯';
    
    const lunarDateStr = `${lunarMonthName}月${lunarDayName}`;
    const GanzhiDay = `${ganZhiYear}年 ${ganZhiMonth}月 ${ganZhiDay}日`;
    const zodiacStr = `属${zodiac} | ${astro}`;
    
    // Use the Earthly Branch of the day to determine good/bad activities
    const dayBranch = ganZhiDay && ganZhiDay.length >= 2 ? ganZhiDay.charAt(1) : '子';
    const activities = jianchu[dayBranch] || { good: ["平安"], bad: ["无"] };

    // 根据屏幕尺寸调整显示数量
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxItems = isMobile ? 2 : 4; // 移动端显示2个，桌面端显示4个
    
    // 计算财神方位
    const wealthDirection = getWealthDirection(ganZhiDay);

    return {
        lunarDateStr,
        GanzhiDay,
        zodiac: zodiacStr,
        good: activities.good.slice(0, maxItems).map(convertToExplainedActivity),
        bad: activities.bad.slice(0, maxItems).map(convertToExplainedActivity),
        term: lunarData.term || undefined,
        wealthDirection, // 添加财神方位
    };
};
