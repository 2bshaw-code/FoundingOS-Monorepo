export const MARKETING_MEDIA = [
  { file: 'FoundingOS-Social-Product-Photo.mp4', title: 'Product photo to business action', format: 'Social short' },
  { file: 'FoundingOS-Social-WhatsApp-to-Work.mp4', title: 'WhatsApp to work', format: 'Social short' },
  { file: 'FoundingOS-Social-Business-in-Your-Pocket.mp4', title: 'Business in your pocket', format: 'Social short' },
  { file: 'FoundingOS-Customer-Introduction.mp4', title: 'Customer introduction', format: 'Product introduction' },
  { file: 'FoundingOS-Legal-16x9.mp4', title: 'Legal workspace', format: 'Landscape 16:9' },
  { file: 'FoundingOS-Legal-9x16.mp4', title: 'Legal workspace', format: 'Portrait 9:16' },
  { file: 'FoundingOS-Logistics-16x9.mp4', title: 'Logistics workspace', format: 'Landscape 16:9' },
] as const

export type MarketingMedia = typeof MARKETING_MEDIA[number]
export const marketingMediaPath = (media: MarketingMedia) => `/media/marketing-library/${media.file}`
export const marketingMediaUrl = (media: MarketingMedia) => `https://www.foundingos.com${marketingMediaPath(media)}`

export const MARKETING_SOCIAL_POSTS = [
  { file: 'FoundingOS-Social-Product-Photo.jpg', title: 'Snap it. Name it. Done.', format: 'Portrait 9:16', channel: 'Instagram', caption: 'Your next product starts with a photo.\n\nAdd an image, give it a name and keep the details together in FoundingOS Retail. Less spreadsheet juggling. More time for your business.\n\nExplore the FoundingOS preview at https://www.foundingos.com', hashtags: '#FoundingOS #SmallBusiness #Retail #ProductManagement' },
  { file: 'FoundingOS-Social-WhatsApp-to-Work.jpg', title: 'From conversation to context', format: 'Portrait 9:16', channel: 'Facebook', caption: 'A message is only the beginning.\n\nExplore how FoundingOS brings the customer, product and order intent into one connected workflow, ready for your review. A request is not a confirmed sale.\n\nSee the illustrative preview at https://www.foundingos.com', hashtags: '#FoundingOS #WhatsAppBusiness #SmallBusiness #ConnectedWorkflows' },
  { file: 'FoundingOS-Social-Business-in-Your-Pocket.jpg', title: 'One business. More connected.', format: 'Portrait 9:16', channel: 'Instagram', caption: 'Retail. Finance. People.\n\nOpen the workspace that fits the work, with FoundingOS bringing your business tools together. Workspace access varies by plan.\n\nTake a look at https://www.foundingos.com', hashtags: '#FoundingOS #BusinessInYourPocket #SmallBusiness #BusinessTools' },
  { file: 'FoundingOS-Customer-Introduction.jpg', title: 'A simple question. A connected next step.', format: 'Landscape 16:9', channel: 'LinkedIn', caption: 'Customer requests arrive while you are serving customers, checking stock or on the move.\n\nThe FoundingOS preview shows a connected way to organise the request and review what happens next. The conversation shown uses sample data, not a customer testimonial.\n\nExplore https://www.foundingos.com', hashtags: '#FoundingOS #CustomerExperience #RetailOperations #SmallBusiness' },
  { file: 'FoundingOS-Legal-16x9.jpg', title: 'Keep the conversation with the matter', format: 'Landscape 16:9', channel: 'LinkedIn', caption: 'Client updates should not get lost between a message and a matter.\n\nExplore the FoundingOS Legal demonstration: communications, matter records and billable work in a connected workspace. Illustrative sample data, not legal advice or a client case study.\n\nRequest a preview at https://www.foundingos.com', hashtags: '#FoundingOS #LegalTech #MatterManagement #ConnectedWorkflows' },
  { file: 'FoundingOS-Legal-9x16.jpg', title: 'Client message. Matter context.', format: 'Portrait 9:16', channel: 'Instagram', caption: 'A familiar message. A clearer place to keep the work.\n\nSee the FoundingOS Legal concept in action, connecting client communications with matter context. This is an illustrative demonstration with sample data, not legal advice.\n\nExplore https://www.foundingos.com', hashtags: '#FoundingOS #LegalTech #ClientCommunication #BusinessTools' },
  { file: 'FoundingOS-Logistics-16x9.jpg', title: 'Delivery conversations, connected', format: 'Landscape 16:9', channel: 'Facebook', caption: 'Delivery plans change. The conversation needs to stay connected to the work.\n\nThe FoundingOS Logistics demonstration explores customer messages alongside delivery records and next steps. The business and conversation shown are illustrative sample data.\n\nSee the preview at https://www.foundingos.com', hashtags: '#FoundingOS #Logistics #DeliveryManagement #CustomerExperience' },
] as const

export type MarketingSocialPost = typeof MARKETING_SOCIAL_POSTS[number]
export const marketingSocialPostPath = (post: MarketingSocialPost) => `/media/marketing-library/${post.file}`
export const marketingSocialPostText = (post: MarketingSocialPost) => `${post.caption}\n\n${post.hashtags}`
export const isPublicMarketingMedia = (pathname: string) =>
  MARKETING_MEDIA.some((media) => marketingMediaPath(media) === pathname)
  || MARKETING_SOCIAL_POSTS.some((post) => marketingSocialPostPath(post) === pathname)

export function withMarketingMediaLink(text: string, media: MarketingMedia) {
  const url = marketingMediaUrl(media)
  return text.includes(url) ? text : [text.trim(), url].filter(Boolean).join('\n\n')
}
