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
  useWindowDimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  
  // Responsive breakpoints
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  
  // Dynamic inner container width to keep content readable on ultra-wide screens
  const contentWidth = isDesktop ? 1200 : '90%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#003B2F" />
      
      {/* 1. EXTREME EDGE-TO-EDGE NAVIGATION (White Theme) */}
      <View style={styles.navBar}>
        {/* Notice we removed { width: contentWidth } to allow 100% width */}
        <View style={styles.navInnerFull}>
          
          {/* LOGO (Pushed extreme left) */}
          <View style={styles.logoGroup}>
            <View style={styles.logoBadgeWhite}>
              <MaterialCommunityIcons name="mosque" size={30} color="#166534" />
            </View>
            <View>
              <Text style={styles.navTitleDark}>Noor Ul Islam</Text>
              <Text style={styles.navSubtitleDark}>Windsor</Text>
            </View>
          </View>

          {/* CENTER MENU (Desktop Only - Dead center) */}
          {isDesktop && (
            <View style={styles.centerMenu}>
              <Text style={styles.menuItemDark}>Home</Text>
              <Text style={styles.menuItemDark}>About</Text>
              <View style={styles.menuItemWithIcon}>
                <Text style={styles.menuItemDark}>Programs</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#0F172A" />
              </View>
              <View style={styles.menuItemWithIcon}>
                <Text style={styles.menuItemDark}>Services</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#0F172A" />
              </View>
              <View style={styles.menuItemWithIcon}>
                <Text style={styles.menuItemDark}>Events</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#0F172A" />
              </View>
              <Text style={styles.menuItemDark}>Blog</Text>
              <View style={styles.menuItemWithIcon}>
                <Text style={styles.menuItemDark}>Donate</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#0F172A" />
              </View>
              <Text style={styles.menuItemDark}>Contact</Text>
            </View>
          )}

          {/* RIGHT ACTION BUTTONS (Desktop Only - Pushed extreme right) */}
          {isDesktop && (
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity style={styles.outlineBtn}>
                <MaterialCommunityIcons name="youtube" size={18} color="#DC2626" />
                <Text style={styles.outlineBtnTxt}>Watch Live</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.outlineBtn}>
                <MaterialCommunityIcons name="whatsapp" size={18} color="#16A34A" />
                <Text style={styles.outlineBtnTxt}>Join WhatsApp</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.outlineBtn}>
                <MaterialCommunityIcons name="book-open-page-variant" size={18} color="#166534" />
                <Text style={styles.outlineBtnTxt}>Online Quran</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.solidGoldBtn}>
                <MaterialCommunityIcons name="heart" size={16} color="#000000" />
                <Text style={styles.solidGoldBtnTxt}>Donate</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* MOBILE MENU ICON */}
          {!isDesktop && <Ionicons name="menu" size={32} color="#0F172A" />}
        </View>
      </View>
      {/* 2. FULL WIDTH MARQUEE */}
      <MarqueeBanner 
        message="🌙 MOON SIGHTING UPDATE: The crescent for Rabi' al-Thani was sighted. The new month has officially begun. Join us for weekly Ta'leem." 
        screenWidth={width}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 3. FULL BLEED HERO SECTION */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1519817914152-2a640101b0da?q=80&w=2000&auto=format&fit=crop' }} 
          style={styles.heroContainer}
        >
<View style={[styles.heroContent, { width: contentWidth }]}>
  <Text style={styles.heroWelcome}>Bismillah ir-Rahman ir-Rahim</Text>
  <Text style={styles.heroHeading}>Welcome to Noor ul Islam.</Text>
  <Text style={styles.heroSubHeading}>Sharing authentic Islamic knowledge, timely moon sighting updates, and nurturing the next generation through our dedicated Maktab.</Text>
  <View style={styles.heroActionGroup}>
    <TouchableOpacity style={styles.primaryHeroBtn}>
      <Text style={styles.primaryHeroBtnTxt}>View Prayer Times</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.secondaryHeroBtn}>
      <Text style={styles.secondaryHeroBtnTxt}>Enroll in Maktab</Text>
    </TouchableOpacity>
  </View>
