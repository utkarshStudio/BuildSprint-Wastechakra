import {
  Activity, Armchair, ArrowDown, ArrowDownToLine, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp, ArrowUpCircle, ArrowUpRight,
  BadgeCheck, Ban, BellOff, BellRing, Bot, Box, Brain, Briefcase, Building, Building2,
  Calendar, CalendarDays, Camera, Car, ChartBar, ChartColumn, ChartNoAxesColumn,
  Check, CheckCircle, CheckCircle2, ChevronDown, ChevronRight, ChevronUp,
  ChevronsDownUp, Circle, CircleAlert, CircleDot, CircleX, ClipboardCheck, ClipboardList, Clock,
  CloudCheck, CloudOff, CloudUpload, Coins, Compass, Construction, Copy, Cpu, Crosshair, Database, Download,
  Droplets, ExternalLink, Eye, Factory, FileText, FileWarning, Filter, Flag, Flame,
  FlaskConical, Flower, Gauge, Gift, GitBranch, GlassWater, Globe, GraduationCap,
  Hand, HardHat, History, Home, Image, Images, Info, InfoIcon, Key, Landmark, Layers,
  LayoutDashboard, LayoutGrid, Leaf, LocateFixed, Lock, LogOut, Magnet, Mail,
  Map, MapPin, MapPinOff, Medal, Megaphone, Menu, MessageSquare, Monitor, MonitorSmartphone,
  MonitorUp, Navigation, NotebookPen, Pause, Pencil, Percent, Phone, Play, Plus, Recycle,
  RefreshCw, Repeat, Route, Save, Scale, ScanLine, Scissors, SearchCheck, Settings,
  ShieldCheck, Shirt, SlidersHorizontal, Sun, Sparkles, Sprout, Star, Tag, TextCursorInput,
  Thermometer, Ticket, Timer, ToggleLeft, Trash, Trash2, TreePalm, TrendingUp,
  TriangleAlert, Trophy, Truck, Upload, User, UserCircle, UserPlus, Users, Volume2,
  Wallet, Warehouse, Wind, Wrench, X, Zap, ZoomIn, Languages, Maximize, Minimize, Minus, FastForward, RotateCcw,
} from 'lucide-react';

const ICON_MAP = {
  account_balance: Landmark,
  account_balance_wallet: Wallet,
  account_circle: UserCircle,
  add: Plus,
  add_a_photo: Camera,
  admin_panel_settings: ShieldCheck,
  air: Wind,
  alt_route: GitBranch,
  analytics: ChartColumn,
  apartment: Building,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  arrow_right: ArrowRight,
  arrow_upward: ArrowUp,
  arrow_up_right: ArrowUpRight,
  assignment: ClipboardList,
  assignment_ind: ClipboardCheck,
  assignment_turned_in: ClipboardCheck,
  auto_awesome: Sparkles,
  autorenew: RefreshCw,
  badge: BadgeCheck,
  balance: Scale,
  bar_chart: ChartBar,
  block: Ban,
  bolt: Zap,
  business: Building2,
  business_center: Briefcase,
  calendar_today: Calendar,
  call: Phone,
  call_split: GitBranch,
  camera: Camera,
  camera_alt: Camera,
  campaign: Megaphone,
  cancel: CircleX,
  card_giftcard: Gift,
  category: LayoutGrid,
  chat: MessageSquare,
  check: Check,
  check_circle: CheckCircle,
  checkroom: Shirt,
  chevron_right: ChevronRight,
  close: X,
  cloud_done: CloudCheck,
  cloud_off: CloudOff,
  cloud_upload: CloudUpload,
  co2: Wind,
  construction: Construction,
  confirmation_number: Ticket,
  content_copy: Copy,
  content_cut: Scissors,
  copy: Copy,
  compost: Sprout,
  corporate_fare: Building,
  dashboard: LayoutDashboard,
  database: Database,
  dataset: Database,
  delete: Trash2,
  delete_forever: Trash2,
  delete_sweep: Trash,
  description: FileText,
  devices: MonitorSmartphone,
  devices_other: Monitor,
  directions: Navigation,
  directions_car: Car,
  domain: Building,
  double_arrow: FastForward,
  download: Download,
  eco: Leaf,
  edit: Pencil,
  edit_note: NotebookPen,
  emoji_events: Trophy,
  engineering: HardHat,
  error: CircleAlert,
  event: CalendarDays,
  event_repeat: Repeat,
  expand_less: ChevronUp,
  expand_more: ChevronDown,
  explore: Compass,
  fact_check: BadgeCheck,
  factory: Factory,
  filter_alt: Filter,
  flag: Flag,
  grass: Flower,
  globe: Globe,
  grid_view: LayoutGrid,
  group_work: Users,
  groups: Users,
  hardware: Wrench,
  help_outline: Info,
  history: History,
  home: Home,
  home_work: Warehouse,
  house: Home,
  indoor: Armchair,
  info: Info,
  input: TextCursorInput,
  inventory_2: Box,
  key: Key,
  layers: Layers,
  leaderboard: ChartColumn,
  leaf: Leaf,
  local_activity: Activity,
  local_fire_department: Flame,
  local_shipping: Truck,
  location_city: Building2,
  location_off: MapPinOff,
  location_on: MapPin,
  location_searching: LocateFixed,
  lock: Lock,
  logout: LogOut,
  loop: Repeat,
  magnet: Magnet,
  mail: Mail,
  map: Map,
  memory: Cpu,
  menu: Menu,
  military_tech: Medal,
  monitoring: MonitorUp,
  my_location: Crosshair,
  near_me: Navigation,
  north_east: ArrowUpRight,
  notifications_active: BellRing,
  notifications_off: BellOff,
  open_in_new: ExternalLink,
  output: ArrowUpCircle,
  park: TreePalm,
  payments: Coins,
  percent: Percent,
  people: Users,
  person: User,
  person_add: UserPlus,
  phone: Phone,
  phone_in_talk: Phone,
  photo: Image,
  photo_camera: Camera,
  photo_library: Images,
  place: MapPin,
  play_arrow: Play,
  policy: ShieldCheck,
  pause: Pause,
  language: Languages,
  fullscreen: Maximize,
  fullscreen_exit: Minimize,
  remove: Minus,
  fast_forward: FastForward,
  precision_manufacturing: Factory,
  priority_high: CircleAlert,
  psychology: Brain,
  public: Globe,
  qr_code_scanner: ScanLine,
  radio_button_checked: CircleDot,
  radio_button_unchecked: Circle,
  recycling: Recycle,
  redeem: Gift,
  refresh: RefreshCw,
  restart_alt: RotateCcw,
  report: FileWarning,
  route: Route,
  save: Save,
  scale: Scale,
  schedule: Clock,
  school: GraduationCap,
  science: FlaskConical,
  sensors: Cpu,
  settings: Settings,
  smart_toy: Bot,
  solar_power: Sun,
  speed: Gauge,
  stacked_bar_chart: ChartNoAxesColumn,
  star: Star,
  stars: Sparkles,
  sync: RefreshCw,
  swap_horiz: ArrowLeftRight,
  tag: Tag,
  task_alt: CheckCircle2,
  ticket: Ticket,
  timer: Timer,
  today: CalendarDays,
  toggle_on: ToggleLeft,
  toggle_off: ToggleLeft,
  tokens: Coins,
  touch_app: Hand,
  toys: Sparkles,
  trending_up: TrendingUp,
  troubleshoot: SearchCheck,
  tune: SlidersHorizontal,
  unfold_more: ChevronsDownUp,
  upload: Upload,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  vertical_align_bottom: ArrowDownToLine,
  arrow_downward: ArrowDown,
  view_in_ar: Box,
  visibility: Eye,
  volume_up: Volume2,
  volunteer_activism: Hand,
  warning: TriangleAlert,
  device_thermostat: Thermometer,
  water_bottle: GlassWater,
  water_drop: Droplets,
  work: Briefcase,
  yard: Sprout,
  zoom_in: ZoomIn,
};


