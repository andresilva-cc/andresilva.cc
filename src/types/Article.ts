export interface Article {
  type_of: string
  id: number
  title: string
  description: string
  readable_publish_date: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  collection_id: number | null
  published_timestamp: string
  positive_reactions_count: number
  cover_image: string
  social_image: string
  canonical_url: string
  created_at: string
  edited_at: string
  crossposted_at: string
  published_at: string
  last_comment_at: string
  reading_time_minutes: number
  tag_list: Array<string>
  tags: string
  body_html: string
  body_markdown: string
  user: {
    name: string
    username: string
    twitter_username: string
    github_username: string
    website_url: string | null
    profile_image: string
    profile_image_90: string
  },
  flare_tag: {
    bg_color_hex: string
    text_color_hex: string
  }
}
