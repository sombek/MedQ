import Features from '@/components/shadcn-studio/blocks/features-section-01/features-section-01'
import { SwatchesIcon, ShieldSlashIcon, MagnifyingGlassIcon, StarIcon, DeviceMobileCameraIcon, LockKeyIcon } from "@phosphor-icons/react/dist/ssr"

const featuresList = [
  {
    icon: (
      <SwatchesIcon
      />
    ),
    title: 'User-Friendly Interface',
    description:
      "Navigate effortlessly with our intuitive design, optimised for all devices. Enjoy a seamless experience whether you're on a computer or mobile.",
    cardBorderColor: 'ring-primary/40 hover:ring-primary',
    avatarTextColor: 'text-primary',
    avatarBgColor: 'bg-primary/10'
  },
  {
    icon: (
      <ShieldSlashIcon
      />
    ),
    title: 'Secure Checkout',
    description:
      'Enjoy a safe shopping experience with multiple payment options and SSL encryption. Your personal and financial information is always protected.',
    cardBorderColor: 'ring-green-600/40 hover:ring-green-600 dark:ring-green-400/40 dark:hover:ring-green-400',
    avatarTextColor: 'text-green-600 dark:text-green-400',
    avatarBgColor: 'bg-green-600/10 dark:bg-green-400/10'
  },
  {
    icon: (
      <MagnifyingGlassIcon
      />
    ),
    title: 'Advanced Search',
    description:
      'Find products quickly with advanced filters, sorting options, and suggestion. Save time and effortlessly locate exactly what you need with ease.',
    cardBorderColor: 'ring-amber-600/40 hover:ring-amber-600 dark:ring-amber-400/40 dark:hover:ring-amber-400',
    avatarTextColor: 'text-amber-600 dark:text-amber-400',
    avatarBgColor: 'bg-amber-600/10 dark:bg-amber-400/10'
  },
  {
    icon: (
      <StarIcon
      />
    ),
    title: 'Customer Reviews and Ratings',
    description:
      'Make informed decisions with detailed product reviews and ratings from other buyers. Trust the experiences of fellow shoppers to guide choices.',
    cardBorderColor: 'ring-destructive/40 hover:ring-destructive',
    avatarTextColor: 'text-destructive',
    avatarBgColor: 'bg-destructive/10'
  },
  {
    icon: (
      <DeviceMobileCameraIcon
      />
    ),
    title: 'Mobile App Integration',
    description:
      'Enhance your shopping experience with our mobile app and push notifications. Stay updated on arrivals and exclusive offers directly on phone.',
    cardBorderColor: 'ring-sky-600/40 hover:ring-sky-600 dark:ring-sky-400/40 dark:hover:ring-sky-400',
    avatarTextColor: 'text-sky-600 dark:text-sky-400',
    avatarBgColor: 'bg-sky-600/10 dark:bg-sky-400/10'
  },
  {
    icon: (
      <LockKeyIcon
      />
    ),
    title: 'Security Features',
    description:
      'Protect your data with fraud detection and two-factor authentication. Ensure a secure environment for all transactions and account activities.',
    cardBorderColor: 'ring-primary/40 hover:ring-primary',
    avatarTextColor: 'text-primary',
    avatarBgColor: 'bg-primary/10'
  }
]

const FeaturesPage = () => {
  return <Features featuresList={featuresList} />
}

export default FeaturesPage
