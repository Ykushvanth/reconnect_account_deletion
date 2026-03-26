import bcrypt from 'bcryptjs';
import { supabase } from './supabase.js';

/**
 * Authenticate a user using the same custom auth the Flutter app uses:
 * - Fetch row from users_table by email
 * - Verify password against BCrypt hash stored in password_hash
 * - Return full user profile on success
 */
export async function loginWithEmailPassword(email, password) {
  const { data, error } = await supabase
    .from('users_table')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Invalid email or password.');

  const hash = data.password_hash;
  if (!hash) throw new Error('Account has no password set. Use Google sign-in.');

  const isValid = await bcrypt.compare(password, hash);
  if (!isValid) throw new Error('Invalid email or password.');

  return mapUserRow(data);
}

/**
 * Google sign-in: look up user in users_table by email.
 * If not found, we don't create an account here (the mobile app does that).
 */
export async function loginWithGoogle(email) {
  const { data, error } = await supabase
    .from('users_table')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error(
      'No ReConnect account found for this Google account. Please sign up in the mobile app first.'
    );
  }

  return mapUserRow(data);
}

/**
 * Fetch full profile for a user by ID (used on dashboard).
 */
export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('users_table')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw new Error(error.message);
  return mapUserRow(data);
}

/**
 * Permanently delete the user's row from users_table.
 */
export async function deleteAccount(userId) {
  const { error } = await supabase
    .from('users_table')
    .delete()
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return true;
}

export async function requestPasswordResetEmail(email, { redirectTo } = {}) {
  const trimmedEmail = email?.trim();
  if (!trimmedEmail) throw new Error('Email is required.');

  const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
    redirectTo,
  });

  if (error) throw new Error(error.message);
  return true;
}

function mapUserRow(row) {
  return {
    id: row.user_id?.toString() ?? '',
    name: row.name ?? 'User',
    email: row.email ?? '',
    phone: row.phone ?? 'Not provided',
    gender: row.gender ?? 'Not specified',
    dob: row.date_of_birth ?? null,
    address: row.address ?? 'No address on file',
    aadhar: row.aadhar_number ?? 'Not linked',
    createdAt: row.created_at ?? null,
  };
}
