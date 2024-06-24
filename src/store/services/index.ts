import { Member, Task } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://x8ki-letl-twmt.n7.xano.io/api:tSDGfQun/" }),
  endpoints: (builder) => ({
    getAllMembers: builder.query<Member[], { query: string }>({
      query: ({ query }) => ({
        url: `members?${query}`,
        method: "GET",
      }),
    }),
    // 
    getMemberById: builder.query<Member, number | null>({
      query: (members_id) => ({
        url: `members/${members_id}`,
        method: "GET",
      }),
    }),
    // 
    createMember: builder.mutation<Member, Partial<Member>>({
      query: (member) => ({
        url: `members`,
        method: "POST",
        body: member,
      }),
    }),
    // 
    deleteMember: builder.mutation<{ message?: string }, number>({
      query: (members_id) => ({
        url: `members/${members_id}`,
        method: "DELETE",
      }),
    }),
    // 
    updateMember: builder.mutation<Member, Partial<Member>>({
      query: (members) => ({
        url: `members/${members.id}`,
        method: "PATCH",
        body: members,
      }),
    }),
    // 
    getAllTasks: builder.query<Task[], { query: string }>({
      query: ({ query }) => ({
        url: `tasks?${query}`,
        method: "GET",
      }),
    }),
    // 
    getTaskById: builder.query<Task, number | null>({
      query: (tasks_id) => ({
        url: `tasks/${tasks_id}`,
        method: "GET",
      }),
    }),
    // 
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: `tasks`,
        method: "POST",
        body: task,
      }),
    }),
    // 
    deleteTask: builder.mutation<{ message?: string }, number>({
      query: (tasks_id) => ({
        url: `tasks/${tasks_id}`,
        method: "DELETE",
      }),
    }),
    // 
    updateTask: builder.mutation<Member, Partial<Member>>({
      query: (task) => ({
        url: `tasks/${task.id}`,
        method: "PATCH",
        body: task,
      }),
    }),
    // 
  }),
});

export default api
