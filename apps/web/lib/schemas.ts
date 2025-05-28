export interface EventI {
  id: string
  name: string
  date: string
  time: string
  location: string
  description: string
  userId: string
  isParticipant: boolean
  isOwner: boolean
  userEvent?: []
}
