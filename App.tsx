import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Animated, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  useWindowDimensions,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface AnnouncementData {
  id: number;
  headline: string;
  tag: string;
  date_context: string;
  body: string;
  button_text: string;
  button_link: string | null;
  show_in_marquee: boolean;
}

interface SpiritualData {
  id: number;
  content_type: 'Ayat' | 'Hadith';
  arabic_text: string | null;
  translation: string;
  reference: string;
}

interface OfferingData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon_name: string;
}

const DEFAULT_OFFERINGS: OfferingData[] = [
  {
    id: 1,
    title: "5 Times Daily Salah",
    subtitle: "Congregational Prayer",
    description: "Join our community for all five daily prayers and Jumu'ah congregations in a serene, welcoming environment.",
    icon_name: "mosque"
  },
  {
    id: 2,
    title: "Maktab Program",
    subtitle: "Accepting Students",
    description: "Guiding children in learning the rules of Tajweed, memorizing key surahs, and building a strong connection with the Quran.",
    icon_name: "book-open"
  },
  {
    id: 3,
    title: "Ta'leem Program",
    subtitle: "Sunnah & Hadeeth",
    description: "Deepening our understanding of the Prophet's teachings (peace be upon him) for practical guidance in everyday life.",
    icon_name: "scroll"
  },
  {
    id: 4,
    title: "Hifz Program",
    subtitle: "Coming Soon",
    description: "A structured memorization program supporting students in committing the entirety of the Holy Quran to heart.",
    icon_name: "award"
  }
];

