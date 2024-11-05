export interface JobsRepositoryResponse {
  title: string
  company: string
  startDate: Date
  description: string
  technologies: Array<string>
}

export interface JobsRepository {
  getAll(): Array<JobsRepositoryResponse>
}
