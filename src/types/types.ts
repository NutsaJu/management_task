export type FilterFieldsType = {
  firstname: string
  lastname: string
  gender: 'male' | 'female'
};

export type TasksFilterFieldsType = {
  title: string
  status: string[]
  assignedMembers: number[],
  expiredTask: boolean
}

export type Member = {
  id: number,
  createdAt: string
  firstname: string,
  lastname: string,
  gender: string
  birthday: string
  salary: number
}

export type Task = {
  id: number
  createdAt: string
  title: string
  description: string
  completion_date: string
  status: string
  _assigned_member: AssignedMember | undefined
  assigned_member_id: number | null
}

export type AssignedMember = {
  id: number
  firstname: string
  lastname: string
}