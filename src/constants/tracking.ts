import type { DeliveryStatus } from '../types/tracking'

interface StatusMeta {
  title: string
  description: string
  color: string
  bgColor: string
  icon: string
}

export const STATUS_META: Record<string, StatusMeta> = {
  'items-expected': {
    title: 'Items Expected',
    description: "We're expecting your items at our facility",
    color: '#6b7280',
    bgColor: '#f3f4f6',
    icon: 'package',
  },
  'items-received': {
    title: 'Items Received',
    description: 'Your items have arrived at our facility',
    color: '#0891b2',
    bgColor: '#ecfeff',
    icon: 'warehouse',
  },
  'order-received': {
    title: 'Order Received',
    description: 'Your order has been received and confirmed',
    color: '#0891b2',
    bgColor: '#ecfeff',
    icon: 'file-check',
  },
  'driver-on-the-way-to-pickup': {
    title: 'Driver En Route to Pickup',
    description: 'A driver is on their way to collect your items',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: 'navigation',
  },
  'driver-arrived-at-first-pickup': {
    title: 'Driver Arrived at Pickup',
    description: 'The driver has arrived at the pickup location',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: 'map-pin',
  },
  'out-for-delivery': {
    title: 'Out for Delivery',
    description: 'Your package is on its way to you',
    color: '#2563eb',
    bgColor: '#eff6ff',
    icon: 'truck',
  },
  delivered: {
    title: 'Delivered',
    description: 'Your package has been successfully delivered',
    color: '#059669',
    bgColor: '#ecfdf5',
    icon: 'check-circle',
  },
  'delivery-partially-successful': {
    title: 'Partially Delivered',
    description: 'Some items were delivered successfully',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    icon: 'alert-circle',
  },
  'delivery-unsuccessful': {
    title: 'Delivery Unsuccessful',
    description: 'We were unable to complete your delivery',
    color: '#dc2626',
    bgColor: '#fef2f2',
    icon: 'x-circle',
  },
  'status-unknown': {
    title: 'Status Unknown',
    description: 'The current status of your delivery is unknown',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    icon: 'help-circle',
  },
}

export const ALWAYS_SHOWN_STEPS: string[] = ['out-for-delivery', 'delivered']

export const CORE_API_URL =
  import.meta.env.VITE_CORE_API_URL || 'https://staging-api.deliveryapp.com'

export const ACTIVE_STATUSES: DeliveryStatus[] = [
  'items-expected',
  'items-received',
  'order-received',
  'driver-on-the-way-to-pickup',
  'driver-arrived-at-first-pickup',
  'out-for-delivery',
]
