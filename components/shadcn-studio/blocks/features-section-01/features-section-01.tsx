import type { ReactElement, ReactNode } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'

type FeatureItem = {
  icon: ReactElement
  title: string
  description: string
  cardBorderColor: string
  avatarTextColor: string
  avatarBgColor: string
}

type Props = {
  featuresList: FeatureItem[]
  heading?: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
  cta?: ReactNode
}

const Features = ({
  featuresList,
  heading = 'Discover the Exclusive Perks Today',
  subtitle = 'Explore key features designed to enhance your experience with intuitive navigation, robust security, and seamless functionality.',
  ctaLabel = 'See all features',
  ctaHref = '#',
  cta,
}: Props) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 sm:mb-16'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>{heading}</h2>
          <p className='text-muted-foreground max-w-3xl text-lg sm:text-xl'>{subtitle}</p>
          {cta ??
            (ctaLabel ? (
              <Button variant='outline' size='lg' render={<a href={ctaHref} />} nativeButton={false}>
                {ctaLabel}
                <ArrowRightIcon />
              </Button>
            ) : null)}
        </div>

        <div
          className={cn(
            'grid gap-6',
            featuresList.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {featuresList.map((feature, index) => (
            <Card
              key={index}
              className={cn('text-base shadow-none transition-colors duration-300', feature.cardBorderColor)}
            >
              <CardContent>
                <Avatar size='lg' className='mb-6 rounded-md after:border-0'>
                  <AvatarFallback
                    className={cn(
                      'rounded-md [&>svg]:size-6',
                      feature.avatarBgColor,
                      feature.avatarTextColor
                    )}
                  >
                    {feature.icon}
                  </AvatarFallback>
                </Avatar>
                <h6 className='mb-2 text-lg font-semibold'>{feature.title}</h6>
                <p className='text-muted-foreground'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
