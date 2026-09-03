export type DeliveryStatus =
  | 'items-expected'
  | 'items-received'
  | 'order-received'
  | 'driver-on-the-way-to-pickup'
  | 'driver-arrived-at-first-pickup'
  | 'out-for-delivery'
  | 'delivered'
  | 'delivery-partially-successful'
  | 'delivery-unsuccessful'
  | 'status-unknown'

export interface MilestoneData {
  datetime: string
  driver_expected_from?: string
  driver_expected_to?: string
  proof_of_delivery?: ProofOfDelivery | null
}

export interface ProofOfDelivery {
  photo?: string | null
  coordinates?: { latitude: number; longitude: number } | null
}

export interface RecipientAddress {
  address_line_1: string
  address_line_2: string
  city: string
  postcode: string
  latitude: number
  longitude: number
}

export interface RecipientDetails {
  contact_name: string
  phone_number: string
  email: string
  company_name: string | null
}

export interface SenderDetails {
  company_name: string
  logo_url: string
}

export interface DriverDetails {
  id: string
  first_name: string
  full_name: string
  profile_image: string
  has_uploaded_profile_image: boolean
  total_deliveries: number
  average_rating: number | null
}

export interface Driver {
  details: DriverDetails
  recent_location: { latitude: number; longitude: number } | null
}

export interface TrackingApiResponse {
  data: {
    id: number
    order_location_id: number
    instruction: string
    instruction_details: string | null
    fulfilment_date: string
    attempted_at: string | null
    status: DeliveryStatus
    tracking_code: string
    web_tracking_url: string
    recipient_address: RecipientAddress
    recipient_details: RecipientDetails
    sender_details: SenderDetails
    driver: Driver
    milestones: Record<string, MilestoneData>
    review: { rating: number; message: string; reviewer_name: string } | null
    time_zone: string
  }
  meta: {
    all_statuses: string[]
  }
  links: {
    track: {
      rel: string
      method: string
      href: string
    }
  }
}

export interface TimelineStep {
  key: string
  label: string
  description: string
  timestamp: string | null
  completed: boolean
  driverEta?: { from: string; to: string | null } | null
  proofOfDelivery?: ProofOfDelivery | null
}

export interface DeliveryViewModel {
  id: number
  code: string
  status: DeliveryStatus
  timeZone: string
  fulfilmentDate: string
  attemptedAt: string | null
  instruction: string | null
  instructionDetails: string | null
  webTrackingUrl: string
  sender: { name: string; logoUrl: string }
  recipient: {
    contactName: string
    phoneNumber: string
    email: string
    companyName: string | null
  }
  address: {
    lines: string[]
    postcode: string
    latitude: number
    longitude: number
  }
  driver: {
    name: string
    photoUrl: string | null
    deliveries: number
    rating: number
  } | null
  deliveredAt: string | null
  driverEta: { from: string; to: string | null } | null
  proofOfDelivery: ProofOfDelivery | null
  timeline: TimelineStep[]
}
