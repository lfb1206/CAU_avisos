'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { peopleData } from '@/resources/constants/peopleData'


import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
//const sql = postgres(process.env.POSTGRES_URL!);


export async function getAllPeople() {
  const session = await auth();
  if (session) return peopleData;
  else return {};
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales no válidas.';
        default:
          return 'Algo salió mal.';
      }
    }
    throw error;
  }
}