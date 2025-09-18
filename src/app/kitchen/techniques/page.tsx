"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Flame, ChefHat, CookingPot, Utensils, Zap, BookOpen, Scaling } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const translations = {
  'zh-CN': {
    pageTitle: '中式烹饪方法全解析',
    pageSubtitle: '附实操技巧与搭配逻辑',
    backButton: '返回厨房',
  },
  'en': {
    pageTitle: 'Chinese Cooking Techniques',
    pageSubtitle: 'with Practical Tips & Pairing Logic',
    backButton: 'Back to Kitchen',
  }
};

type LanguageKey = keyof typeof translations;

interface Technique {
  method: string;
  features: {
    fire: string;
    oil: string;
    time: string;
  };
  dishes: string;
  suitability: {
    ingredients: string;
    flavor: string;
  };
  guide: {
    preprocessing: string;
    pitfalls: string;
  };
}

const techniquesData: Technique[] = [
  { method: '炒', features: { fire: '旺火（中大火）', oil: '少量（刚没过锅底）', time: '1-3分钟，快速翻炒至食材断生' }, dishes: '农家小炒肉、蚝油牛肉、青椒土豆丝', suitability: { ingredients: '肉类（切丝/片）、蔬菜（根茎/叶菜）、豆制品', flavor: '鲜嫩爽口，突出食材本味' }, guide: { preprocessing: '肉类提前腌制（加淀粉+料酒，锁住水分），蔬菜切均匀大小（避免受热不均）', pitfalls: '避免一次炒太多（锅温骤降导致“出水”），叶菜先炒梗后炒叶（防止叶烂梗生）' } },
  { method: '爆', features: { fire: '急火（大火）', oil: '中量（比炒多，约锅底1cm深）', time: '30秒-1分钟，瞬间高温激发香味' }, dishes: '芫爆肚丝、火爆腰花、葱爆羊肉', suitability: { ingredients: '脆性/韧性食材（肚丝、腰花、鸡胗、鱿鱼）', flavor: '脆嫩鲜爽，蒜香/葱香浓郁' }, guide: { preprocessing: '内脏类切花刀（如腰花切麦穗纹，易入味），提前用料酒+盐去腥', pitfalls: '必须“热锅凉油”（锅烧至冒烟再倒油），调料提前调好（碗汁），避免手忙脚乱' } },
  { method: '炸', features: { fire: '中大火（初炸中温，复炸高温）', oil: '多量（没过食材）', time: '2-5分钟（分初炸定型、复炸酥脆）' }, dishes: '软炸虾仁、酥肉、炸茄盒', suitability: { ingredients: '各类食材（裹糊/不裹糊），尤其适合带骨/块状食材', flavor: '外焦里嫩（软炸）、香酥可口（硬炸）' }, guide: { preprocessing: '软炸需挂“全蛋糊”（鸡蛋+淀粉），硬炸挂“脆糊”（淀粉+泡打粉）', pitfalls: '复炸时油温需高（180℃以上），快速炸10秒即可（避免内部变老），出锅后吸油纸吸油' } },
  { method: '蒸', features: { fire: '大火（上汽后保持旺火）', oil: '几乎不用（仅调味时加少许）', time: '5-20分钟（依食材大小，如鱼5-8分钟，排骨15-20分钟）' }, dishes: '清蒸鲈鱼、清蒸滑鸡、粉蒸肉', suitability: { ingredients: '鲜肉类（鱼、鸡、排骨）、蛋类（鸡蛋羹）、豆制品', flavor: '鲜嫩软滑，最大保留营养与原味' }, guide: { preprocessing: '鱼类开背去内脏，表面划刀（易熟）；肉类提前腌制（加少许盐+料酒）', pitfalls: '蒸制时用“沸水上汽后再放食材”，鱼眼突出即熟（避免蒸老），蒸蛋羹需加温水（蛋液:水=1:1.5）' } },
  { method: '炖', features: { fire: '小火（微沸，汤面冒小泡）', oil: '少量（仅煸炒葱姜/肉类时用）', time: '30分钟-2小时（肉类需久炖至软烂）' }, dishes: '小鸡炖蘑菇、萝卜炖牛腩、莲藕排骨汤', suitability: { ingredients: '带骨肉类（排骨、牛腩）、禽类、根茎类蔬菜（萝卜、土豆）', flavor: '酥烂脱骨，汤鲜味浓' }, guide: { preprocessing: '肉类冷水下锅焯水（去血沫），加姜片+料酒去腥', pitfalls: '炖制时加“热水”（避免肉质遇冷收缩变柴），中途不加水（如需加水，加沸水）' } },
  { method: '烧', features: { fire: '先大火（烧开收汁），后小火（慢烧入味）', oil: '中量（煸炒食材+炒糖色）', time: '15-40分钟（依食材硬度，如红烧肉40分钟，茄子15分钟）' }, dishes: '红烧肉、葱烧海参、鱼香茄子', suitability: { ingredients: '五花肉、排骨、海鲜（海参/鲍鱼）、根茎蔬菜', flavor: '汁浓味厚（红烧咸鲜带甜，白烧清淡，干烧无汤）' }, guide: { preprocessing: '肉类焯水后煸炒至表面微黄（逼出油脂，更香不腻）', pitfalls: '炒糖色用“小火”（冰糖融化至琥珀色，避免炒糊发苦），汤汁需没过食材（确保入味）' } },
  { method: '焖', features: { fire: '小火（比炖更慢，汤面几乎不沸）', oil: '中量（煸炒后加少量汤）', time: '30分钟-1小时（需盖锅盖，利用蒸汽循环入味）' }, dishes: '油焖大虾、黄焖鸡、焖牛腩', suitability: { ingredients: '带壳海鲜（虾、蟹）、禽类（鸡、鸭）、大块肉类', flavor: '酥烂入味，汤汁浓稠（比烧更黏糊）' }, guide: { preprocessing: '大虾开背去虾线（易入味），肉类切大块（避免焖烂不成形）', pitfalls: '全程盖锅盖（防止水分过快蒸发），最后5分钟可开盖大火收汁（让汤汁挂在食材上）' } },
  { method: '煮', features: { fire: '大火烧开后转中小火（保持微沸）', oil: '极少（仅调味时加）', time: '5-30分钟（面食5分钟，肉类30分钟）' }, dishes: '水煮鱼、清汤面、水煮肉片', suitability: { ingredients: '面食、蔬菜、肉类（切片/块）、海鲜', flavor: '清淡原味（清汤煮）、麻辣鲜香（红油煮）' }, guide: { preprocessing: '肉类切片后用淀粉抓匀（避免煮老），蔬菜按易熟度下锅（叶菜最后放）', pitfalls: '煮面条时加少许盐（防粘连），水煮鱼需先煮蔬菜铺底，再煮鱼片（避免鱼片碎烂）' } },
  { method: '熘', features: { fire: '先中温炸（食材），后大火快炒（裹汁）', oil: '中量（炸食材+炒汁）', time: '5-10分钟（炸2-3分钟，裹汁1分钟）' }, dishes: '糖醋里脊、熘肝尖、醋熘土豆丝', suitability: { ingredients: '肉类（里脊、肝、腰）、蔬菜（土豆、藕）', flavor: '外焦里嫩（炸熘）、软嫩酸甜（软熘，如熘蛋羹）' }, guide: { preprocessing: '肉类挂糊（淀粉+鸡蛋），炸至金黄捞出；碗汁提前调好（糖+醋+淀粉+水）', pitfalls: '裹汁时需“大火快速翻炒”（让汤汁瞬间收稠挂匀，避免食材出水）' } },
  { method: '煎', features: { fire: '中小火（避免外焦内生）', oil: '少量（刷匀锅底，约0.5cm深）', time: '3-8分钟（两面各煎1-4分钟，至金黄）' }, dishes: '香煎小黄鱼、煎饺、香煎豆腐', suitability: { ingredients: '扁平食材（鱼、饺子、豆腐、牛排）', flavor: '外香内嫩，底部酥脆' }, guide: { preprocessing: '鱼表面擦干水分（防溅油），豆腐用厨房纸吸干水分（防碎）', pitfalls: '锅烧至微热再倒油（“热锅凉油”防粘），煎制时不要频繁翻动（一面定型后再翻面）' } },
  { method: '烤', features: { fire: '中高温（明火/烤箱180-220℃）', oil: '少量（刷在食材表面）', time: '10-30分钟（小块肉10分钟，整鸡30分钟）' }, dishes: '北京烤鸭、烤羊肉串、烤蔬菜', suitability: { ingredients: '整禽（鸡、鸭）、肉类（羊肉、五花肉）、根茎蔬菜（土豆、红薯）', flavor: '外皮酥脆，内部多汁（刷油/刷酱增香）' }, guide: { preprocessing: '肉类提前腌制（加孜然/烧烤酱，至少30分钟），整鸡肚子塞葱姜（去腥增香）', pitfalls: '烤箱烤时需垫锡纸（防粘），中途翻面并刷油（避免烤干），羊肉串用肥瘦相间的肉（更香）' } },
  { method: '卤', features: { fire: '小火（微沸，汤面冒细泡）', oil: '极少（仅炒糖色/香料时用）', time: '20分钟-1小时（素菜20分钟，肉类1小时，卤好后浸泡更入味）' }, dishes: '卤牛肉、卤鸡爪、卤豆干', suitability: { ingredients: '肉类（牛腱、鸡爪、猪蹄）、豆制品（豆干、豆皮）、蛋类', flavor: '香醇入味，咸鲜带香（香料味浓郁）' }, guide: { preprocessing: '肉类焯水去血沫，香料用纱布包好（避免散在汤里）', pitfalls: '卤汁需“宽汤”（没过食材），卤好后关火浸泡1-2小时（比煮着更入味），卤汁可重复使用（越卤越香）' } },
  { method: '拌', features: { fire: '无需加热（冷拌）或轻微加热（热拌，如焯水后）', oil: '少量（香油/辣椒油，提香）', time: '5-10分钟（切配+调味拌匀）' }, dishes: '凉拌黄瓜、凉拌木耳、夫妻肺片', suitability: { ingredients: '蔬菜（生/焯水）、熟肉类（切片/丝）、豆制品', flavor: '清爽开胃（冷拌）、鲜香微辣（热拌）' }, guide: { preprocessing: '生拌蔬菜洗净沥干（防出水），焯水蔬菜过凉水（保持脆爽）', pitfalls: '调味时遵循“先淡后浓”（先加少量盐，不够再加，避免过咸），可加少许糖（提鲜中和辣味）' } },
  { method: '腌', features: { fire: '无需加热（常温/冷藏腌制）', oil: '极少（仅油腌时用，如腌肉）', time: '短则10分钟（入味），长则数天（保存，如腌腊肉）' }, dishes: '腌萝卜、腊肉、咸鱼', suitability: { ingredients: '蔬菜（萝卜、黄瓜）、肉类（五花肉、鱼）', flavor: '咸香/酸甜（短期腌）、腊香/酱香（长期腌）' }, guide: { preprocessing: '蔬菜切条/块，表面撒盐杀出水分（更脆）；肉类切大块，用盐+香料均匀涂抹', pitfalls: '短期腌制（如腌黄瓜）需冷藏（防变质），长期腌制（腊肉）需通风晾晒（去除水分，防发霉）' } },
];

