'use client'

import { useState } from 'react'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

type PricingPlan = {
  id: string
  title: string
  description: string
  monthly: number
  annual: number
  features?: string[]
}[]

type Props = {
  pricingData: PricingPlan
  heading?: string
  subtitle?: string
  monthlyLabel?: string
  annuallyLabel?: string
  ctaLabel?: string
  ctaHref?: string
  currency?: string
}

const PricingCards = ({
  pricingData,
  heading = 'Select the Best Plan for You!',
  subtitle = 'Discover Our Flexible Plans, Compare Features, and Choose the Ideal Option for Your Needs.',
  monthlyLabel = 'Monthly',
  annuallyLabel = 'Annually',
  ctaLabel = 'Get Started',
  ctaHref = '/',
  currency = '$',
}: Props) => {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:space-y-24 lg:px-8'>
        <div className='flex flex-col items-center gap-10 text-center'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>{heading}</h2>
            <p className='text-muted-foreground text-xl'>{subtitle}</p>
          </div>

          <div className='flex items-center gap-3'>
            <span className='font-medium'>{monthlyLabel}</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className='font-medium'>{annuallyLabel}</span>
          </div>
        </div>
        <div className='flex items-center justify-center gap-6 max-lg:flex-col'>
          {pricingData.map(plan => {
            const price = isAnnual ? plan.annual : plan.monthly
            const period = isAnnual ? annuallyLabel : monthlyLabel
            const savings = isAnnual ? plan.monthly * 12 - plan.annual : null

            const priceDisplay = (
              <div className='flex flex-col items-end'>
                <div className='flex items-end'>
                  <span className='text-primary text-5xl font-bold'>{currency}{price}</span>
                  <span className='text-muted-foreground ml-1 text-lg'>/{period}</span>
                </div>
                {savings && (
                  <span className='mt-1 text-sm font-medium text-green-600'>Save {currency}{savings.toFixed(2)}/{annuallyLabel}</span>
                )}
              </div>
            )

            return (
              <Card key={plan.id} className='w-full shadow-none sm:w-lg'>
                <CardContent className='flex justify-between gap-4'>
                  <div className='flex flex-col justify-center gap-5'>
                    <div className='flex flex-col gap-2'>
                      <h3 className='text-3xl font-semibold'>{plan.title}</h3>
                      <p className='text-muted-foreground text-base'>{plan.description}</p>
                    </div>
                    {plan.features && plan.features.length > 0 && (
                      <ul className='text-muted-foreground space-y-1 text-sm'>
                        {plan.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    )}
                    <div className='sm:hidden'>{priceDisplay}</div>
                    <Button size='lg' className='w-fit' render={<Link href={ctaHref} />}>
                      {ctaLabel}
                    </Button>
                  </div>

                  <Separator orientation='vertical' className='max-sm:hidden' />

                  <div className='flex items-center max-sm:hidden'>{priceDisplay}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default PricingCards
