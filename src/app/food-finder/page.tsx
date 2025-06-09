
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils, MapPin, Loader2, AlertTriangle, Coffee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '去哪吃',
    backButton: '返回主页',
    initialPrompt: '想知道附近有什么好吃的吗？',
    findButton: '查找附近餐厅',
    fetchingLocation: '正在获取您的位置...',
    fetchingRestaurants: '正在查找餐厅...',
    locationDenied: '位置访问被拒绝。请在浏览器或系统设置中启用位置服务，然后重试。',
    locationError: '无法获取您的位置。请稍后重试。',
    noRestaurantsFound: '附近未找到餐厅，或获取数据时出错。',
    tryAgainButton: '重试',
    restaurantListTitle: '附近的餐厅',
    currentLocationLabel: '当前位置:',
    addressRequiresService: '(获取详细地址通常需要外部地图服务)',
    // Placeholder restaurant data (will be replaced by real data in a full implementation)
    placeholderRestaurants: [
      { id: '1', name: '美味面馆', address: '人民路123号', cuisine: '中式', distance: '约200米' },
      { id: '2', name: '幸福咖啡厅', address: '公园大道45号', cuisine: '咖啡简餐', distance: '约450米' },
      { id: '3', name: 'Mama\'s Pizzeria', address: '世纪广场B座101', cuisine: '意式', distance: '约600米' },
    ]
  },
  'en': {
    pageTitle: 'Where to Eat',
    backButton: 'Back to Home',
    initialPrompt: 'Curious about what\'s delicious nearby?',
    findButton: 'Find Restaurants Near Me',
    fetchingLocation: 'Getting your location...',
    fetchingRestaurants: 'Finding restaurants...',
    locationDenied: 'Location access denied. Please enable location services in your browser or system settings and try again.',
    locationError: 'Could not get your location. Please try again later.',
    noRestaurantsFound: 'No restaurants found nearby, or there was an error fetching data.',
    tryAgainButton: 'Try Again',
    restaurantListTitle: 'Nearby Restaurants',
    currentLocationLabel: 'Current Location:',
    addressRequiresService: '(Detailed address typically requires an external map service)',
    // Placeholder restaurant data (will be replaced by real data in a full implementation)
    placeholderRestaurants: [
      { id: '1', name: 'Tasty Noodle House', address: '123 People Rd', cuisine: 'Chinese', distance: '~200m' },
      { id: '2', name: 'Happy Cafe', address: '45 Park Ave', cuisine: 'Cafe & Light Meals', distance: '~450m' },
      { id: '3', name: 'Mama\'s Pizzeria', address: 'Century Plaza, Block B, 101', cuisine: 'Italian', distance: '~600m' },
    ]
  }
};

type LanguageKey = keyof typeof translations;

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine: string;
  distance: string; // For placeholder
}