const goldenCombinations = [
  { title: '先炸后烧/焖', content: '适用于需外酥里嫩、汤汁浓稠的菜肴，如红烧肉（先炸五花肉至表面微黄，逼出油脂，再烧至软烂）、黄焖鸡（鸡肉先炸定型，再焖至入味，肉质不柴）。' },
  { title: '先炒后炖', content: '适用于带骨肉类，如萝卜炖牛腩（牛腩先煸炒至微黄，加香料炒香，再加水炖，香味更浓郁）。' },
  { title: '先蒸后淋汁', content: '适用于需保持鲜嫩、突出原味的菜肴，如清蒸鲈鱼（蒸好后淋热油+生抽，激发香味，避免蒸制时入味导致肉质变老）。' },
  { title: '先焯水后卤/拌', content: '适用于内脏、根茎蔬菜，如卤鸡爪（焯水去血沫，再卤制更干净无腥味）、凉拌木耳（焯水煮熟，过凉水更脆爽）。' },
];

const fireControlData = [
  { level: '小火（微火）', judgment: '油锅：油面平静，无青烟；汤锅：汤面冒细泡，几乎不沸', methods: '炖、焖、卤、熬汤', effect: '让食材缓慢熟透，入味均匀，避免外焦内生' },
  { level: '中小火', judgment: '油锅：油面微动，偶有青烟；汤锅：汤面冒小泡，缓慢翻滚', methods: '煎、炸（初炸定型）、煮（保持微沸）', effect: '均匀加热，让食材内外同步成熟，避免表面过快焦糊' },
  { level: '大火（旺火）', judgment: '油锅：油面翻滚，冒青烟；汤锅：汤面剧烈沸腾，冒泡密集', methods: '炒、爆、蒸（上汽后）、烧（收汁）', effect: '快速加热，锁住食材水分（如炒蔬菜保脆嫩），快速收汁（如烧菜让汤汁浓稠）' },
  { level: '急火（猛火）', judgment: '油锅：油面剧烈翻滚，浓烟明显；汤锅：瞬间沸腾', methods: '爆（如火爆腰花）', effect: '瞬间高温激发香味，让脆性食材保持脆嫩（避免久炒变韧）' },
];