</View>
        </ImageBackground>

        {/* 4. MAIN CONTENT SECTION (White Background) */}
        <View style={styles.sectionWhite}>
          <View style={[styles.sectionInner, { width: contentWidth, flexDirection: isDesktop ? 'row' : 'column' }]}>
            
            {/* LEFT: CALENDAR / MASJIDAL (Takes up 60% on desktop) */}
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

              {/* MASJIDAL WIDGET ZONE */}
              <View style={styles.masjidalContainer}>
                <MaterialCommunityIcons name="mosque" size={50} color="#004B39" opacity={0.2} style={styles.masjidalBgIcon} />
                <Ionicons name="calendar-outline" size={32} color="#004B39" />
                <Text style={styles.masjidalTitle}>Live Masjidal Integration</Text>
                <Text style={styles.masjidalDesc}>
                  Your Masjidal embed code will render beautifully in this spacious container, providing real-time Iqamah updates to the community.
                </Text>
              </View>
            </View>

            {/* RIGHT: MOON SIGHTING / ANNOUNCEMENTS (Takes up 40% on desktop) */}
            <View style={[styles.columnRight, isDesktop && { flex: 1 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Official Updates</Text>
              </View>
              
              <View style={styles.announcementCard}>
                <View style={styles.announcementTag}>
                  <Text style={styles.announcementTagTxt}>Moon Sighting</Text>
                </View>
                <Text style={styles.announcementDate}>Rabi' al-Thani 1448 AH</Text>
                <Text style={styles.announcementHeadline}>Crescent Moon Confirmed</Text>
                <Text style={styles.announcementBody}>
                  The Hilal Committee has accepted reports confirming the moon was sighted. We follow traditional local sighting principles.
                </Text>
                <TouchableOpacity style={styles.readMoreBtn}>
                  <Text style={styles.readMoreTxt}>Read Full Declaration &rarr;</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>

        {/* 5. SPIRITUAL SECTION (Deep Green Background) */}
        <View style={styles.sectionDark}>
          <View style={[styles.sectionInner, { width: contentWidth }]}>
            <View style={styles.spiritualGrid}>
              
              <View style={styles.spiritualCard}>
                <View style={styles.spiritualHeader}>
                  <FontAwesome5 name="book-open" size={18} color="#D4AF37" />
                  <Text style={styles.spiritualLabel}>Ayat of the Day</Text>
                </View>
                <Text style={styles.arabicLarge}>ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ</Text>
                <Text style={styles.translationLight}>"This is the Book! There is no doubt about it—a guide for those mindful of Allah."</Text>
                <Text style={styles.referenceGold}>— Surah Al-Baqarah 2:2</Text>
              </View>

              <View style={isDesktop || isTablet ? styles.verticalDivider : styles.horizontalDivider} />

              <View style={styles.spiritualCard}>
                <View style={styles.spiritualHeader}>
                  <MaterialCommunityIcons name="book-check" size={20} color="#D4AF37" />
                  <Text style={styles.spiritualLabel}>Hadith of the Day</Text>
                </View>
                <Text style={styles.translationLight}>"The most beloved of places to Allah are the masajid, and the most hated places are the markets."</Text>
                <Text style={styles.referenceGold}>— Sahih Muslim</Text>
              </View>

            </View>
          </View>
        </View>

        {/* 6. PROGRAMS SECTION (Light Gray Background) */}
<View style={[styles.programsGrid, isDesktop && styles.programsGridDesktop]}>
  <ProgramCard 
    title="Noor ul Islam Maktab" 
    desc="Our flagship daily program teaching children Quran recitation, Tajweed, and foundational Islamic character." 
    icon="school" 
  />
  <ProgramCard 
    title="Moon Sighting & Islamic Dates" 
    desc="Official, verified local moon sighting updates for Ramadan, Eid, and the start of every Islamic month." 
    icon="moon" 
  />
  <ProgramCard 
    title="Islamic Knowledge Hub" 
    desc="Daily spiritual nourishment featuring carefully selected Ayats from the Quran and authentic Ahadith." 
    icon="book-open" 
  />
</View>

        {/* 7. FULL WIDTH FOOTER */}
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

const ProgramCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <View style={styles.programCard}>
    <View style={styles.programIconWrapper}>
      <FontAwesome5 name={icon as any} size={24} color="#004B39" />
    </View>
    <Text style={styles.programTitle}>{title}</Text>
    <Text style={styles.programDesc}>{desc}</Text>
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

/* --- FULL SCREEN STYLES --- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#003B2F' },
  
// NAV BAR (Extreme Edge-to-Edge)
  navBar: { backgroundColor: '#FFFFFF', width: '100%', zIndex: 100, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', ...Platform.select({ web: { position: 'sticky', top: 0 } }) },
  navInnerFull: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 30 },
  
  logoGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  logoBadgeWhite: { justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  navTitleDark: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  navSubtitleDark: { color: '#166534', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  
  centerMenu: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  menuItemDark: { color: '#0F172A', fontSize: 15, fontWeight: '600', marginHorizontal: 12, cursor: 'pointer' as any },
  menuItemWithIcon: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, cursor: 'pointer' as any },
  
  actionButtonGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginLeft: 10, cursor: 'pointer' as any },
  outlineBtnTxt: { color: '#0F172A', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  
  solidGoldBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAB308', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, marginLeft: 10, cursor: 'pointer' as any },
  solidGoldBtnTxt: { color: '#000000', fontSize: 14, fontWeight: '700', marginLeft: 6 },
  // MARQUEE
  marqueeContainer: { backgroundColor: '#00261E', width: '100%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#004B39', overflow: 'hidden', height: 44 },
  marqueeBadge: { backgroundColor: '#B91C1C', paddingHorizontal: 20, height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  marqueeBadgeTxt: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
  marqueeInner: { flex: 1, overflow: 'hidden', justifyContent: 'center' },
  marqueeText: { color: '#E2E8F0', fontSize: 15, fontWeight: '500', letterSpacing: 0.5 },

  // SCROLL CONTAINER
  scrollContent: { flexGrow: 1, alignItems: 'center' },

  // HERO (Edge to Edge)
  heroContainer: { width: '100%', height: Platform.OS === 'web' ? 550 : 400, justifyContent: 'center' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0, 38, 30, 0.75)', alignItems: 'center', justifyContent: 'center', width: '100%' },
  heroContent: { paddingHorizontal: 20, alignItems: Platform.OS === 'web' ? 'flex-start' : 'center' },
  heroWelcome: { color: '#D4AF37', fontSize: 16, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 15 },
  heroHeading: { color: '#FFFFFF', fontSize: Platform.OS === 'web' ? 56 : 38, fontWeight: '800', marginBottom: 20, textAlign: Platform.OS === 'web' ? 'left' : 'center' },
  heroSubHeading: { color: '#E2E8F0', fontSize: Platform.OS === 'web' ? 20 : 16, lineHeight: 28, maxWidth: 600, textAlign: Platform.OS === 'web' ? 'left' : 'center', marginBottom: 35 },
  heroActionGroup: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center' },
  primaryHeroBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginRight: 15, marginBottom: 10 },
  primaryHeroBtnTxt: { color: '#00261E', fontSize: 16, fontWeight: 'bold' },
  secondaryHeroBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FFFFFF', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8, marginBottom: 10 },
  secondaryHeroBtnTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  // SECTIONS (Edge to Edge Containers)
  sectionWhite: { width: '100%', backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 60 },
  sectionDark: { width: '100%', backgroundColor: '#003B2F', alignItems: 'center', paddingVertical: 60 },
  sectionGray: { width: '100%', backgroundColor: '#F8FAFC', alignItems: 'center', paddingVertical: 60 },
  sectionInner: { paddingHorizontal: 20 },
  columnLeft: { marginBottom: Platform.OS === 'web' ? 0 : 40 },
  columnRight: {},

  // HEADERS
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, borderBottomWidth: 2, borderBottomColor: '#F1F5F9', paddingBottom: 15 },
  sectionHeaderCenter: { alignItems: 'center', marginBottom: 40 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  sectionSubtitle: { fontSize: 16, color: '#64748B', marginTop: 10 },

  // MASJIDAL CALENDAR
  tabSwitcher: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 8, padding: 4 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  tabTxt: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTxtActive: { color: '#004B39' },
  masjidalContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 40, alignItems: 'center', justifyContent: 'center', minHeight: 300, borderWidth: 1, borderColor: '#E2E8F0', position: 'relative', overflow: 'hidden' },
  masjidalBgIcon: { position: 'absolute', right: -20, bottom: -20 },
  masjidalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginTop: 15, marginBottom: 10 },
  masjidalDesc: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 24, maxWidth: 400 },

  // MOON SIGHTING
  announcementCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 30, borderWidth: 1, borderColor: '#E2E8F0', borderTopWidth: 5, borderTopColor: '#D4AF37', ...Platform.select({ web: { boxShadow: '0 10px 30px rgba(0,0,0,0.05)' } }) },
  announcementTag: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginBottom: 12 },
  announcementTagTxt: { color: '#B45309', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  announcementDate: { color: '#64748B', fontSize: 14, fontWeight: '600', marginBottom: 15 },
  announcementHeadline: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  announcementBody: { fontSize: 16, color: '#475569', lineHeight: 26, marginBottom: 20 },
  readMoreBtn: { alignSelf: 'flex-start' },
  readMoreTxt: { color: '#004B39', fontSize: 15, fontWeight: '700' },

  // SPIRITUAL SECTION
  spiritualGrid: { flexDirection: Platform.OS === 'web' ? 'row' : 'column', alignItems: 'center', justifyContent: 'space-between' },
  spiritualCard: { flex: 1, padding: 20, alignItems: 'center' },
  spiritualHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  spiritualLabel: { color: '#D4AF37', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginLeft: 10 },
  arabicLarge: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', lineHeight: 55, marginBottom: 20 },
  translationLight: { color: '#F8FAFC', fontSize: 18, fontStyle: 'italic', textAlign: 'center', lineHeight: 28, maxWidth: 500 },
  referenceGold: { color: '#D4AF37', fontSize: 15, fontWeight: '600', marginTop: 15 },
  verticalDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20 },
  horizontalDivider: { width: '80%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 30 },

  // PROGRAMS GRID
  programsGrid: { width: '100%', flexDirection: 'column' },
  programsGridDesktop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  programCard: { width: Platform.OS === 'web' ? '48%' : '100%', backgroundColor: '#FFFFFF', padding: 25, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', ...Platform.select({ web: { boxShadow: '0 4px 15px rgba(0,0,0,0.03)' } }) },
  programIconWrapper: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0, 75, 57, 0.08)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  programTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  programDesc: { fontSize: 15, color: '#64748B', lineHeight: 22 },

  // FOOTER
  footer: { width: '100%', backgroundColor: '#00261E', alignItems: 'center', paddingVertical: 50 },
  footerInner: { alignItems: 'center' },
  footerBrand: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  footerAddress: { color: '#94A3B8', fontSize: 15, marginBottom: 5 },
  footerPhone: { color: '#D4AF37', fontSize: 15, fontWeight: 'bold' },
  footerLine: { width: 100, height: 1, backgroundColor: '#004B39', marginVertical: 20 },
  footerCopy: { color: '#475569', fontSize: 13 },
});