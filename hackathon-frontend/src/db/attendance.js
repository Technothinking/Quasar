import { supabase } from '../lib/supabase';
import { today, now } from '../utils/time';

/* ---------- CHECK IN ---------- */

export const checkIn = async ({
  userId,
  projectId,
  role = 'supervisor',
  method = 'supervisor',
}) => {
  const { data, error } = await supabase
    .from('attendances')
    .insert([
      {
        project_id: projectId,
        user_id: userId,
        role: role,
        date: today(),
        check_in_time: new Date().toISOString(),
        method: method,
        status: 'present',
      }
    ]);

  if (error) throw error;
  return data;
};

/* ---------- CHECK OUT ---------- */

export const checkOut = async (userId, projectId) => {
  const { data, error } = await supabase
    .from('attendances')
    .update({
      check_out_time: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .eq('date', today());

  if (error) throw error;
  return data;
};

/* ---------- READ ---------- */

export const getTodayAttendance = async (userId, projectId) => {
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .eq('date', today())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Fetch attendance error:', error);
    return null;
  }
  return data;
};

export const getAllTodayAttendance = async (projectId) => {
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('project_id', projectId)
    .eq('date', today());

  if (error) throw error;
  return data;
};
