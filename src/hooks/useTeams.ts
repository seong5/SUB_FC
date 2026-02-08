'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getTeamStats,
  getScheduleEvents,
  createScheduleEvent,
  deleteScheduleEvent,
  type TeamStats,
  type ScheduleEvent,
  type CreateScheduleEventDto,
} from '@/libs/teamsApi'

export function useTeamStatsQuery() {
  return useQuery<TeamStats>({
    queryKey: ['teams', 'stats'],
    queryFn: () => getTeamStats(),
  })
}

export function useScheduleEventsQuery() {
  return useQuery<ScheduleEvent[]>({
    queryKey: ['teams', 'schedule'],
    queryFn: () => getScheduleEvents(),
  })
}

export function useCreateScheduleEventMutation() {
  const qc = useQueryClient()
  return useMutation<ScheduleEvent, Error, CreateScheduleEventDto>({
    mutationKey: ['teams', 'schedule', 'create'],
    mutationFn: (payload) => createScheduleEvent(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams', 'schedule'] }),
  })
}

export function useDeleteScheduleEventMutation() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationKey: ['teams', 'schedule', 'delete'],
    mutationFn: (eventId) => deleteScheduleEvent(eventId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teams', 'schedule'] }),
  })
}