export default function App() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  
  const [marqueeText, setMarqueeText] = useState<string>(
    "🌙 CURRENT UPDATES: The Maktab Program is currently accepting new students. Join us for 5 Times Daily Salah."
  );
  const [primaryAnnouncement, setPrimaryAnnouncement] = useState<AnnouncementData | null>(null);
  const [ayatItem, setAyatItem] = useState<SpiritualData | null>(null);
  const [hadithItem, setHadithItem] = useState<SpiritualData | null>(null);
  const [offerings, setOfferings] = useState<OfferingData[]>(DEFAULT_OFFERINGS);

  const mainScrollRef = useRef<ScrollView>(null);
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const contentWidth = '100%';

  const handleGoHome = () => {
    mainScrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/home-data/');
        if (!response.ok) return;
        const data = await response.json();

        if (data.announcements && data.announcements.length > 0) {
          const marqueeSource = data.announcements.find((a: AnnouncementData) => a.show_in_marquee);
          if (marqueeSource) {
            setMarqueeText(`📢 ${marqueeSource.headline}: ${marqueeSource.body}`);
          }
          setPrimaryAnnouncement(data.announcements[0]);
        }

        if (data.spiritual_content) {
          const ayat = data.spiritual_content.find((s: SpiritualData) => s.content_type === 'Ayat');
          const hadith = data.spiritual_content.find((s: SpiritualData) => s.content_type === 'Hadith');
          if (ayat) setAyatItem(ayat);
          if (hadith) setHadithItem(hadith);
        }

        if (data.offerings && data.offerings.length > 0) {
          setOfferings(data.offerings);
        }
      } catch (err) {
        console.warn('Django API offline, displaying default Windsor content.', err);
      }
    };

    fetchBackendData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#003B2F" />
      
      {/* 1. NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navInnerFull}>
          <TouchableOpacity style={styles.logoGroup} onPress={handleGoHome} activeOpacity={0.7}>
            <View style={styles.logoBadgeWhite}>
              <MaterialCommunityIcons name="mosque" size={30} color="#166534" />
            </View>
            <View>
              <Text style={styles.navTitleDark}>Noor Ul Islam</Text>
              <Text style={styles.navSubtitleDark}>Windsor</Text>
            </View>
          </TouchableOpacity>

          {isDesktop && (
            <View style={styles.centerMenu}>
              <TouchableOpacity onPress={handleGoHome}>
                <Text style={styles.menuItemDark}>Home</Text>
              </TouchableOpacity>
              <Text style={styles.menuItemDark}>About Us</Text>
              <Text style={styles.menuItemDark}>Programs & Offerings</Text>
              <Text style={styles.menuItemDark}>Prayer Times</Text>
              <Text style={styles.menuItemDark}>Contact</Text>
            </View>
          )}

          {isDesktop && (
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity style={styles.solidGoldBtn}>
                <MaterialCommunityIcons name="heart" size={16} color="#000000" />
                <Text style={styles.solidGoldBtnTxt}>Donate</Text>
              </TouchableOpacity>
            </View>
          )}

          {!isDesktop && <Ionicons name="menu" size={32} color="#0F172A" />}
        </View>
      </View>

      {/* 2. DYNAMIC MARQUEE BANNER */}
      <MarqueeBanner key={marqueeText} message={marqueeText} screenWidth={width} />

      <ScrollView ref={mainScrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 3. HERO SECTION */}
        <ImageBackground 
          source={require('./assets/masjid-front.jpeg')} 
          style={styles.heroContainer}
        >
          <View style={styles.heroOverlay}>
            <View style={[styles.heroContent, { width: contentWidth }]}>
            <Text style={styles.heroWelcome}>
  {"بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\nBismillah ir-Rahman ir-Rahim"}</Text>              <Text style={styles.heroHeading}>Welcome to Noor ul Islam.</Text>
              <Text style={styles.heroSubHeading}>
                A place of worship, learning, and building a strong community. Fostering a deeper connection with Allah (SWT) in the heart of Windsor.
              </Text>
              <View style={styles.heroActionGroup}>
                <TouchableOpacity style={styles.primaryHeroBtn}>
                  <Text style={styles.primaryHeroBtnTxt}>View Prayer Times</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryHeroBtn}>
                  <Text style={styles.secondaryHeroBtnTxt}>Enroll in Maktab</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* 4. CALENDAR & DYNAMIC ANNOUNCEMENT */}
        <View style={styles.sectionWhite}>
          <View style={[styles.sectionInner, { width: contentWidth, flexDirection: isDesktop ? 'row' : 'column' }]}>
            
            {/* LEFT: CALENDAR */}
            <View style={[styles.columnLeft, isDesktop && { flex: 1.5, marginRight: 40 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Prayer Schedule</Text>
                <View style={styles.tabSwitcher}>
                  <TouchableOpacity onPress={() => setActiveTab('daily')} style={[styles.tabBtn, activeTab === 'daily' && styles.tabBtnActive]}>
                    <Text style={[styles.tabTxt, activeTab === 'daily' && styles.tabTxtActive]}>Daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setActiveTab('monthly')} style={[styles.tabBtn, activeTab === 'monthly' && styles.tabBtnActive]}>
                    <Text style={[styles.tabTxt, activeTab === 'monthly' && styles.tabTxtActive]}>Monthly</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.masjidalContainer}>
                {Platform.OS === 'web' ? (
                  <div 
                    style={{ width: '100%', height: '100%', minHeight: 400 }}
                    dangerouslySetInnerHTML={{ 
                      __html: `
                        <masjidal-widget 
                          async 
                          widget-id="X75jYowIfSoHRax6y0mjT" 
                          type="prayer" 
                          api-key="msj_pk_GbjoXFGJ3IlW7n-Ubwnvs53xnzmb0OGfkiwgyTrWnG0"> 
                        </masjidal-widget>
                      ` 
                    }} 
                  />
                ) : (
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <Ionicons name="calendar-outline" size={32} color="#004B39" />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginTop: 10 }}>Live Prayer Times</Text>
                  </View>
                )}
              </View>
            </View>

            {/* RIGHT: DYNAMIC UPDATES */}
            <View style={[styles.columnRight, isDesktop && { flex: 1 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Community Updates</Text>
              </View>
              <View style={styles.announcementCard}>
                <View style={styles.announcementTag}>
                  <Text style={styles.announcementTagTxt}>
                    {primaryAnnouncement ? primaryAnnouncement.tag : 'Registration Open'}
                  </Text>
                </View>
                <Text style={styles.announcementDate}>
                  {primaryAnnouncement ? primaryAnnouncement.date_context : 'Active Term'}
                </Text>
                <Text style={styles.announcementHeadline}>
                  {primaryAnnouncement ? primaryAnnouncement.headline : 'Maktab Program'}
                </Text>
                <Text style={styles.announcementBody}>
                  {primaryAnnouncement ? primaryAnnouncement.body : 'We are actively accepting new students. The core focus is teaching children the proper recitation (Tajweed) of the Quran and memorizing key surahs.'}
                </Text>
                <TouchableOpacity style={styles.readMoreBtn}>
                  <Text style={styles.readMoreTxt}>
                    {primaryAnnouncement ? primaryAnnouncement.button_text : 'Enroll Your Child →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>

        {/* 5. DYNAMIC SPIRITUAL SECTION (AYAT & HADITH OF THE DAY) */}
        <View style={styles.sectionDark}>
          <View style={[styles.sectionInner, { width: contentWidth }]}>
            <View style={styles.spiritualGrid}>
              
              {/* AYAT */}
              <View style={styles.spiritualCard}>
                <View style={styles.spiritualHeader}>
                  <FontAwesome5 name="book-open" size={18} color="#D4AF37" />
                  <Text style={styles.spiritualLabel}>Ayat of the Day</Text>
                </View>
                <Text style={styles.arabicLarge}>
                  {ayatItem?.arabic_text || 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ'}
                </Text>
                <Text style={styles.translationLight}>
                  {ayatItem?.translation || '"This is the Book! There is no doubt about it—a guide for those mindful of Allah."'}
                </Text>
                <Text style={styles.referenceGold}>
                  {ayatItem?.reference ? `— ${ayatItem.reference}` : '— Surah Al-Baqarah 2:2'}
                </Text>
              </View>

              <View style={isDesktop || isTablet ? styles.verticalDivider : styles.horizontalDivider} />

              {/* HADITH */}
              <View style={styles.spiritualCard}>
                <View style={styles.spiritualHeader}>
                  <MaterialCommunityIcons name="book-check" size={20} color="#D4AF37" />
                  <Text style={styles.spiritualLabel}>Hadith of the Day</Text>
                </View>
                {hadithItem?.arabic_text && (
                  <Text style={[styles.arabicLarge, { fontSize: 26, lineHeight: 42 }]}>
                    {hadithItem.arabic_text}
                  </Text>
                )}
                <Text style={styles.translationLight}>
                  {hadithItem?.translation || '"The most beloved of places to Allah are the masajid, and the most hated places are the markets."'}
                </Text>
                <Text style={styles.referenceGold}>
                  {hadithItem?.reference ? `— ${hadithItem.reference}` : '— Sahih Muslim'}
                </Text>
              </View>

            </View>
          </View>
        </View>

        {/* 6. NOOR UL ISLAM SERVICES & OFFERINGS */}
        <View style={styles.sectionGray}>
          <View style={[styles.sectionInner, { width: contentWidth }]}>
            <View style={styles.sectionHeaderCenter}>
              <Text style={styles.sectionTitle}>Our Services & Offerings</Text>
              <Text style={styles.sectionSubtitle}>Dedicated to worship, Quranic learning, and prophetic teachings in Windsor.</Text>
            </View>
            
            <View style={[styles.programsGrid, isDesktop && styles.programsGridDesktop]}>
              {offerings.map((item) => (
                <OfferingCard 
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  desc={item.description}
                  icon={item.icon_name}
                />
              ))}
            </View>
          </View>
        </View>

        {/* 7. HERITAGE & FACILITY SLIDER */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop' }} 
          style={styles.sectionFacilityBg}
        >
          <View style={styles.facilityOverlay}>
            <View style={[styles.sectionInner, { width: contentWidth, alignItems: 'center' }]}>
              <View style={styles.sectionHeaderCenter}>
                <Text style={styles.sectionTitleWhite}>Our Heritage</Text>
                <Text style={styles.sectionSubtitleWhite}>From Wyandotte Street to 659 Lincoln Road</Text>
              </View>
              <FacilitySlider />
            </View>
          </View>
        </ImageBackground>

        {/* 8. FOOTER */}
        <View style={styles.footer}>
          <View style={[styles.footerInner, { width: contentWidth }]}>
            <Text style={styles.footerBrand}>MASJID NOOR UL ISLAM</Text>
            <Text style={styles.footerAddress}>659 Lincoln Road, Windsor, Ontario N8Y-2G8</Text>
            <Text style={styles.footerPhone}>519-999-2561</Text>
            <View style={styles.footerLine} />
            <Text style={styles.footerCopy}>© 2026 Noor Ul Islam Windsor. Built for the Community.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* --- REUSABLE COMPONENTS --- */

const OfferingCard = ({ title, subtitle, desc, icon }: { title: string, subtitle: string, desc: string, icon: string }) => (
  <View style={styles.offeringCard}>
    <View style={styles.offeringCardTop}>
      <View style={styles.programIconWrapper}>
        <FontAwesome5 name={icon as any} size={22} color="#004B39" />
      </View>
      <Text style={styles.academySubtitleText}>{subtitle}</Text>
    </View>
    <Text style={styles.academyTitleText}>{title}</Text>
    <Text style={styles.academyDescText}>{desc}</Text>
  </View>
);

const MarqueeBanner = ({ message, screenWidth }: { message: string, screenWidth: number }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const marqueeWidth = Platform.OS === 'web' ? screenWidth * 1.5 : screenWidth * 3;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, -marqueeWidth],
  });

  return (
    <View style={styles.marqueeContainer}>
      <View style={styles.marqueeBadge}>
        <Text style={styles.marqueeBadgeTxt}>UPDATE</Text>
      </View>
      <View style={styles.marqueeInner}>
        <Animated.View style={{ transform: [{ translateX }], width: marqueeWidth }}>
          <Text style={styles.marqueeText}>{message}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const FacilitySlider = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const slideWidth = isDesktop ? 800 : width * 0.9;
  
  const facilityImages = [
    'https://images.unsplash.com/photo-1590076241088-7a561110f845?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604342211516-24dc1c7423e8?q=80&w=800&auto=format&fit=crop'
  ];

  const scrollLeft = () => { scrollViewRef.current?.scrollTo({ x: -slideWidth, animated: true }); };
  const scrollRight = () => { scrollViewRef.current?.scrollTo({ x: slideWidth, animated: true }); };

  return (
    <View style={[styles.sliderContainer, { width: slideWidth }]}>
      <ScrollView ref={scrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.sliderScrollView}>
        {facilityImages.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={{ width: slideWidth, height: isDesktop ? 450 : 250, borderRadius: 12 }} resizeMode="cover" />
        ))}
      </ScrollView>
      <View style={styles.sliderControls}>
        <TouchableOpacity style={styles.arrowButton} onPress={scrollLeft}><Text style={styles.arrowText}>❮</Text></TouchableOpacity>
        <TouchableOpacity style={styles.arrowButton} onPress={scrollRight}><Text style={styles.arrowText}>❯</Text></TouchableOpacity>
      </View>
    </View>
  );
};

/* --- FULL STYLES --- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#003B2F' },
  
  navBar: { backgroundColor: '#FFFFFF', width: '100%', zIndex: 100, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', ...Platform.select({ web: { position: 'sticky', top: 0 } }) },
  navInnerFull: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 30 },
  
  logoGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', cursor: 'pointer' as any },
  logoBadgeWhite: { justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  navTitleDark: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  navSubtitleDark: { color: '#166534', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  
  centerMenu: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  menuItemDark: { color: '#0F172A', fontSize: 15, fontWeight: '600', marginHorizontal: 14, cursor: 'pointer' as any },
  
  actionButtonGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  solidGoldBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAB308', paddingHorizontal: 18, paddingVertical: 9, borderRadius: 6, marginLeft: 10, cursor: 'pointer' as any },
  solidGoldBtnTxt: { color: '#000000', fontSize: 14, fontWeight: '700', marginLeft: 6 },
  
  marqueeContainer: { backgroundColor: '#00261E', width: '100%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#004B39', overflow: 'hidden', height: 44 },
  marqueeBadge: { backgroundColor: '#B91C1C', paddingHorizontal: 20, height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  marqueeBadgeTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  marqueeInner: { flex: 1, overflow: 'hidden', justifyContent: 'center' },
  marqueeText: { color: '#E2E8F0', fontSize: 15, fontWeight: '500', letterSpacing: 0.5 },

  scrollContent: { flexGrow: 1, alignItems: 'center' },

  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 550 : 400, justifyContent: 'center' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0, 38, 30, 0.75)', alignItems: 'center', justifyContent: 'center', width: '100%' },
  heroContent: { paddingHorizontal: 40, alignItems: Platform.OS === 'web' ? 'flex-start' : 'center' },
  heroWelcome: { color: '#D4AF37', fontSize: 16, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 15 },
  heroHeading: { color: '#FFFFFF', fontSize: Platform.OS === 'web' ? 56 : 38, fontWeight: '800', marginBottom: 20, textAlign: Platform.OS === 'web' ? 'left' : 'center' },
  heroSubHeading: { color: '#E2E8F0', fontSize: Platform.OS === 'web' ? 20 : 16, lineHeight: 28, maxWidth: 600, textAlign: Platform.OS === 'web' ? 'left' : 'center', marginBottom: 35 },
  heroActionGroup: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center' },
  primaryHeroBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginRight: 15, marginBottom: 10, cursor: 'pointer' as any },
  primaryHeroBtnTxt: { color: '#00261E', fontSize: 16, fontWeight: 'bold' },
  secondaryHeroBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FFFFFF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginBottom: 10, cursor: 'pointer' as any },
  secondaryHeroBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  sectionWhite: { width: '100%', backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 60 },
  sectionDark: { width: '100%', backgroundColor: '#003B2F', alignItems: 'center', paddingVertical: 60 },
  sectionGray: { width: '100%', backgroundColor: '#F8FAFC', alignItems: 'center', paddingVertical: 60 },
  sectionInner: { paddingHorizontal: 40 },
  columnLeft: { marginBottom: Platform.OS === 'web' ? 0 : 40 },
  columnRight: {},

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottomWidth: 2, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
  sectionHeaderCenter: { alignItems: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 16, color: '#64748B', marginTop: 10, textAlign: 'center' },

  tabSwitcher: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabTxt: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTxtActive: { color: '#004B39' },
  masjidalContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', minHeight: 400, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 4px 15px rgba(0,0,0,0.03)' } }) },

  announcementCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 30, borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 5, borderTopColor: '#D4AF37', ...Platform.select({ web: { boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }) },
  announcementTag: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 12 },
  announcementTagTxt: { color: '#B45309', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  announcementDate: { color: '#64748B', fontSize: 14, fontWeight: '600', marginBottom: 15 },
  announcementHeadline: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  announcementBody: { fontSize: 16, color: '#475569', lineHeight: 26, marginBottom: 20 },
  readMoreBtn: { alignSelf: 'flex-start', cursor: 'pointer' as any },
  readMoreTxt: { color: '#004B39', fontSize: 15, fontWeight: '700' },

  spiritualGrid: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between' },
  spiritualCard: { flex: 1, padding: 20, alignItems: 'center' },
  spiritualHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  spiritualLabel: { color: '#D4AF37', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginLeft: 10 },
  arabicLarge: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 55, marginBottom: 20 },
  translationLight: { color: '#F8FAFC', fontSize: 18, fontStyle: 'italic', textAlign: 'center', lineHeight: 28, maxWidth: 500 },
  referenceGold: { color: '#D4AF37', fontSize: 15, fontWeight: '600', marginTop: 15 },
  verticalDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20 },
  horizontalDivider: { width: '80%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 30 },

  programsGrid: { width: '100%', flexDirection: 'column' },
  programsGridDesktop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  offeringCard: { width: Platform.OS === 'web' ? '48.5%' : '100%', backgroundColor: '#FFFFFF', padding: 30, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 4, borderTopColor: '#003B2F', ...Platform.select({ web: { boxShadow: '0 8px 20px rgba(0,0,0,0.04)' } }) },
  offeringCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  programIconWrapper: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(0, 75, 57, 0.08)', justifyContent: 'center', alignItems: 'center' },
  academySubtitleText: { color: '#D4AF37', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  academyTitleText: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  academyDescText: { fontSize: 15, color: '#64748B', lineHeight: 24 },

  sectionFacilityBg: { width: '100%', marginTop: 20 },
  facilityOverlay: { width: '100%', backgroundColor: 'rgba(0, 59, 47, 0.85)', paddingVertical: 60, alignItems: 'center' },
  sectionTitleWhite: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 5 },
  sectionSubtitleWhite: { fontSize: 16, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 30 },
  
  sliderContainer: { position: 'relative', borderRadius: 12, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 15px 35px rgba(0,0,0,0.3)' } }) },
  sliderScrollView: { borderRadius: 12 },
  sliderControls: { position: 'absolute', top: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, transform: [{ translateY: -25 }] },
  arrowButton: { width: 50, height: 50, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 25, justifyContent: 'center', alignItems: 'center', ...Platform.select({ web: { cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' } }) },
  arrowText: { fontSize: 24, fontWeight: '900', color: '#003B2F' },

  footer: { width: '100%', backgroundColor: '#00261E', alignItems: 'center', paddingVertical: 50 },
  footerInner: { alignItems: 'center' },
  footerBrand: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  footerAddress: { color: '#94A3B8', fontSize: 15, marginBottom: 5 },
  footerPhone: { color: '#D4AF37', fontSize: 15, fontWeight: 'bold' },
  footerLine: { width: 100, height: 1, backgroundColor: '#004B39', marginVertical: 20 },
  footerCopy: { color: '#475569', fontSize: 13 },
});