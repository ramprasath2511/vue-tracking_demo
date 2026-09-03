import type { TrackingApiResponse, DeliveryViewModel } from '../types/tracking'
import { CORE_API_URL } from '../constants/tracking'
import { mapDeliveryResponse } from '../mappers/delivery'

export async function getDeliveryByCode(code: string): Promise<DeliveryViewModel> {
  const res = await fetch(
    `${CORE_API_URL}/api/v1/deliveries/by-code/${encodeURIComponent(code)}`,
    {
      headers: { Accept: 'application/json' },
    }
  )

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('No delivery found with that tracking code. Please check and try again.')
    }
    throw new Error(`Unable to fetch tracking details (status ${res.status}). Please try again later.`)
  }

  const json = (await res.json()) as TrackingApiResponse
  return mapDeliveryResponse(json)
}