export function Icon({ name, className = '', ...props }) {
  const IconComponent = ICON_MAP[name];

  if (!IconComponent) {
    console.log(`${name} icon not found fix it `);
    return (
      <span className={`material-symbols-outlined select-none inline-flex items-center justify-center leading-none ${className}`} {...props}>
        <InfoIcon size="1em" />
      </span>
    );
  }

  return <IconComponent className={className} size="1em" {...props} />;
}

export default Icon;

/* ---------------------------------------------------------------------------
 * Brand icons (inline SVG)
 * ------------------------------------------------------------------------- */

/**
 * WasteChakra brand mark — the rotating gear-chakra. Inline SVG so it stays
 * crisp at any size. Defaults to the brand dark slate (#00180b).
 */
export function WasteChakraLogo({ size = 40, dark = '#00180b', green = '#0a3a2a', light = '#abf854', className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="WasteChakra logo"
      role="img"
    >
      <defs>
        <path id="wc-tooth" d="M -7,-70 L -4,-85 L 4,-85 L 7,-70 Z" fill={dark} />
        <g id="wc-segment">
          <circle cx="0" cy="0" r="70" fill="none" stroke={dark} strokeWidth="10" strokeDasharray="110 330" transform="rotate(-90)" />
          <g transform="rotate(90)">
            <polygon points="-1,-82 -1,-58 17,-70" fill={dark} />
          </g>
          <use href="#wc-tooth" transform="rotate(15)" />
          <use href="#wc-tooth" transform="rotate(45)" />
          <use href="#wc-tooth" transform="rotate(75)" />
          <circle cx="0" cy="0" r="45" fill="none" stroke={green} strokeWidth="10" strokeDasharray="47.12 240" transform="rotate(-75)" />
          <g transform="rotate(75)">
            <polygon points="-1,-57 -1,-33 16,-45" fill={green} />
          </g>
        </g>
      </defs>
      <use href="#wc-segment" transform="rotate(0)" />
      <use href="#wc-segment" transform="rotate(120)" />
      <use href="#wc-segment" transform="rotate(240)" />
    </svg>
  );
}

const BRAND_COLOR = 'currentColor';

export function IconInstagram({ size = 20, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={BRAND_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function IconTwitter({ size = 20, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={BRAND_COLOR} className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function IconFacebook({ size = 20, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={BRAND_COLOR} className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function IconLinkedIn({ size = 20, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={BRAND_COLOR} className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

export function IconWhatsApp({ size = 20, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={BRAND_COLOR} className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
