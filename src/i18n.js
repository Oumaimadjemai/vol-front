import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        accueil: "Accueil",
        voyage: "Voyage",
        offres: "Offres",
        apropos: "A propos",
        inscription: "Inscription",
        connexion: "Connexion",
        monProfil: "Mon Profil",
        deconnexion: "Déconnexion",
        hero_title: "Pilotez votre\nactivité\nen toute\nsimplicité",
        destinations_title: "Destinations Populaire",
        destinations_desc: "Destinations les plus populaires à travers le monde, des lieux historiques aux merveilles naturelles.",
        offres_title: "Offres Spéciales",
        days_trip: "Jours",
        login_welcome: "Bienvenue",
        login_subtitle: "Connectez-vous à votre compte",
        login_email_placeholder: "exemple@gmail.com",
        login_password_placeholder: "**********",
        login_forgot_password: "Mot de passe oublié ?",
        login_button: "Connexion",
        login_loading: "Connexion en cours...",
        login_or: "ou",
        login_google: "Continuer avec Google",
        login_no_account: "Vous n'avez pas un compte ?",
        login_signup: "Inscrivez-vous"
      },
    },
    en: {
      translation: {
        accueil: "Home",
        voyage: "Travel",
        offres: "Offers",
        apropos: "About",
        inscription: "Sign Up",
        connexion: "Sign In",
        monProfil: "My Profile",
        deconnexion: "Logout",
        hero_title: "Explore \nthe World, \nOne Flight \nat a Time",
        destinations_title: "Popular Destinations",
        destinations_desc: "The most popular destinations around the world, from historical sites to natural wonders.",
        offres_title: "Special Offers",
        days_trip: "Days Trip",
        login_welcome: "Welcome",
        login_subtitle: "Sign in to your account",
        login_email_placeholder: "example@gmail.com",
        login_password_placeholder: "**********",
        login_forgot_password: "Forgot password?",
        login_button: "Sign In",
        login_loading: "Signing in...",
        login_or: "or",
        login_google: "Continue with Google",
        login_no_account: "Don't have an account?",
        login_signup: "Sign Up"
      },
    },
    ar: {
      translation: {
        accueil: "الرئيسية  ",
        voyage: "السفر",
        offres: "العروض",
        apropos: "حول",
        inscription: "تسجيل",
        connexion: "دخول",
        monProfil: "ملفي الشخصي",
        deconnexion: "تسجيل الخروج",
        hero_title: "رحلتك\n تبدأ\n من السماء",
        destinations_title: "الوجهات الشهيرة",
        destinations_desc: "أكثر الوجهات شهرة حول العالم، من المواقع التاريخية إلى العجائب الطبيعية.",
        offres_title: "العروض الخاصة",
        days_trip: "أيام الرحلة",
        login_welcome: "مرحبا",
        login_subtitle: "سجل الدخول إلى حسابك",
        login_email_placeholder: "مثال@gmail.com",
        login_password_placeholder: "**********",
        login_forgot_password: "نسيت كلمة المرور؟",
        login_button: "تسجيل الدخول",
        login_loading: "جاري تسجيل الدخول...",
        login_or: "أو",
        login_google: "المتابعة مع Google",
        login_no_account: "ليس لديك حساب؟",
        login_signup: "سجل الآن"
      },
    },
  },
  lng: localStorage.getItem("lang") || "fr", // default language
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;