// iconMap.js

// 🔹 Solid icons
import {
  faUser,
  faPhone,
  faVenusMars,
  faCalendarDays,
  faCity,
  faBuilding,
  faGroupArrowsRotate,
  faCircleInfo,
  faLocationDot,
  faDroplet,
  faRulerVertical,
  faWeightScale,
  faNotesMedical,
  faBriefcase,
  faBarsProgress,
  faFile,
  faBuildingColumns,
  faCreditCard,
  faUserTie,
  faGlobe,
  faMapPin,
  faBullseye,
  faUserDoctor,
  faUserGraduate,
  faAward,
  faHouseMedical,
  faUserNurse,
  faCircleCheck,
  faEnvelope,
  faMessage,
  faNoteSticky,
  faBed,
  faHourglassHalf,
  faHandshake,
  faHospitalUser,
} from "@fortawesome/free-solid-svg-icons";

// 🔹 Brand icons
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export const iconMap = {
  // --- User & Personal Info ---
  user: faUser,
  phone: faPhone,
  gender: faVenusMars,
  birthdate: faCalendarDays,
  address: faLocationDot,
  city: faCity,
  zone: faGroupArrowsRotate,
  building : faBuilding,
  bio: faCircleInfo,
  blood_group: faDroplet,
  height: faRulerVertical,
  weight: faWeightScale,

  // --- Medical / Healthcare ---
  medical_history: faNotesMedical,
  specialization: faUserDoctor,
  degree: faUserGraduate,
  bmdc_no: faAward,
  chamber_address: faHouseMedical,
  training: faUserNurse,
  experience: faCircleCheck,
  patient: faHospitalUser,
  bed: faBed,
  diaper: faHandshake,
  status: faHourglassHalf,

  // --- Business / Finance ---
  company_name: faBriefcase,
  business_type: faBarsProgress,
  tin_number: faFile,
  bank: faBuildingColumns,
  account_number: faCreditCard,
  account_name: faUserTie,
  swift: faGlobe,
  routing: faMapPin,
  branch_name: faBullseye,

  // --- Communication ---
  email: faEnvelope,
  message: faMessage,
  note: faNoteSticky,
  whatsapp: faWhatsapp, // ✅ Brand icon
};
