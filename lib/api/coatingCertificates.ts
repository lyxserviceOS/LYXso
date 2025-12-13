// lib/api/coatingCertificates.ts
import type { CoatingCertificate } from '@/types/coating';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE_URL = getApiBaseUrl();

export interface GenerateCertificateResponse {
  success: boolean;
  certificate: CoatingCertificate;
  email_sent?: boolean;
  error?: string;
}

export interface GetCertificateResponse {
  certificate: CoatingCertificate;
  error?: string;
}

/**
 * Generate a coating certificate for a completed job
 */
export async function generateCoatingCertificate(
  orgId: string,
  jobId: string
): Promise<GenerateCertificateResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/coating/${jobId}/certificate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate certificate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
}

/**
 * Get certificate for a coating job
 */
export async function getCoatingCertificate(
  orgId: string,
  jobId: string
): Promise<GetCertificateResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/coating/${jobId}/certificate`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Certificate not found');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch certificate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
}

/**
 * Get public certificate by token (no auth required)
 */
export async function getPublicCertificate(
  token: string
): Promise<GetCertificateResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/public/certificate/${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Certificate not found');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch certificate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching public certificate:', error);
    throw error;
  }
}

/**
 * Download certificate as PDF
 */
export async function downloadCertificatePDF(
  orgId: string,
  jobId: string
): Promise<Blob> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/coating/${jobId}/certificate/pdf`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download certificate PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error downloading certificate PDF:', error);
    throw error;
  }
}

/**
 * Resend certificate email to customer
 */
export async function resendCertificateEmail(
  orgId: string,
  jobId: string
): Promise<{ success: boolean; message: string; sent_to: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/orgs/${orgId}/coating/${jobId}/certificate/resend`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to resend certificate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error resending certificate:', error);
    throw error;
  }
}

/**
 * Helper function to trigger download of PDF blob
 */
export function triggerPDFDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
