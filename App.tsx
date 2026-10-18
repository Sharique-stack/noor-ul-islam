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
  Image,
  Linking
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
    title: "Ta’leem Program: Reading Ahadeeth After Salah",
    subtitle: "Ta’leem Program",
    description: "The practice of reading Ahadeeth from the sayings of the Messenger of Allah (peace be upon him) takes place after each of the five daily prayers (Salah) throughout the week. This brief session, lasting approximately five minutes, is conducted every day following each prayer. The Ahadeeth are selected from renowned collections like Riyad us-Saliheen and Munthakhab Ahadeeth.",
    icon_name: "book-open"
  },
  {
    id: 2,
    title: "Maktab Program at Masjid Noor-ul-Islam",
    subtitle: "Maktab",
    description: "The Maktab program at Masjid Noor-ul-Islam is designed to provide children and young Muslims with foundational Islamic education in a nurturing and spiritual environment. Our Maktab serves as an essential platform for learning and preserving Islamic knowledge, with a focus on the Quran, basic Islamic principles, and the Sunnah of the Prophet Muhammad (peace be upon him).",
    icon_name: "graduation-cap"
  }
];

export default function App() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  
  const [marqueeText, setMarqueeText] = useState<string>(
    "🌙 ANNOUNCEMENTS — DHU AL-HIJJAH 1447: MOON WAS SIGHTED! 1st day of Dhu Al-Hijjah 1447 AH is Monday, 18th May, 2026. Day of Arafah is May 26th & Eid al-Adha is Wednesday, May 27th."
  );
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
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
            const cleanBody = marqueeSource.body.replace(/\n+/g, ' ');
            setMarqueeText(`📢 ${marqueeSource.date_context} - ${marqueeSource.headline}: ${cleanBody}`);
          }
          setAnnouncements(data.announcements);
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
        console.warn('Django API offline, displaying default noorulislam.ca content.', err);
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
              <Text style={styles.menuItemDark}>Prayer Timings</Text>
              <Text style={styles.menuItemDark}>Our Facility</Text>
              <Text style={styles.menuItemDark}>Announcements</Text>
              <Text style={styles.menuItemDark}>Ta’leem & Maktab</Text>
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
              <Text style={styles.heroWelcome}>Bismillah ir-Rahman ir-Rahim</Text>
              <Text style={styles.heroHeading}>Welcome to Noor ul Islam.</Text>
              <Text style={styles.heroSubHeading}>
                Masjid Noor Ul Islam — Madressa & Cultural Center of Windsor. A place of worship, learning, and building a strong community.
              </Text>
              <View style={styles.heroActionGroup}>
                <TouchableOpacity style={styles.primaryHeroBtn}>
                  <Text style={styles.primaryHeroBtnTxt}>View Prayer Times</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryHeroBtn}>
                  <Text style={styles.secondaryHeroBtnTxt}>Explore Programs</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* 4. PRAYER SCHEDULE SECTION */}
        <View style={styles.sectionWhite}>
          <View style={[styles.sectionInner, { width: contentWidth, maxWidth: 1100 }]}>
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
                  style={{ width: '100%', height: '100%', minHeight: 460 }}
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
        </View>

        {/* 5. SPIRITUAL SECTION (AYAT & HADITH OF THE DAY) */}
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

        {/* 6. OUR FACILITY SLIDER */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=1200&auto=format&fit=crop' }} 
          style={styles.sectionFacilityBg}
        >
          <View style={styles.facilityOverlay}>
            <View style={[styles.sectionInner, { width: contentWidth, alignItems: 'center' }]}>
              <View style={styles.sectionHeaderCenter}>
                <Text style={styles.sectionTitleWhite}>Our Facility</Text>
                <Text style={styles.sectionSubtitleWhite}>Masjid Noor Ul Islam & Cultural Center</Text>
              </View>
              <FacilitySlider />
            </View>
          </View>
        </ImageBackground>

        {/* 7. ANNOUNCEMENTS SECTION (Right after Our Facility) */}
        <View style={styles.sectionWhite}>
          <View style={[styles.sectionInner, { width: contentWidth, maxWidth: 1000 }]}>
            <View style={styles.announcementMainCard}>
              <Text style={styles.announcementTopBanner}>ANNOUNCEMENTS</Text>
              <Text style={styles.announcementHijriTitle}>DHU AL-HIJJAH 1447</Text>
              <Text style={styles.announcementItalicSub}>Moonsighting update</Text>
              
              <Text style={styles.announcementGreeting}>Assalamu-Alaikum</Text>
              
              <View style={styles.moonSightedBadge}>
                <Text style={styles.moonSightedBadgeText}>MOON WAS SIGHTED</Text>
              </View>

              <Text style={styles.announcementParagraph}>
                The crescent moon to commence the month of Dhu Al-Hijjah 1447 AH was looked for after the sunset on Sunday, 17th May 2026. Reports from committees confirm that the moon was sighted.
              </Text>

              <Text style={styles.announcementCommitteeTitle}>
                THE HILAL COMMITTEE OF TORONTO & VICINITY
              </Text>

              <Text style={styles.announcementParagraph}>
                has accepted these reports and has declared that the month of Dhu Al-Qa’dah 1447 AH will complete 29 days. Therefore, the 1st day of Dhu Al-Hijjah 1447 AH will be on Monday, 18th May, 2026.
              </Text>

              <Text style={styles.announcementParagraph}>
                The 9th of Dhul Hijjah (Day of Arafah) is on May 26th, and 10th Dhul Hijjah (Eid al Adha) is on May 27th. As the celebration lasts for 3 days after the day of Eid, Eid al-Adha begins on Wednesday May 27th, it will end on Friday May 29th.
              </Text>

              <TouchableOpacity 
                style={styles.hilalLinkRow} 
                onPress={() => Linking.openURL('https://hilalcommittee.com/')}
              >
                <Text style={styles.hilalLinkText}>
                  for more information please visit <Text style={styles.hilalLinkUnderline}>https://hilalcommittee.com/</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.eidSalahBox}>
                <Text style={styles.eidSalahTitle}>EID SALAH</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 8. TA'LEEM & MAKTAB PROGRAMS SECTION */}
        <View style={styles.sectionGray}>
          <View style={[styles.sectionInner, { width: contentWidth, maxWidth: 1100 }]}>
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

        {/* 9. FOOTER */}
        <View style={styles.footer}>
          <View style={[styles.footerInner, { width: contentWidth }]}>
            <Text style={styles.footerBrand}>NOOR UL ISLAM</Text>
            <Text style={styles.footerAddress}>659 Lincoln Road, Windsor, Ontario N8Y-2G8</Text>
            <Text style={styles.footerPhone}>519-999-2561</Text>
            <View style={styles.footerLine} />
            <Text style={styles.footerCopy}>© 2026 Islamic Center of Windsor. Built for the Community.</Text>
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
  const marqueeWidth = Platform.OS === 'web' ? screenWidth * 2 : screenWidth * 3.5;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 28000,
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
          <Text style={styles.marqueeText} numberOfLines={1}>{message}</Text>
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
  marqueeBadge: { backgroundColor: '#B91C1C', paddingHorizontal: 18, height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  marqueeBadgeTxt: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 },
  marqueeInner: { flex: 1, overflow: 'hidden', justifyContent: 'center' },
  marqueeText: { color: '#E2E8F0', fontSize: 15, fontWeight: '500', letterSpacing: 0.5 },

  scrollContent: { flexGrow: 1, alignItems: 'center' },

  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 550 : 400, justifyContent: 'center' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0, 38, 30, 0.75)', alignItems: 'center', justifyContent: 'center', width: '100%' },
  heroContent: { paddingHorizontal: 40, alignItems: Platform.OS === 'web' ? 'flex-start' : 'center' },
  heroWelcome: { color: '#D4AF37', fontSize: 16, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 15 },
  heroHeading: { color: '#FFFFFF', fontSize: Platform.OS === 'web' ? 56 : 38, fontWeight: '800', marginBottom: 20, textAlign: Platform.OS === 'web' ? 'left' : 'center' },
  heroSubHeading: { color: '#E2E8F0', fontSize: Platform.OS === 'web' ? 20 : 16, lineHeight: 28, maxWidth: 650, textAlign: Platform.OS === 'web' ? 'left' : 'center', marginBottom: 35 },
  heroActionGroup: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center' },
  primaryHeroBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginRight: 15, marginBottom: 10, cursor: 'pointer' as any },
  primaryHeroBtnTxt: { color: '#00261E', fontSize: 16, fontWeight: 'bold' },
  secondaryHeroBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FFFFFF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginBottom: 10, cursor: 'pointer' as any },
  secondaryHeroBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  sectionWhite: { width: '100%', backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 60 },
  sectionDark: { width: '100%', backgroundColor: '#003B2F', alignItems: 'center', paddingVertical: 60 },
  sectionGray: { width: '100%', backgroundColor: '#F8FAFC', alignItems: 'center', paddingVertical: 60 },
  sectionInner: { paddingHorizontal: 40 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottomWidth: 2, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
  sectionHeaderCenter: { alignItems: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A' },

  tabSwitcher: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabTxt: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTxtActive: { color: '#004B39' },
  masjidalContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', minHeight: 460, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 4px 15px rgba(0,0,0,0.03)' } }) },

  spiritualGrid: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between' },
  spiritualCard: { flex: 1, padding: 20, alignItems: 'center' },
  spiritualHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  spiritualLabel: { color: '#D4AF37', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginLeft: 10 },
  arabicLarge: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 55, marginBottom: 20 },
  translationLight: { color: '#F8FAFC', fontSize: 18, fontStyle: 'italic', textAlign: 'center', lineHeight: 28, maxWidth: 500 },
  referenceGold: { color: '#D4AF37', fontSize: 15, fontWeight: '600', marginTop: 15 },
  verticalDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20 },
  horizontalDivider: { width: '80%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 30 },

  sectionFacilityBg: { width: '100%' },
  facilityOverlay: { width: '100%', backgroundColor: 'rgba(0, 59, 47, 0.85)', paddingVertical: 60, alignItems: 'center' },
  sectionTitleWhite: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 5 },
  sectionSubtitleWhite: { fontSize: 16, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 30, textAlign: 'center' },
  
  sliderContainer: { position: 'relative', borderRadius: 12, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 15px 35px rgba(0,0,0,0.3)' } }) },
  sliderScrollView: { borderRadius: 12 },
  sliderControls: { position: 'absolute', top: '50%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, transform: [{ translateY: -25 }] },
  arrowButton: { width: 50, height: 50, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 25, justifyContent: 'center', alignItems: 'center', ...Platform.select({ web: { cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' } }) },
  arrowText: { fontSize: 24, fontWeight: '900', color: '#003B2F' },

  /* ANNOUNCEMENTS AFTER FACILITY */
  announcementMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: Platform.OS === 'web' ? 45 : 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopWidth: 6,
    borderTopColor: '#D4AF37',
    alignItems: 'center',
    ...Platform.select({ web: { boxShadow: '0 12px 35px rgba(0,0,0,0.06)' } })
  },
  announcementTopBanner: {
    color: '#004B39',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  announcementHijriTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
    textAlign: 'center',
  },
  announcementItalicSub: {
    color: '#475569',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  announcementGreeting: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    textAlign: 'center',
  },
  moonSightedBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 22,
  },
  moonSightedBadgeText: {
    color: '#B45309',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.2,
  },
  announcementParagraph: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 27,
    textAlign: 'center',
    maxWidth: 780,
    marginBottom: 18,
  },
  announcementCommitteeTitle: {
    color: '#003B2F',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: 10,
  },
  hilalLinkRow: {
    marginTop: 6,
    marginBottom: 28,
    cursor: 'pointer' as any,
  },
  hilalLinkText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  hilalLinkUnderline: {
    color: '#166534',
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
  eidSalahBox: {
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#F1F5F9',
    paddingTop: 22,
    alignItems: 'center',
  },
  eidSalahTitle: {
    color: '#003B2F',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  /* TA'LEEM & MAKTAB CARDS */
  programsGrid: { width: '100%', flexDirection: 'column' },
  programsGridDesktop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  offeringCard: { width: Platform.OS === 'web' ? '48.5%' : '100%', backgroundColor: '#FFFFFF', padding: 35, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 4, borderTopColor: '#003B2F', ...Platform.select({ web: { boxShadow: '0 8px 20px rgba(0,0,0,0.04)' } }) },
  offeringCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  programIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0, 75, 57, 0.08)', justifyContent: 'center', alignItems: 'center' },
  academySubtitleText: { color: '#D4AF37', fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  academyTitleText: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  academyDescText: { fontSize: 16, color: '#475569', lineHeight: 26 },

  footer: { width: '100%', backgroundColor: '#00261E', alignItems: 'center', paddingVertical: 50 },
  footerInner: { alignItems: 'center' },
  footerBrand: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  footerAddress: { color: '#94A3B8', fontSize: 15, marginBottom: 5 },
  footerPhone: { color: '#D4AF37', fontSize: 15, fontWeight: 'bold' },
  footerLine: { width: 100, height: 1, backgroundColor: '#004B39', marginVertical: 20 },
  footerCopy: { color: '#475569', fontSize: 13 },
});