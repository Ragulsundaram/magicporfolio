import { IconType } from "react-icons";

// Once UI default icons (HeroIcons v2 - Outline variants for rounded corners)
import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineArrowPath,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineClipboard,
  HiOutlineMagnifyingGlass,
  HiOutlineLink,
  HiArrowUpRight,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineComputerDesktop,
  HiOutlineQuestionMarkCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineEyeDropper,
  HiOutlineMinus,
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineDocumentDuplicate,
  HiOutlineCheck,
  HiOutlineArrowsPointingIn,
  HiOutlineArrowsPointingOut,
  HiEnvelopeOpen,
  HiOutlineEnvelope,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineRocketLaunch,
  HiOutlineDocument,
  HiOutlineHome,
  HiOutlinePhoto,
  HiOutlineBookOpen,
  HiOutlineSquares2X2,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlineIdentification,
} from "react-icons/hi2";

// Social media icons (keeping the existing ones for social links)
import { FaDiscord, FaGithub, FaLinkedin, FaX, FaThreads, FaXTwitter, FaFacebook, FaPinterest, FaWhatsapp, FaReddit, FaTelegram, FaInstagram } from "react-icons/fa6";

// Brand/tech icons
import {
  SiJavascript,
  SiNextdotjs,
  SiFigma,
  SiSupabase,
} from "react-icons/si";

export const iconLibrary: Record<string, IconType> = {
  // Once UI default icons (matching the official iconset)
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  refresh: HiOutlineArrowPath,
  light: HiOutlineSun,
  dark: HiOutlineMoon,
  help: HiOutlineQuestionMarkCircle,
  info: HiOutlineInformationCircle,
  warning: HiOutlineExclamationTriangle,
  danger: HiOutlineExclamationCircle,
  checkbox: HiOutlineCheck,
  check: HiOutlineCheckCircle,
  copy: HiOutlineDocumentDuplicate,
  eyeDropper: HiOutlineEyeDropper,
  clipboard: HiOutlineClipboard,
  person: HiOutlineUser, // Updated to use Once UI default
  close: HiOutlineXMark,
  openLink: HiOutlineLink,
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiChevronRight,
  minus: HiOutlineMinus,
  plus: HiOutlinePlus,
  calendar: HiOutlineCalendar,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  search: HiOutlineMagnifyingGlass,
  security: HiOutlineShieldCheck,
  sparkle: HiOutlineSparkles,
  computer: HiOutlineComputerDesktop,
  minimize: HiOutlineArrowsPointingIn,
  maximize: HiOutlineArrowsPointingOut,
  
  // Form and navigation icons (using outline variants for consistency)
  email: HiOutlineEnvelope, // Updated to use HeroIcons outline (rounded corners)
  globe: HiOutlineGlobeAsiaAustralia,
  home: HiOutlineHome,
  gallery: HiOutlinePhoto,
  grid: HiOutlineSquares2X2,
  book: HiOutlineBookOpen,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  
  // Form field icons (new additions)
  phone: HiOutlinePhone, // For phone number field
  message: HiOutlineChatBubbleLeftRight, // For message field
  role: HiOutlineBriefcase, // For role selection field
  linkedin: HiOutlineLink, // Using outline version for consistency

  // Social media icons (keeping existing for consistency except LinkedIn)
  discord: FaDiscord,
  github: FaGithub,
  instagram: FaInstagram,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  
  // Brand/tech icons
  arrowUpRightFromSquare: HiArrowUpRight,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
