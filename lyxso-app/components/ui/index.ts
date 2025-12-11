// components/ui/index.ts
// Export all UI components for easy imports

// Image Components
export { ImagePlaceholder, IMAGE_PRESETS } from "./ImagePlaceholder";
export type { ImagePlaceholderProps } from "./ImagePlaceholder";
export { ProgressiveImage, ImageGallery } from "./ProgressiveImage";

// Empty States
export {
  EmptyState,
  EmptyBookings,
  EmptyCustomers,
  EmptyVehicles,
  EmptyTires,
  EmptySearchResults,
  EmptyReports,
} from "./EmptyState";

// Loading Skeletons
export {
  Skeleton,
  ShimmerSkeleton,
  CardSkeleton,
  TableSkeleton,
  BookingCardSkeleton,
  CustomerCardSkeleton,
  StatsCardSkeleton,
  CalendarSkeleton,
  FormSkeleton,
  ListSkeleton,
  DashboardSkeleton,
  PageSkeleton,
  TireHotelSkeleton,
  ChartSkeleton,
} from "./LoadingSkeleton";

// Error Boundaries
export {
  ErrorBoundary,
  ErrorFallback,
  CompactErrorBoundary,
  SectionErrorBoundary,
} from "./ErrorBoundary";

// Micro-interactions
export {
  haptics,
  useReducedMotion,
  InteractiveButton,
  FloatingActionButton,
  SlideInCard,
  HoverCard,
  CountUp,
} from "./MicroInteractions";

// Search & Filters
export { SmartSearch, AdvancedFilters } from "./SmartSearch";

// Accessibility
export {
  SkipToContent,
  SROnly,
  LiveRegion,
  useFocusTrap,
  useKeyboardShortcuts,
  KeyboardShortcutsHelp,
  FocusRing,
  AccessibleButton,
  useHighContrastMode,
  FormField,
} from "./Accessibility";

// Performance & Virtualization
export {
  useInfiniteScroll,
  InfiniteScrollList,
  VirtualList,
  Pagination,
  usePerformanceMonitor,
  useDebounce,
  useThrottle,
  useLazyImage,
  usePrefetch,
  memoize,
} from "./Performance";
