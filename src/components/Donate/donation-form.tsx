'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { PayPalButtons } from '@paypal/react-paypal-js'

// Form validation schema
const donationSchema = z.object({
  amount: z.string().min(1, "Please select an amount"),
  customAmount: z.string().optional(),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  isMonthly: z.boolean().default(false),
})

const DonationForm = () => {
  const router = useRouter()
  const [isCustomAmount, setIsCustomAmount] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState('25')
  const [showPayPalButtons, setShowPayPalButtons] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "25",
      isMonthly: false,
    }
  })

  const watchIsMonthly = watch('isMonthly')
  
  const onSubmit = async (data: any) => {
    const amount = isCustomAmount ? data.customAmount : data.amount
    setSelectedAmount(amount)
    setShowPayPalButtons(true)
    
    sessionStorage.setItem('donorInfo', JSON.stringify({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      amount: amount,
      isMonthly: data.isMonthly
    }))
  }
  
  return (
    <div className="space-y-6">
      {!showPayPalButtons ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Choose Donation Amount</Label>
            <RadioGroup defaultValue="25" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <RadioGroupItem 
                  value="10" 
                  id="amount-10" 
                  className="peer sr-only" 
                  {...register("amount")}
                />
                <Label 
                  htmlFor="amount-10" 
                  className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  $10
                </Label>
              </div>
              <div>
                <RadioGroupItem 
                  value="25" 
                  id="amount-25" 
                  className="peer sr-only" 
                  {...register("amount")}
                />
                <Label 
                  htmlFor="amount-25" 
                  className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  $25
                </Label>
              </div>
              <div>
                <RadioGroupItem 
                  value="50" 
                  id="amount-50" 
                  className="peer sr-only" 
                  {...register("amount")}
                />
                <Label 
                  htmlFor="amount-50" 
                  className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  $50
                </Label>
              </div>
              <div>
                <RadioGroupItem 
                  value="custom" 
                  id="amount-custom" 
                  className="peer sr-only" 
                  onClick={() => setIsCustomAmount(true)}
                  {...register("amount")}
                />
                <Label 
                  htmlFor="amount-custom" 
                  className="flex h-14 items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  Custom
                </Label>
              </div>
            </RadioGroup>
            {isCustomAmount && (
              <div className="mt-4">
                <Label htmlFor="custom-amount">Enter Amount</Label>
                <Input 
                  id="custom-amount" 
                  type="number" 
                  min="1" 
                  placeholder="Enter amount" 
                  {...register("customAmount")}
                />
              </div>
            )}
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="monthly" {...register("isMonthly")} />
            <Label htmlFor="monthly">Make this a monthly donation</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full">Continue to Payment</Button>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Complete Your Donation</h3>
          <p className="mb-6">
            {watchIsMonthly 
              ? `You're setting up a monthly donation of $${selectedAmount} to MAMA FATIMA Children's Home.` 
              : `You're making a one-time donation of $${selectedAmount} to MAMA FATIMA Children's Home.`}
          </p>
          
          <PayPalButtons 
            style={{ 
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'donate'
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [{
                  amount: {
                    value: selectedAmount,
                    currency_code: 'USD',
                    breakdown: {
                      item_total: {
                        currency_code: 'USD',
                        value: selectedAmount
                      }
                    }
                  },
                  description: watchIsMonthly 
                    ? `Monthly donation to MAMA FATIMA Children's Home` 
                    : `One-time donation to MAMA FATIMA Children's Home`,
                  items: [{
                    name: watchIsMonthly ? 'Monthly Donation' : 'One-time Donation',
                    quantity: '1',
                    unit_amount: {
                      currency_code: 'USD',
                      value: selectedAmount
                    },
                    category: 'DONATION'
                  }]
                }],
                application_context: {
                  shipping_preference: 'NO_SHIPPING'
                }
              });
            }}
            onApprove={(data, actions) => {
              if (actions.order) {
                return actions.order.capture().then(function(details) {
                  router.push('/success');
                });
              } else {
                return Promise.resolve();
              }
            }}
          />
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => setShowPayPalButtons(false)}
          >
            Go Back
          </Button>
        </div>
      )}
    </div>
  )
}

export default DonationForm
