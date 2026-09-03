import type {
  TrackingApiResponse,
  DeliveryViewModel,
  TimelineStep,
  ProofOfDelivery,
} from '../types/tracking'
import { STATUS_META, ALWAYS_SHOWN_STEPS } from '../constants/tracking'

function mapRecipient(details: TrackingApiResponse['data']['recipient_details']) {
  return {
    contactName: details.contact_name,
    phoneNumber: details.phone_number,
    email: details.email,
    companyName: details.company_name,
  }
}

function mapAddress(address: TrackingApiResponse['data']['recipient_address']) {
  return {
    lines: [address.address_line_1, address.address_line_2, address.city].filter(Boolean),
    postcode: address.postcode,
    latitude: address.latitude,
    longitude: address.longitude,
  }
}

function mapDriver(driver: TrackingApiResponse['data']['driver']) {
  const d = driver?.details
  if (!d) return null
  return {
    name: d.full_name,
    photoUrl: d.has_uploaded_profile_image ? d.profile_image : null,
    deliveries: d.total_deliveries,
    rating: d.average_rating ?? 0,
  }
}

function mapDriverEta(milestone: { driver_expected_from?: string; driver_expected_to?: string } | undefined) {
  if (!milestone?.driver_expected_from) return null
  return {
    from: milestone.driver_expected_from,
    to: milestone.driver_expected_to ?? null,
  }
}

function mapTimeline(milestones: TrackingApiResponse['data']['milestones']): TimelineStep[] {
  const presentKeys = Object.keys(milestones).sort((a, b) => {
    const aTime = milestones[a]?.datetime
    const bTime = milestones[b]?.datetime
    if (!aTime) return 1
    if (!bTime) return -1
    return new Date(aTime.replace(' ', 'T')).getTime() - new Date(bTime.replace(' ', 'T')).getTime()
  })

  const orderedKeys = [...presentKeys]
  for (const key of ALWAYS_SHOWN_STEPS) {
    if (!orderedKeys.includes(key)) orderedKeys.push(key)
  }

  return orderedKeys.map((key) => {
    const milestone = milestones[key]
    const meta = STATUS_META[key] ?? STATUS_META['status-unknown']
    const pod = milestone?.proof_of_delivery
    return {
      key,
      label: meta.title,
      description: meta.description,
      timestamp: milestone?.datetime ?? null,
      completed: Boolean(milestone?.datetime),
      driverEta: key === 'out-for-delivery' ? mapDriverEta(milestone) : null,
      proofOfDelivery: pod as ProofOfDelivery | undefined,
    }
  })
}

export function mapDeliveryResponse(response: TrackingApiResponse): DeliveryViewModel {
  const delivery = response.data
  const milestones = delivery.milestones ?? {}
  const deliveredMilestone = milestones.delivered
  const pod = deliveredMilestone?.proof_of_delivery

  return {
    id: delivery.id,
    code: delivery.tracking_code,
    status: delivery.status,
    timeZone: delivery.time_zone,
    fulfilmentDate: delivery.fulfilment_date,
    attemptedAt: delivery.attempted_at,
    instruction: delivery.instruction,
    instructionDetails: delivery.instruction_details,
    webTrackingUrl: delivery.web_tracking_url,
    sender: {
      name: delivery.sender_details?.company_name ?? 'Unknown Sender',
      logoUrl: delivery.sender_details?.logo_url ?? '',
    },
    recipient: mapRecipient(delivery.recipient_details),
    address: mapAddress(delivery.recipient_address),
    driver: mapDriver(delivery.driver),
    deliveredAt: deliveredMilestone?.datetime ?? null,
    driverEta: mapDriverEta(milestones['out-for-delivery']),
    proofOfDelivery: (pod as ProofOfDelivery | null) ?? null,
    timeline: mapTimeline(milestones),
  }
}
