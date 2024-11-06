export interface Project {
  title: string
  description: string
  links?: Array<{ name?: string, url: string }>
  featured?: boolean
  technologies: Array<string>
}
