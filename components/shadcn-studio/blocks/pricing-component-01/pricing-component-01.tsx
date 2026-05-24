'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

type PricingPlanItem = {
  id: string
  title: string
  description: string
  monthly?: number
  annual?: number
  price?: string
  features?: string[]
  highlighted?: boolean
}

type Props = {
  pricingData: PricingPlanItem[]
  heading?: string
  subtitle?: string
  monthlyLabel?: string
  annuallyLabel?: string
  ctaLabel?: string
  ctaHref?: string
  cta?: ReactNode
  currency?: string
  mode?: 'toggle' | 'grid'
  renderPlanAction?: (planId: string) => ReactNode
  bestValueLabel?: string
}

const PricingCards = ({
  pricingData,
  heading = 'Select the Best Plan for You!',
  subtitle = 'Discover Our Flexible Plans, Compare Features, and Choose the Ideal Option for Your Needs.',
  monthlyLabel = 'Monthly',
  annuallyLabel = 'Annually',
  ctaLabel = 'Get Started',
  ctaHref = '/',
  cta,
  currency = '$',
  mode = 'toggle',
  renderPlanAction,
  bestValueLabel = 'Best value',
}: Props) => {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id='pricing' className='bg-muted py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:space-y-16 lg:px-8'>
        <div className='flex flex-col items-center gap-10 text-center'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>{heading}</h2>
            <p className='text-muted-foreground max-w-2xl text-lg sm:text-xl'>{subtitle}</p>
          </div>

          {mode === 'toggle' ? (
            <div className='flex items-center gap-3'>
              <span className='font-medium'>{monthlyLabel}</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className='font-medium'>{annuallyLabel}</span>
            </div>
          ) : null}
        </div>

        <div className='flex items-stretch justify-center gap-6 max-lg:flex-col'>
          {pricingData.map(plan => {
            const price =
              mode === 'grid'
                ? plan.price
                : isAnnual
                  ? plan.annual
                  : plan.monthly
            const period = isAnnual ? annuallyLabel : monthlyLabel
            const savings =
              mode === 'toggle' && isAnnual && plan.monthly && plan.annual
                ? plan.monthly * 12 - plan.annual
                : null

            const priceDisplay =
              mode === 'grid' ? (
                <div className='flex flex-col items-end'>
                  <span className='text-primary text-4xl font-bold sm:text-5xl'>{plan.price}</span>
                </div>
              ) : (
                <div className='flex flex-col items-end'>
                  <div className='flex items-end'>
                    <span className='text-primary text-5xl font-bold'>
                      {currency}
                      {price}
                    </span>
                    <span className='text-muted-foreground ms-1 text-lg'>/{period}</span>
                  </div>
                  {savings ? (
                    <span className='mt-1 text-sm font-medium text-green-600'>
                      Save {currency}
                      {savings.toFixed(2)}/{annuallyLabel}
                    </span>
                  ) : null}
                </div>
              )

            const action =
              mode === 'grid' && renderPlanAction ? (
                renderPlanAction(plan.id)
              ) : (
                cta ?? (
                  <Button size='lg' className='w-fit' render={<a href={ctaHref} />} nativeButton={false}>
                    {ctaLabel}
                  </Button>
                )
              )

            return (
              <Card
                key={plan.id}
                className={`w-full self-center shadow-none ${mode === 'toggle' ? 'max-w-2xl' : 'max-w-lg'} ${plan.highlighted ? 'ring-primary ring-2' : ''}`}
              >
                <CardContent className='flex h-full flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8'>
                  <div className='flex min-w-0 flex-col justify-center gap-5'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='text-2xl font-semibold sm:text-3xl'>{plan.title}</h3>
                        {plan.highlighted ? <Badge>{bestValueLabel}</Badge> : null}
                      </div>
                      <p className='text-muted-foreground text-base'>{plan.description}</p>
                    </div>

                    {plan.features && plan.features.length > 0 ? (
                      <ul className='text-muted-foreground space-y-1.5 text-sm'>
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}

                    <div className='sm:hidden'>{priceDisplay}</div>
                    <div className='space-y-3'>{action}</div>
                  </div>

                  <Separator orientation='vertical' className='max-sm:hidden self-stretch' />

                  <div className='flex shrink-0 items-center max-sm:hidden'>{priceDisplay}</div>
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