const pretreatmentData = [
    { category: '肉类处理', points: ['切配：炒/爆用“顶刀切”（逆着肉纹切，破坏纤维，更嫩）；炖/卤用“顺刀切”（顺着肉纹切，避免炖烂碎成渣）。', '去腥：冷水下锅+姜片+料酒焯水（去血沫腥气），或提前用淀粉+料酒+少许盐腌制（锁住水分+去腥）。'] },
    { category: '蔬菜处理', points: ['叶菜（菠菜、生菜）：炒前沥干水分（防溅油），先炒梗后炒叶（避免叶烂梗生）。', '根茎菜（土豆、萝卜）：切后泡清水（去淀粉，避免氧化变黑，炒时更脆）。'] },
    { category: '海鲜处理', points: ['鱼类：开背去内脏，表面划刀（易熟+入味），鱼腹内的黑膜必须刮净（腥味来源）。', '虾/蟹：剪去虾须/蟹腮，开背去虾线（虾），去除蟹胃/蟹心（蟹，性寒且腥）。'] },
];

const InfoRow: React.FC<{ label: string; value: string; icon?: React.ElementType; colorClass?: string }> = ({ label, value, icon: Icon, colorClass }) => (
    <div className="flex items-start text-sm">
        {Icon && <Icon className={cn("w-4 h-4 mr-2 mt-0.5 shrink-0", colorClass || 'text-muted-foreground')} />}
        <div className="flex-1">
            <strong className={cn("mr-1.5 shrink-0 text-foreground/80", colorClass)}>{label}:</strong>
            <span className="text-muted-foreground">{value}</span>
        </div>
    </div>
);