export default function FoodFinderPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiatedSearch, setHasInitiatedSearch] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleFetchLocationAndRestaurants = () => {
    setError(null);
    setRestaurants([]);
    setLocation(null);
    setHasInitiatedSearch(true);
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setIsLoadingLocation(false);
        fetchNearbyRestaurants(latitude, longitude);
      },
      (err) => {
        setIsLoadingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError(t.locationDenied);
        } else {
          setError(t.locationError);
        }
        console.error("Error getting location:", err);
      },
      { timeout: 10000, enableHighAccuracy: true } // 10 second timeout
    );
  };

  // Placeholder function for fetching restaurants
  // In a real app, this would make an API call to a backend service
  const fetchNearbyRestaurants = (latitude: number, longitude: number) => {
    setIsLoadingRestaurants(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would use latitude and longitude to query an API.
      // For now, we just use the placeholder data.
      console.log(`Fetching restaurants for Lat: ${latitude}, Lon: ${longitude}`);
      setRestaurants(t.placeholderRestaurants);
      setIsLoadingRestaurants(false);
    }, 1500); // Simulate network delay
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 sm:py-16 px-4 items-center">
      <header className="w-full max-w-2xl mb-8 sm:mb-12 self-center relative">
        <Link href="/rest" passHref>
          <Button variant="outline" size="sm" className="absolute top-0 left-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary text-center pt-1 sm:pt-0">
          {t.pageTitle}
        </h1>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center flex-grow">
        {!hasInitiatedSearch && (
          <div className="text-center p-8 bg-card rounded-lg shadow-xl">
            <Utensils className="w-20 h-20 sm:w-24 sm:h-24 text-primary mb-6 mx-auto" />
            <p className="text-muted-foreground mb-8 text-lg sm:text-xl max-w-sm">
              {t.initialPrompt}
            </p>
            <Button onClick={handleFetchLocationAndRestaurants} size="lg" className="px-8 py-6 text-lg">
              <MapPin className="mr-2 h-5 w-5" />
              {t.findButton}
            </Button>
          </div>
        )}

        {(isLoadingLocation || isLoadingRestaurants) && hasInitiatedSearch && (
          <div className="text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4 mx-auto" />
            <p className="text-lg text-muted-foreground">
              {isLoadingLocation ? t.fetchingLocation : t.fetchingRestaurants}
            </p>
          </div>
        )}

        {location && !isLoadingLocation && hasInitiatedSearch && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              {t.currentLocationLabel} Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
            </p>
            <p className="text-xs text-muted-foreground/80 italic mt-1">
              {t.addressRequiresService}
            </p>
          </div>
        )}

        {error && hasInitiatedSearch && !isLoadingLocation && (
          <div className="text-center p-8 bg-destructive/10 border border-destructive/30 rounded-lg shadow-lg max-w-md w-full">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4 mx-auto" />
            <p className="text-destructive font-medium mb-2 text-lg">{error.includes(t.locationDenied.substring(0,10)) ? t.locationDenied : t.locationError}</p>
            {error.includes(t.locationDenied.substring(0,10)) && (
                 <p className="text-sm text-destructive/80 mb-6">
                    {currentLanguage === 'zh-CN' ? '如果您已经启用了权限，请尝试刷新页面。' : 'If you have already enabled permissions, try refreshing the page.'}
                 </p>
            )}
            <Button onClick={handleFetchLocationAndRestaurants} variant="destructive" className="mt-2">
              {t.tryAgainButton}
            </Button>
          </div>
        )}

        {!isLoadingLocation && !isLoadingRestaurants && restaurants.length > 0 && hasInitiatedSearch && (
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-primary mb-6 text-center">{t.restaurantListTitle}</h2>
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl text-foreground flex items-center">
                       <Coffee className="mr-3 h-5 w-5 text-primary/80" /> {/* Using Coffee as a generic food icon */}
                      {restaurant.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p><strong>{currentLanguage === 'zh-CN' ? '地址：' : 'Address:'}</strong> {restaurant.address}</p>
                    <p><strong>{currentLanguage === 'zh-CN' ? '菜系：' : 'Cuisine:'}</strong> {restaurant.cuisine}</p>
                    <p><strong>{currentLanguage === 'zh-CN' ? '距离：' : 'Distance:'}</strong> {restaurant.distance}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-8">
              {currentLanguage === 'zh-CN' ? '提示：餐厅列表和数据为演示占位符。' : 'Hint: Restaurant list and data are placeholders for demonstration.'}
            </p>
          </div>
        )}

        {!isLoadingLocation && !isLoadingRestaurants && restaurants.length === 0 && location && hasInitiatedSearch && !error && (
           <div className="text-center p-8">
            <Utensils className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
            <p className="text-lg text-muted-foreground">{t.noRestaurantsFound}</p>
             <Button onClick={handleFetchLocationAndRestaurants} variant="outline" className="mt-6">
              {t.tryAgainButton}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

