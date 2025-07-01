// lib/api/student.ts
import axios from "axios"

export const confirmLink = async (parentId: number) => {
  return await axios.post(`/students/confirm_link/${parentId}/`)
}

export const requestUnlink = async (parentId: number) => {
  return await axios.post(`/students/unlink_request/${parentId}/`)
}