const TechniqueCard: React.FC<{ technique: Technique }> = ({ technique }) => (
    <Card className="shadow-lg bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold text-primary">
                <ChefHat className="mr-3 h-6 w-6" />{technique.method}
            </CardTitle>
            <CardDescription>{technique.dishes}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">核心特点</h4>
                <div className="space-y-1.5">
                    <InfoRow label="火候" value={technique.features.fire} icon={() => <span className="text-base">🔥</span>} />
                    <InfoRow label="用油" value={technique.features.oil} icon={() => <span className="text-base">🍶</span>} />
                    <InfoRow label="时长" value={technique.features.time} icon={() => <span className="text-base">⏱️</span>} />
                </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border">
                 <h4 className="font-semibold text-sm mb-2">适配与风味</h4>
                <div className="space-y-1.5">
                    <InfoRow label="食材" value={technique.suitability.ingredients} icon={Utensils} colorClass="text-green-600 dark:text-green-400" />
                    <InfoRow label="风味" value={technique.suitability.flavor} icon={Zap} colorClass="text-amber-600 dark:text-amber-400" />
                </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">关键指南</h4>
                <div className="space-y-1.5">
                    <InfoRow label="预处理" value={technique.guide.preprocessing} />
                    <InfoRow label="避坑" value={technique.guide.pitfalls} />
                </div>
            </div>
        </CardContent>
    </Card>
);

const FireLevelIcon: React.FC<{ level: string }> = ({ level }) => {
    if (level.includes('小火')) return <Flame className="text-blue-500" />;
    if (level.includes('中小火')) return <Flame className="text-green-500" />;
    if (level.includes('大火')) return <Flame className="text-orange-500" />;
    if (level.includes('急火')) return <Flame className="text-red-500" />;
    return <Flame className="text-muted-foreground" />;
}

export default function CookingTechniquesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-5xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-12">
            <CookingPot className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageSubtitle}
            </p>
        </div>
        
        <div className="w-full space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-center mb-8 text-primary">核心烹饪方法详解</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {techniquesData.map(tech => (
                        <TechniqueCard key={tech.method} technique={tech} />
                    ))}
                </div>
            </section>

            <section>
                 <h2 className="text-2xl font-bold text-center mb-8 text-primary">“黄金组合”技法</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goldenCombinations.map(combo => (
                        <Card key={combo.title} className="bg-card/60 backdrop-blur-sm">
                            <CardHeader><CardTitle className="flex items-center text-lg"><Zap className="w-5 h-5 mr-3 text-amber-500" />{combo.title}</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">{combo.content}</p></CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-center mb-8 text-primary">火候控制“万能公式”</h2>
                <Card className="shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>火候等级</TableHead>
                                <TableHead>视觉判断</TableHead>
                                <TableHead className="hidden sm:table-cell">适配方法</TableHead>
                                <TableHead>核心作用</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fireControlData.map((item) => (
                                <TableRow key={item.level}>
                                    <TableCell className="font-medium flex items-center gap-2"><FireLevelIcon level={item.level} />{item.level}</TableCell>
                                    <TableCell>{item.judgment}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{item.methods}</TableCell>
                                    <TableCell>{item.effect}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-center mb-8 text-primary">食材预处理“避坑指南”</h2>
                <div className="space-y-6">
                    {pretreatmentData.map(item => (
                        <Card key={item.category} className="bg-card/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><BookOpen className="w-5 h-5 mr-3 text-green-500"/>{item.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                    {item.points.map((point, index) => <li key={index}>{point}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}
